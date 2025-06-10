import React from "react";

interface BidHistoryProps {
  bids: any[];
  bidsLoading: boolean;
  bidsError: string | null;
}

const BidHistory: React.FC<BidHistoryProps> = ({
  bids,
  bidsLoading,
  bidsError,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow p-6 mb-2">
      <h3 className="text-lg font-semibold mb-3 text-gray-900">Bid history</h3>
      {bidsLoading ? (
        <div className="text-blue-600">Loading bids...</div>
      ) : bidsError ? (
        <div className="text-red-600">{bidsError}</div>
      ) : bids.length === 0 ? (
        <div className="text-gray-500">No bids yet.</div>
      ) : (
        <ul className="space-y-1">
          {bids.map((bid) => (
            <li
              key={bid.id}
              className="flex justify-between text-green-600 font-semibold">
              <span>
                {bid.user && bid.user.name ? bid.user.name : "Anonymous"}
              </span>
              <span>${bid.amount}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BidHistory;
