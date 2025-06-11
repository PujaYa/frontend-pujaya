import React from "react";

interface AuctionProfileCardProps {
  title: string;
  category: string;
  image?: string;
  myBid?: number;
  currentBid: number;
  timeLeft?: string;
  onBid?: () => void;
}

const AuctionProfileCard: React.FC<AuctionProfileCardProps> = ({
  title,
  category,
  image,
  myBid,
  currentBid,
  timeLeft,
  onBid,
}) => {
  return (
    <div className="bg-white rounded-xl shadow flex flex-col p-4 min-w-[220px] max-w-xs w-full">
      <div className="relative flex items-center justify-center h-32 bg-gray-100 rounded-lg mb-3">
        {image ? (
          <img src={image} alt={title} className="object-contain h-full w-full rounded-lg" />
        ) : (
          <span className="text-gray-400">No Img</span>
        )}
        {timeLeft && (
          <span className="absolute top-2 right-2 bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-semibold">
            {timeLeft}
          </span>
        )}
      </div>
      <span className="text-xs text-gray-500 mb-1">{category}</span>
      <span className="font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[40px]">{title}</span>
      <div className="flex flex-col gap-1 text-sm mb-2">
        {myBid !== undefined && (
          <span>Tu puja: <span className="text-blue-700 font-bold">${myBid}</span></span>
        )}
        <span>Puja actual: <span className="text-green-700 font-bold">${currentBid}</span></span>
      </div>
      {onBid && (
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white py-1 rounded font-semibold transition mt-auto"
          onClick={onBid}
        >
          Aumentar Puja
        </button>
      )}
    </div>
  );
};

export default AuctionProfileCard;
