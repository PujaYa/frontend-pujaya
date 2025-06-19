'use client';

import { useAuth } from '@/app/context/AuthContext';
import { AuctionProfile } from '@/app/types/auction';
import { useState, useRef, useEffect } from 'react';
import UpdateUser from '../Forms/users/UpdateUser';
import ProfileTabs from './profile/ProfileTabs';
import ProfileStats from './profile/ProfileStats';
import ProfileAuctions from './profile/ProfileAuctions';
import ProfileHeader from './profile/ProfileHeader';
import { IUser } from '@/app/types/index';
import { LoadingSpinner } from '../LoadingSpinner';

const TABS = ['Active Bids', 'My Auctions'];

// Tipo para subasta recibida del backend
interface BackendAuction {
  id: string;
  name?: string;
  title?: string;
  category?: { categoryName?: string } | string;
  image?: string;
  product?: { imgProduct?: string[]; initialPrice?: number };
  currentHighestBid?: number;
  bids?: { amount: number }[];
  endDate?: string;
}

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
  const photoInputRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>;

  // Calcular tiempo activo
  function getActiveTime() {
    if (!userData?.user?.createdAt) return '';
    const created = new Date(userData.user.createdAt);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const diffYears = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365));
    if (diffYears > 0) return `${diffYears} year${diffYears > 1 ? 's' : ''}`;
    const diffMonths = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30));
    if (diffMonths > 0) return `${diffMonths} month${diffMonths > 1 ? 's' : ''}`;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
    return 'New';
  }

  // Estado para auctions reales
  const [auctions, setAuctions] = useState<AuctionProfile[]>([]);
  const [loadingAuctions, setLoadingAuctions] = useState(false);

  // Estado para mis subastas
  const [myAuctions, setMyAuctions] = useState<AuctionProfile[]>([]);
  const [loadingMyAuctions, setLoadingMyAuctions] = useState(false);

  // Obtener auctions reales según el tab activo
  useEffect(() => {
    async function fetchAuctions() {
      if (!userData?.user?.id) return;
      if (activeTab === 'Active Bids') {
        setLoadingAuctions(true);
        try {
          const token = userData.token;
          const url = `${process.env.NEXT_PUBLIC_API_URL}/bids?userId=${userData.user.id}&onlyActive=true`;
          const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            // Mapear para agregar endDate para el timer en vivo
            const mapped = Array.isArray(data)
              ? data.map((a) => ({
                  ...a,
                  endDate: a.endDate,
                }))
              : [];
            setAuctions(mapped);
          } else {
            setAuctions([]);
          }
        } catch {
          setAuctions([]);
        } finally {
          setLoadingAuctions(false);
        }
      } else if (activeTab === 'My Auctions') {
        setLoadingMyAuctions(true);
        try {
          const token = userData.token;
          const url = `${process.env.NEXT_PUBLIC_API_URL}/auctions?seller=${userData.user.id}`;
          const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            // Mapear las subastas para asegurar campos mínimos y correctos
            const mappedAuctions = Array.isArray(data.auctions)
              ? data.auctions.map((a: BackendAuction) => {
                  return {
                    id: a.id,
                    title: a.name || a.title || 'Sin título',
                    category:
                      typeof a.category === 'object' && a.category !== null
                        ? a.category.categoryName || ''
                        : a.category || '',
                    image:
                      a.image ||
                      (a.product && a.product.imgProduct && a.product.imgProduct[0]) ||
                      '',
                    currentBid:
                      a.currentHighestBid ||
                      (a.bids && a.bids.length > 0
                        ? Math.max(...a.bids.map((b) => Number(b.amount)))
                        : a.product?.initialPrice || 0),
                    endDate: a.endDate,
                  };
                })
              : [];
            setMyAuctions(mappedAuctions);
          } else {
            setMyAuctions([]);
          }
        } catch {
          setMyAuctions([]);
        } finally {
          setLoadingMyAuctions(false);
        }
      }
    }
    fetchAuctions();
  }, [userData, activeTab]);

  // Verificar si userData está cargado antes de renderizar
  if (!user) {
    return (
      <main className="flex flex-col items-center px-4 py-8 min-h-screen bg-blue-50">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl">
          <h1 className="text-3xl font-bold mb-4 text-blue-900 text-center">My Profile</h1>
          <LoadingSpinner />
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center px-2 sm:px-4 py-4 min-h-screen bg-blue-50">
      {/* Card de perfil separada */}
      <div className="w-full max-w-lg sm:max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto">
        <div className="bg-white p-2 sm:p-4 md:p-6 rounded-xl shadow-xl flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 w-full">
          <ProfileHeader
            userData={userData!}
            showPhotoMenu={showPhotoMenu}
            setShowPhotoMenu={setShowPhotoMenu}
            photoInputRef={photoInputRef}
            handleImageChange={handleImageChange}
            onEditProfile={() => setIsModalOpen(true)}
          />
        </div>
        {/* Stats row */}
        <ProfileStats activeTime={getActiveTime()} />
      </div>
      {/* Tabs y cards fuera de la card de perfil */}
      <div className="w-full max-w-lg sm:max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto mt-4">
        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={TABS} />
        <div className="overflow-x-auto w-full">
          {activeTab === 'Active Bids' &&
            (loadingAuctions ? (
              <LoadingSpinner />
            ) : (
              <ProfileAuctions auctions={Array.isArray(auctions) ? auctions : []} />
            ))}
          {activeTab === 'My Auctions' && (
            <>
              {loadingMyAuctions ? (
                <LoadingSpinner />
              ) : Array.isArray(myAuctions) && myAuctions.length > 0 ? (
                <ProfileAuctions auctions={myAuctions} />
              ) : (
                <div className="text-center text-gray-500 py-8">No tienes subastas creadas.</div>
              )}
            </>
          )}
        </div>
      </div>
      {/* Edit modal */}
      {isModalOpen && (
        <UpdateUser
          user={userData!.user as IUser}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onUpdateSuccess={() => setIsModalOpen(false)}
        />
      )}
    </main>
  );
};

export default ProfileComponent;
