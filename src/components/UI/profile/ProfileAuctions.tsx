import React from 'react';
import AuctionProfileCard from './AuctionProfileCard';
import { AuctionProfile } from '@/app/types/auction';
import Link from 'next/link';

interface ProfileAuctionsProps {
  auctions: AuctionProfile[];
}

const ProfileAuctions: React.FC<ProfileAuctionsProps> = ({ auctions }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-w-0">
    {auctions.map((a, i) => (
      <AuctionProfileCard key={i} {...a} />
    ))}
    {/* Botón para crear subasta al final */}
    <div className="flex items-center justify-center w-full col-span-1 sm:col-span-2 lg:col-span-3 mt-4">
      <Link
        href="/auctions/create"
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow transition text-lg"
        style={{ minWidth: 220, textAlign: 'center' }}
      >
        + Create auction
      </Link>
    </div>
  </div>
);

export default ProfileAuctions;
