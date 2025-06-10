import React from "react";

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
}) => {
  if (showLoginPrompt) {
    return (
      <div className="mb-4 flex flex-col gap-2 bg-blue-50 border border-blue-200 rounded p-4 text-center">
        <span className="font-semibold text-blue-700">
          Log in to place a bid.
        </span>
        <button
          className="mt-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded font-bold transition"
          onClick={() => (window.location.href = "/login")}>
          Log in
        </button>
      </div>
    );
  }
  if (showUpgradePrompt) {
    return (
      <div className="mb-4 flex flex-col gap-2 bg-yellow-50 border border-yellow-200 rounded p-4 text-center">
        <span className="font-semibold text-yellow-700">
          Only premium users can place bids.
        </span>
        <button
          className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded font-bold transition"
          onClick={() => (window.location.href = "/upgrade")}>
          Upgrade to Premium
        </button>
      </div>
    );
  }
  if (!canBid) return null;
  return (
    <form onSubmit={onSubmit} className="mb-4 flex flex-col gap-2">
      <label htmlFor="bidAmount" className="font-semibold text-gray-700">
        Place your bid
      </label>
      <div className="flex gap-2 items-center">
        <input
          id="bidAmount"
          type="number"
          min="0"
          step="0.01"
          className="border rounded px-3 py-2 w-32"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded font-bold transition"
          disabled={bidLoading}>
          {bidLoading ? "Bidding..." : "Bid"}
        </button>
      </div>
      {bidError && <div className="text-red-600 text-sm">{bidError}</div>}
      {bidSuccess && <div className="text-green-600 text-sm">{bidSuccess}</div>}
    </form>
  );
};

export default BidForm;
