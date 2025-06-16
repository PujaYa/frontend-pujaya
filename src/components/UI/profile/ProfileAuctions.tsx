import React from 'react';
import AuctionProfileCard from './AuctionProfileCard';
import { AuctionProfile } from '@/app/types/auction';

interface ProfileAuctionsProps {
  auctions: AuctionProfile[];
}

const ProfileAuctions: React.FC<ProfileAuctionsProps> = ({ auctions }) => (
  <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 mt-1 min-w-0">
    {auctions.map((a, i) => (
      <AuctionProfileCard key={i} {...a} />
    ))}
  </div>
);

export default ProfileAuctions;
