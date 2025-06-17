import React from 'react';

interface BidFormProps {
  canBid: boolean;
  bidAmount: string;
  setBidAmount: (v: string) => void;
  bidLoading: boolean;
  bidError: string | null;
  bidSuccess: string | null;
  onSubmit: (e: React.FormEvent) => void;
  showLoginPrompt: boolean;
  showUpgradePrompt: boolean;
  minBid: number;
}

const BidForm: React.FC<BidFormProps> = ({
  canBid,
  bidAmount,
  setBidAmount,
  bidLoading,
  bidError,
  bidSuccess,
  onSubmit,
  showLoginPrompt,
  showUpgradePrompt,
  minBid,
}) => {
  const isBidValid = bidAmount === '' || Number(bidAmount) >= minBid;

  if (showLoginPrompt) {
    return (
      <div className="mb-4 flex flex-col gap-2 bg-blue-50 border border-blue-200 rounded p-4 text-center">
        <span className="font-semibold text-blue-700">Log in to place a bid.</span>
        <button
          className="mt-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded font-bold transition"
          onClick={() => (window.location.href = '/login')}
        >
          Log in
        </button>
      </div>
    );
  }
  if (showUpgradePrompt) {
    return (
      <div className="mb-4 flex flex-col gap-2 bg-yellow-50 border border-yellow-200 rounded p-4 text-center">
        <span className="font-semibold text-yellow-700">Only premium users can place bids.</span>
        <button
          className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded font-bold transition"
          onClick={() => (window.location.href = '/payment')}
        >
          Upgrade to Premium
        </button>
      </div>
    );
  }
  if (!canBid) return null;
  // Helper for quick bid buttons
  const handleQuickBid = (inc: number) => {
    const current = Number(bidAmount) || 0;
    setBidAmount((current + inc).toString());
  };
  return (
    <form onSubmit={onSubmit} className="mb-4 flex flex-col items-center gap-2 w-full">
      <label htmlFor="bidAmount" className="font-semibold text-gray-700 w-full text-center mb-1">
        Place your bid
      </label>
      <div className="flex gap-2 items-center w-full justify-center mb-2">
        <span className="text-lg font-semibold">$</span>
        <input
          id="bidAmount"
          type="number"
          min={minBid}
          step="0.01"
          className={`border rounded px-3 py-2 w-full text-lg font-semibold text-center ${!isBidValid && bidAmount !== '' ? 'border-red-500' : ''}`}
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          required
          placeholder={`Minimum: $${minBid}`}
        />
      </div>
      {!isBidValid && bidAmount !== '' && (
        <div className="text-red-600 text-sm w-full text-center mb-2">
          The minimum bid is ${minBid}.
        </div>
      )}
      <div className="flex gap-2 w-full justify-center mb-2">
        {[10, 50, 100].map((inc) => (
          <button
            key={inc}
            type="button"
            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold hover:bg-blue-200"
            onClick={() => handleQuickBid(inc)}
          >
            +${inc}
          </button>
        ))}
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-3 font-bold text-base mb-2 transition disabled:opacity-60"
        disabled={bidLoading || !isBidValid}
      >
        {bidLoading ? 'Bidding...' : 'Place Bid'}
      </button>
      {bidError && <div className="text-red-600 text-sm w-full text-center">{bidError}</div>}
      {bidSuccess && <div className="text-green-600 text-sm w-full text-center">{bidSuccess}</div>}
    </form>
  );
};

export default BidForm;
