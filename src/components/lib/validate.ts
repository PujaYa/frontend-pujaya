import { ILoginErrors, ILoginProps, IRegisterErrors, IRegisterProps } from "../../app/types";


export function validateLoginForm(values: ILoginProps) {
    const errors: ILoginErrors = {};
    if (!values.email) {
        errors.email = 'Required';
    } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
    ) {
        errors.email = 'Invalid email address';
    }
    return errors;
}

export function validateRegisterForm (values: IRegisterProps){
    const errors: IRegisterErrors = {};
    if (!values.name) {
    errors.name = 'Required';
  } else if (!/^[a-zA-ZÀ-ÿ\s]{2,}$/i.test(values.name)) {
    errors.name = 'Invalid name';
  }

  // Email
  if (!values.email) {
    errors.email = 'Required';
  } else if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
  ) {
    errors.email = 'Invalid email address';
  }

  // Password: mínimo 8 caracteres, una mayúscula, una minúscula, un número y un caracter especial
  if (!values.password) {
    errors.password = 'Required';
  } else if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(values.password)
  ) {
    errors.password =
      'Password must be at least 8 characters and include uppercase, lowercase, number and special character';
  }

  // Address: letras, números, comas, puntos y espacios, mínimo 5 caracteres
  if (!values.address) {
    errors.address = 'Required';
  } else if (!/^[a-zA-Z0-9\s,.'-]{5,}$/i.test(values.address)) {
    errors.address = 'Invalid address';
  }

  // Phone number: 10 dígitos
  if (!values.phone) {
    errors.phone = 'Required';
  } else if (!/^\d{10}$/.test(values.phone)) {
    errors.phone = 'Invalid phone number';
  }
    return errors;
}