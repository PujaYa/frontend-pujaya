import React from "react";
import EndAuctionButton from "../EndAuctionButton";

interface AuctionInfoBoxProps {
  auctionInfo: any;
  isActive: boolean;
  initialPrice: number;
  auctionId: string;
  isOwner: boolean;
  id: string;
}

const AuctionInfoBox: React.FC<AuctionInfoBoxProps> = ({
  auctionInfo,
  isActive,
  initialPrice,
  auctionId,
  isOwner,
  id,
}) => {
  const currentPrice =
    auctionInfo?.finalPrice ??
    auctionInfo?.currentPrice ??
    auctionInfo?.initialPrice ??
    initialPrice;
  return (
    <div className="bg-white rounded-2xl shadow p-6 mb-2">
      <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center justify-between">
        {auctionInfo?.name}
        {isOwner && (
          <div className="flex gap-2 ml-2">
            <button
              className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 rounded-lg px-3 py-1 font-semibold text-sm transition shadow-sm border border-yellow-300"
              onClick={() =>
                (window.location.href = `/auctions/${auctionId}/edit`)
              }>
              Edit auction
            </button>
            <button
              className="bg-yellow-200 hover:bg-yellow-300 text-blue-900 rounded-lg px-3 py-1 font-semibold text-sm transition shadow-sm border border-yellow-100"
              onClick={() => (window.location.href = `/products/${id}/edit`)}>
              Edit product
            </button>
          </div>
        )}
      </h2>
      <div className="mb-4">
        <span className="text-gray-500 text-sm">Current price</span>
        <div className="text-3xl font-bold text-blue-700">
          ${currentPrice} USD
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            auctionInfo?.isActive ?? isActive
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-200 text-gray-500"
          }`}>
          {auctionInfo?.isActive ?? isActive ? "Active" : "Finished"}
        </span>
      </div>
      <div className="flex gap-2 items-center mb-4">
        <span className="text-gray-500 text-sm">Initial price:</span>
        <span className="text-gray-700 font-semibold">
          ${auctionInfo?.initialPrice ?? initialPrice} USD
        </span>
      </div>
      {auctionInfo?.endDate && (
        <div className="mb-2 text-sm text-gray-600">
          <b>Ends:</b> {new Date(auctionInfo.endDate).toLocaleString()}
        </div>
      )}
      <EndAuctionButton
        auctionId={auctionId}
        isOwner={isOwner}
        isActive={!!(auctionInfo?.isActive ?? isActive)}
        hasEnded={!Boolean(auctionInfo?.isActive ?? isActive)}
      />
    </div>
  );
};

export default AuctionInfoBox;
