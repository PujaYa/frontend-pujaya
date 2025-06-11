'use client';

import { useAuth } from '@/app/context/AuthContext';
import { IUser } from '@/app/types/index';
import { useState, useRef } from 'react';
import UpdateUser from '../Forms/users/UpdateUser';
import UserStats from './profile/UserStats';
import ProfileTabs from './profile/ProfileTabs';
import AuctionProfileCard from './profile/AuctionProfileCard';
import { FaPen } from 'react-icons/fa';

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

  // Simulación de datos de usuario y stats (reemplazar por datos reales)
  const stats = [
    { label: 'Bids Won', value: 156 },
    { label: 'Items Sold', value: 89 },
    { label: 'Total Sales', value: '$45K', color: 'text-orange-500' },
    { label: 'Active Years', value: 3 },
  ];
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
      <div className="w-full max-w-6xl bg-white p-2 sm:p-4 md:p-6 rounded-xl shadow-xl flex flex-col items-center">
        {/* Horizontal profile card */}
        <div className="w-full flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 p-4 md:p-6">
          {/* Profile image and edit */}
          <div className="relative flex flex-col items-center">
            <img
              src={userData?.user.imgProfile || '/default-avatar.png'}
              alt="Profile"
              className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-blue-500 object-cover shadow-lg bg-gray-100"
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
                  View photo
                </button>
                <button
                  className="px-4 py-2 text-left hover:bg-gray-100 text-sm"
                  onClick={() => {
                    setShowPhotoMenu(false);
                    photoInputRef.current?.click();
                  }}
                >
                  Edit photo
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
            <span className="text-gray-500 text-sm">{user.email || ''}</span>
            {/* Subtitle/description placeholder */}
            <span className="text-xs text-gray-400 mt-1">Art & Antiques Collector</span>
            <div className="flex flex-wrap gap-2 mt-2 items-center">
              <span className="bg-gray-100 text-yellow-600 px-2 py-0.5 rounded text-xs font-semibold">
                ⭐ 4.9 (127 reviews)
              </span>
              <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-semibold">
                Verified
              </span>
              <span className="bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded text-xs font-semibold">
                Top Seller
              </span>
            </div>
          </div>
          {/* Action buttons */}
          <div className="flex flex-row md:flex-col gap-2 md:gap-3 items-center md:items-end mt-4 md:mt-0">
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition text-sm flex items-center gap-2">
              <span className="hidden md:inline">Configuration</span>
              <span className="md:hidden">Settings</span>
            </button>
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
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center bg-gray-50 rounded-xl px-8 py-4 shadow text-center min-w-[120px]"
            >
              <span className={`text-2xl font-bold ${stat.color || 'text-blue-700'}`}>
                {stat.value}
              </span>
              <span className="text-sm text-gray-500 font-semibold mt-1">{stat.label}</span>
            </div>
          ))}
        </div>
        {/* Tabs */}
        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={TABS} />
        {/* Auction cards */}
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
