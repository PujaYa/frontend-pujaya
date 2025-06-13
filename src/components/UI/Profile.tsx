'use client';

import { useAuth } from '@/app/context/AuthContext';
import { IUser } from '@/app/types/index';
import { useState, useRef } from 'react';
import UpdateUser from '../Forms/users/UpdateUser';
import ProfileTabs from './profile/ProfileTabs';
import AuctionProfileCard from './profile/AuctionProfileCard';
import { FaPen } from 'react-icons/fa';
import Image from 'next/image';

const TABS = ['Active Bids', 'Won', 'Selling', 'Favorites', 'History'];

const ProfileComponent = () => {
  const { user, userData, setUserData } = useAuth();
  async function handleImageChange(file: File | undefined) {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    const token = userData?.token;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/profile/image/${userData?.user.id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

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
            imgProfile: data.imageUrl,
          },
        });
        window.location.reload();
      } else {
        throw new Error(data.message || 'Failed to update image');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error: cannot update image');
    }
  }
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const UserInfo = userData?.user as IUser;

  // Simulación de cards de subasta (reemplazar por datos reales)
  const auctions = [
    {
      title: 'Modern Abstract Painting',
      category: 'Art',
      image: '',
      myBid: 1200,
      currentBid: 1250,
      timeLeft: '2h 15m',
    },
    {
      title: 'Modern Abstract Painting',
      category: 'Art',
      image: '',
      myBid: 1200,
      currentBid: 1250,
      timeLeft: '2h 15m',
    },
    {
      title: 'Modern Abstract Painting',
      category: 'Art',
      image: '',
      myBid: 1200,
      currentBid: 1250,
      timeLeft: '2h 15m',
    },
  ];

  // Verificar si userData está cargado antes de renderizar
  if (!user) {
    return (
      <main className="flex flex-col items-center px-4 py-8 min-h-screen bg-blue-50">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl">
          <h1 className="text-3xl font-bold mb-4 text-blue-900 text-center">My Profile</h1>
          <p className="text-center text-gray-500">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center px-2 py-4 min-h-screen bg-blue-50">
      {/* Card de perfil separada */}
      <div className="w-full max-w-6xl">
        <div className="bg-white p-2 sm:p-4 md:p-6 rounded-xl shadow-xl flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
          {/* Profile image and edit */}
          <div className="relative flex flex-col items-center">
            <Image
              src={userData?.user.imgProfile || '/default-profile.png'}
              alt={userData?.user.name || 'User'}
              width={80}
              height={80}
              className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
            />
            <button
              className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow-md border border-gray-200 hover:bg-blue-100 z-10"
              onClick={() => {
                setShowPhotoMenu((v) => !v);
              }}
              aria-label="Edit photo"
              type="button"
            >
              <FaPen className="text-blue-700 w-4 h-4" />
            </button>
            {showPhotoMenu && (
              <div className="absolute z-20 top-12 right-0 bg-white border rounded shadow-lg flex flex-col min-w-[140px] animate-fade-in">
                <button
                  className="px-4 py-2 text-left hover:bg-gray-100 text-sm"
                  onClick={() => {
                    setShowPhotoMenu(false);
                    window.open(userData?.user.imgProfile || '/default-avatar.png', '_blank');
                  }}
                >
                  Ver foto
                </button>
                <button
                  className="px-4 py-2 text-left hover:bg-gray-100 text-sm"
                  onClick={() => {
                    setShowPhotoMenu(false);
                    photoInputRef.current?.click();
                  }}
                >
                  Editar foto
                </button>
              </div>
            )}
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e.target.files?.[0])}
              className="hidden"
            />
          </div>
          {/* User info and badges */}
          <div className="flex-1 flex flex-col gap-2 items-center md:items-start">
            <span className="text-2xl md:text-3xl font-bold text-gray-800">
              {userData?.user.name || ''}
            </span>
            {/* English description */}
            <span className="text-xs text-gray-400 mt-1">Art & Antiques Collector</span>
            <div className="flex flex-wrap gap-2 mt-2 items-center">
              {/* Badge: Active/Inactive */}
              {(userData?.user as { isActive?: boolean })?.isActive === false ? (
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-700">
                  Inactive
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-700">
                  Active
                </span>
              )}
              {/* Badge: Role */}
              <span className="bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded text-xs font-semibold">
                {userData?.user.role
                  ? userData.user.role.charAt(0).toUpperCase() + userData.user.role.slice(1)
                  : 'User'}
              </span>
            </div>
          </div>
          {/* Action buttons */}
          <div className="flex flex-row md:flex-col gap-2 md:gap-3 items-center md:items-end mt-4 md:mt-0">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-800 transition text-sm"
            >
              Edit Profile
            </button>
          </div>
        </div>
        {/* Stats row */}
        <div className="flex flex-row justify-center gap-8 my-4 w-full">
          <div className="flex flex-col items-center bg-gray-50 rounded-xl px-8 py-4 shadow text-center min-w-[120px]">
            <span className="text-2xl font-bold text-blue-700">156</span>
            <span className="text-sm text-gray-500 font-semibold mt-1">Pujas Ganadas</span>
          </div>
          <div className="flex flex-col items-center bg-gray-50 rounded-xl px-8 py-4 shadow text-center min-w-[120px]">
            <span className="text-2xl font-bold text-green-600">89</span>
            <span className="text-sm text-gray-500 font-semibold mt-1">Artículos Vendidos</span>
          </div>
          <div className="flex flex-col items-center bg-gray-50 rounded-xl px-8 py-4 shadow text-center min-w-[120px]">
            <span className="text-2xl font-bold text-orange-500">$45K</span>
            <span className="text-sm text-gray-500 font-semibold mt-1">Total Vendido</span>
          </div>
          <div className="flex flex-col items-center bg-gray-50 rounded-xl px-8 py-4 shadow text-center min-w-[120px]">
            <span className="text-2xl font-bold text-purple-600">3</span>
            <span className="text-sm text-gray-500 font-semibold mt-1">Años Activo</span>
          </div>
        </div>
      </div>
      {/* Tabs y cards fuera de la card de perfil */}
      <div className="w-full max-w-6xl mt-4">
        <ProfileTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={['Pujas Activas', 'Ganadas', 'Vendiendo', 'Favoritos', 'Historial']}
        />
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 mt-1">
          {auctions.map((a, i) => (
            <AuctionProfileCard key={i} {...a} />
          ))}
        </div>
      </div>
      {/* Edit modal */}
      {isModalOpen && (
        <UpdateUser
          user={UserInfo}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onUpdateSuccess={() => setIsModalOpen(false)}
        />
      )}
    </main>
  );
};

export default ProfileComponent;
