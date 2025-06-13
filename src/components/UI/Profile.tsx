'use client'

import { useAuth } from "@/app/context/AuthContext";
import { useState } from "react";
import UpdateUser from "../Forms/users/UpdateUser";

const ProfileComponent = () => {
    /*   const [user, setUser] = useState({
     name: "John Doe",
     email: "john.doe@email.com",
     phone: "+1 234 567 890",
     country: "USA",
     address: "123 Main St, New York",
   });
  */

    /* inicio cambio Juan*/


    const { user, userData, setUserData } = useAuth();
    async function handleImageChange(file: File | undefined) {
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);

        const token = userData?.token;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile/image/${userData?.user.id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await res.json();
            console.log('Response data:', data);

            if (res.ok) {
                setUserData({
                    ...userData,
                    token: userData!.token,
                    user: {
                        ...userData!.user,
                        id: userData!.user.id,
                        name: userData!.user.name,
                        email: userData!.user.email,
                        phone: userData!.user.phone,
                        address: userData!.user.address,
                        role: userData!.user.role,
                        country: userData!.user.country,
                        imgProfile: data.imageUrl
                    }
                });
                window.location.reload();
            } else {
                throw new Error(data.message || 'Failed to update image');
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error: cannot update image");
        }
    }
    /* fin cambio Juan*/
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user: userInfo } = userData;

    // Verificar si userData está cargado antes de renderizar
    if (!user) {
        return (
            <main className="flex flex-col items-center px-4 py-8 min-h-screen bg-blue-50">
                <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl">
                    <h1 className="text-3xl font-bold mb-4 text-blue-900 text-center">
                        My Profile
                    </h1>
                    <p className="text-center text-gray-500">Loading...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="flex flex-col items-center px-4 py-8 min-h-screen bg-blue-50">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl">
                <div className="flex flex-col items-center mb-6">


                    {/* inicio cambio Juan*/}
                    {/* esto es para que se muestre la imagen de perfil dentro del file cuando se selecciona una imagen */}
                    <div className="flex flex-col items-center mb-4">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-500">
                            <img
                                src={userData?.user.imgProfile || "/default-avatar.png"}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <label className="mt-2 text-sm text-blue-700 cursor-pointer hover:underline">
                            Change Photo
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageChange(e.target.files?.[0])}
                                className="hidden"
                            />
                        </label>
                    </div>
                    {/* fin cambio Juan*/}


                    <span className="text-xl font-semibold text-gray-800">
                        {userData?.user.name}
                    </span>
                    <span className="text-gray-500">{user.email || 'Not available'}</span>
                </div>
                <div className="space-y-4">
                    <div>
                        <span className="block text-gray-600 font-medium">Phone</span>
                        <span className="block text-gray-800">{userData?.user.phone || 'Not available'}</span>
                    </div>
                    <div>
                        <span className="block text-gray-600 font-medium">Country</span>
                        <span className="block text-gray-800">{userData?.user.country || 'Not available'}</span>
                    </div>
                    <div>
                        <span className="block text-gray-600 font-medium">Address</span>
                        <span className="block text-gray-800">{userData?.user.address || 'Not available'}</span>
                    </div>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full mt-8 bg-blue-700 text-white py-2 rounded-xl font-semibold hover:bg-blue-800 transition"
                >
                    Edit Profile
                </button>
            </div>

            {isModalOpen && (
                <UpdateUser
                    user={userInfo}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onUpdateSuccess={() => {
                        setIsModalOpen(false);
                    }}
                />
            )}
        </main>
    );
}
export default ProfileComponent;