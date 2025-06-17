import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface AuctionProfileCardProps {
  title: string;
  category: string;
  image?: string;
  myBid?: number;
  currentBid: number;
  timeLeft?: string;
  onBid?: () => void;
  auctionId?: string;
}

const AuctionProfileCard: React.FC<AuctionProfileCardProps> = ({
  title,
  category,
  image,
  myBid,
  currentBid,
  timeLeft,
  onBid,
  auctionId,
}) => {
  // Envolver la card en un Link si auctionId está presente
  const cardContent = (
    <div className="bg-white rounded-xl shadow flex flex-col p-4 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xs cursor-pointer hover:shadow-lg transition-shadow min-w-0">
      <div className="relative flex items-center justify-center h-32 bg-gray-100 rounded-lg mb-3 w-full overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={title}
            width={500}
            height={500}
            className="object-contain h-full w-full rounded-lg"
          />
        ) : (
          <span className="text-gray-400">No Img</span>
        )}
        {timeLeft && (
          <span className="absolute top-2 right-2 bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-semibold">
            {timeLeft}
          </span>
        )}
      </div>
      <span className="text-xs text-gray-500 mb-1 break-words w-full">{category}</span>
      <span className="font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[40px] break-words w-full">
        {title}
      </span>
      <div className="flex flex-col gap-1 text-sm mb-2">
        {myBid !== undefined && (
          <span>
            Your Bid: <span className="text-blue-700 font-bold">${myBid}</span>
          </span>
        )}
        <span>
          Actual Bid: <span className="text-green-700 font-bold">${currentBid}</span>
        </span>
      </div>
      {onBid && (
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white py-1 rounded font-semibold transition mt-auto"
          onClick={onBid}
        >
          Increment bid
        </button>
      )}
    </div>
  );
  return auctionId ? <Link href={`/auctions/${auctionId}`}>{cardContent}</Link> : cardContent;
};

export default AuctionProfileCard;
