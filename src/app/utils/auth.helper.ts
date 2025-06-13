import { ILoginProps, IRegisterProps } from '@/app/types/index';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  // FacebookAuthProvider,
  updateProfile,
  sendEmailVerification,
  getIdToken,
  signOut,
} from 'firebase/auth';
import { auth } from '../../components/lib/firebaseConfig';
export const APIURL = process.env.NEXT_PUBLIC_API_URL;

export async function register(userData: IRegisterProps) {
  let firebaseUser = null;

  try {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(userData.email)) {
      throw new Error('Invalid email format');
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );
      firebaseUser = userCredential.user;

      await updateProfile(firebaseUser, {
        displayName: userData.name,
        photoURL: userData.imgProfile,
      });

      await sendEmailVerification(firebaseUser);
    } catch (firebaseError) {
      let errorMsg = 'Firebase registration error';
      if (firebaseError && typeof firebaseError === 'object' && 'message' in firebaseError) {
        errorMsg = `Firebase registration error: ${(firebaseError as { message: string }).message}`;
      }
      if (firebaseError && typeof firebaseError === 'object' && 'code' in firebaseError) {
        const code = (firebaseError as { code: string }).code;
        switch (code) {
          case 'auth/email-already-in-use':
            throw new Error('This email is already registered');
          case 'auth/invalid-email':
            throw new Error('Invalid email format');
          case 'auth/operation-not-allowed':
            throw new Error('Email/password accounts are not enabled');
          case 'auth/weak-password':
            throw new Error('Password is too weak');
          default:
            throw new Error(errorMsg);
        }
      }
    }

    const response = await fetch(`${APIURL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ ...userData, firebaseUid: firebaseUser?.uid }),
    });

    if (!response.ok) {
      if (firebaseUser) {
        await firebaseUser.delete();
      }
      throw new Error(`Backend registration failed: ${response.statusText}`);
    }

    const firebase = await signInWithEmailAndPassword(auth, userData.email, userData.password);

    const userBackend = await response.json();

    console.log('USER BACKEND:', userBackend);
    const sessionData = {
      token: await getIdToken(firebase.user),
      user: {
        ...userBackend,
      },
    };
    localStorage.setItem('userSession', JSON.stringify(sessionData));

    const data = userBackend;
    return {
      user: firebaseUser,
      backendData: data,
      message: 'Registration successful. Please verify your email.',
    };
  } catch (error) {
    if (firebaseUser) {
      try {
        await firebaseUser.delete();
      } catch {
        // console.error("Error cleaning up Firebase user:", deleteError);
      }
    }
    throw new Error(
      (error instanceof Error ? error.message : String(error)) || 'Registration failed'
    );
  }
}

// Login con email y password
export async function login(userData: ILoginProps) {
  try {
    const firebase = await signInWithEmailAndPassword(auth, userData.email, userData.password);
    const userFirebase = firebase.user;
    const token = await getIdToken(userFirebase);
    const response = await fetch(`${APIURL}/users/firebase/${userFirebase.uid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get user from backend');
    }

    const userBackend = await response.json();

    return { user: userBackend, token };
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
}

// Login con Google
export async function loginWithGoogle() {
  let firebaseUser = null;
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    firebaseUser = result.user;

    const token = await getIdToken(firebaseUser);

    if (!firebaseUser || !token) {
      throw new Error('Failed to authenticate with Google');
    }

    const userData = {
      name: firebaseUser.displayName || '',
      email: firebaseUser.email || '',
      imgProfile: firebaseUser.photoURL || '',
      firebaseUid: firebaseUser.uid,
    };

    try {
      const verifyResponse = await fetch(`${APIURL}/users/firebase/${firebaseUser.uid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      let backendUser;

      if (!verifyResponse.ok) {
        const createResponse = await fetch(`${APIURL}/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...userData,
          }),
        });

        if (!createResponse.ok) {
          throw new Error('Failed to create user in backend');
        }

        backendUser = await createResponse.json();
      } else {
        backendUser = await verifyResponse.json();
      }

      const sessionData = {
        token: token,
        user: {
          ...userData,
          ...backendUser,
        },
      };
      localStorage.setItem('userSession', JSON.stringify(sessionData));

      return sessionData;
    } catch (backendError) {
      await signOut(auth);
      // console.error("Backend error:", backendError);
      throw new Error((backendError as Error).message || 'Error connecting to server');
    }
  } catch (error) {
    let errorMessage = 'An error occurred during Google login';

    if (error && typeof error === 'object' && 'code' in error) {
      const code = (error as { code: string }).code;
      switch (code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Login cancelled: You closed the login window';
          break;
        case 'auth/popup-blocked':
          errorMessage = 'Login failed: Pop-up was blocked by your browser';
          break;
        case 'auth/cancelled-popup-request':
          errorMessage = 'Login cancelled: Multiple pop-up requests';
          break;
        case 'auth/account-exists-with-different-credential':
          errorMessage =
            'An account already exists with the same email but different sign-in credentials';
          break;
        default:
          errorMessage = `Login error: ${error instanceof Error ? error.message : String(error)}`;
      }
    }
    // console.error("Google login error:", error);
    throw new Error(errorMessage);
  }
}
