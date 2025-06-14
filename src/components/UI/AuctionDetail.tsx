"use-client";

import { IProduct } from "@/app/types";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import AuctionGallery from "./auction/AuctionGallery";
import AuctionTabs from "./auction/AuctionTabs";
import AuctionInfoBox from "./auction/AuctionInfoBox";
import BidForm from "./auction/BidForm";
import BidHistory from "./auction/BidHistory";
import RelatedAuctions from "./auction/RelatedAuctions";
import SellerInfo from "./auction/SellerInfo";

// Tipos para pujas y usuario
interface Bid {
  id: string;
  amount: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
  };
}

interface AuctionInfo {
  name: string;
  description: string;
  endDate: string;
  isActive: boolean;
  auctionId?: string;
  userId?: string;
  initialPrice?: number;
  finalPrice?: number;
}

// Agrega la prop owner a AuctionDetail
const AuctionDetail: React.FC<
  IProduct & {
    auctionData?: {
      name: string;
      description: string;
      endDate: string;
      isActive: boolean;
      auctionId?: string;
      userId?: string;
    };
    auctionId?: string;
    userId?: string;
    owner?: {
      id: string;
      name: string;
      email: string;
      createdAt?: string;
    };
    category?: { categoryName?: string };
  }
> = ({
  id,
  name,
  imgProduct,
  description,
  initialPrice,
  isActive,
  auctionData,
  auctionId,
  userId,
  owner,
  category,
}) => {
  const { userData } = useAuth();
  const [mainImg, setMainImg] = useState(
    Array.isArray(imgProduct) && imgProduct.length > 0 ? imgProduct[0] : null
  );
  const [tab, setTab] = useState("Description");
  // Estado para el modal de zoom
  const [zoomOpen, setZoomOpen] = useState(false);
  // Bid form state
  const [bidAmount, setBidAmount] = useState("");
  const [bidLoading, setBidLoading] = useState(false);
  const [bidError, setBidError] = useState<string | null>(null);
  const [bidSuccess, setBidSuccess] = useState<string | null>(null);
  const [auctionInfo, setAuctionInfo] = useState<AuctionInfo | null>(
    auctionData || null
  );
  // Estado para historial de pujas
  const [bids, setBids] = useState<Bid[]>([]);
  const [bidsLoading, setBidsLoading] = useState(false);
  const [bidsError, setBidsError] = useState<string | null>(null);

  // Fetch auction info and bids
  const fetchAuctionAndBids = async () => {
    if (!auctionId) return;
    try {
      const [auctionRes, bidsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/auctions/${auctionId}`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/bids?auctionId=${auctionId}`),
      ]);
      if (auctionRes.ok) {
        const auctionData = await auctionRes.json();
        setAuctionInfo(auctionData);
      }
      if (bidsRes.ok) {
        const bidsData = await bidsRes.json();
        setBids(Array.isArray(bidsData) ? bidsData : bidsData.bids || []);
      }
    } catch {
      // Optionally handle error
    }
  };

  // Refresca historial de pujas
  const fetchBids = async () => {
    if (!auctionId) return;
    setBidsLoading(true);
    setBidsError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bids?auctionId=${auctionId}`
      );
      if (!res.ok) throw new Error("Error fetching bids");
      const data = await res.json();
      setBids(Array.isArray(data) ? data : []);
    } catch {
      setBidsError("Could not load bid history");
    } finally {
      setBidsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctionAndBids();
    fetchBids();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auctionId]);

  // Determine if the authenticated user is the owner
  const ownerId = auctionData?.userId || userId;
  const isOwner = Boolean(
    userData &&
      userData.user &&
      ownerId &&
      (String(userData.user.id) === String(ownerId) ||
        String(userData.user.firebaseUid) === String(ownerId))
  );

  // Helper: can the user bid?
  const canBid =
    userData &&
    userData.user?.role === "premium" &&
    !isOwner &&
    (auctionInfo?.isActive ?? auctionData?.isActive);

  // Handle bid submit
  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBidError(null);
    setBidSuccess(null);
    setBidLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bids`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: userData?.token ? `Bearer ${userData.token}` : "",
        },
        body: JSON.stringify({
          auctionId: auctionId,
          amount: parseFloat(bidAmount),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to place bid");
      }
      setBidSuccess("Bid placed successfully!");
      setBidAmount("");
      await fetchAuctionAndBids(); // Refresh auction and bids
      fetchBids(); // Refresh bid history
    } catch (err) {
      setBidError((err as Error).message || "Failed to place bid");
    } finally {
      setBidLoading(false);
    }
  };

  // Determina si mostrar prompts
  const showLoginPrompt = !userData;
  const showUpgradePrompt = !!userData && userData.user?.role !== "premium";
  const isPremium = !!userData && userData.user?.role === "premium";

  return (
    <div className="max-w-7xl mx-auto py-8 px-2 md:px-8">
      {/* Modal de zoom y galería */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column: gallery and tabs */}
        <div className="md:col-span-2">
          <AuctionGallery
            imgProduct={imgProduct}
            mainImg={mainImg}
            setMainImg={setMainImg}
            zoomOpen={zoomOpen}
            setZoomOpen={setZoomOpen}
            name={name}
          />
          <div className="bg-white rounded-2xl shadow p-6">
            <AuctionTabs tab={tab} setTab={setTab} isPremium={isPremium} />
            <div className="mt-4">
              {tab === "Description" && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Product description
                  </h3>
                  <p className="text-gray-700 text-base mb-4">{description}</p>
                </div>
              )}
              {tab === "Shipping" && (
                <div className="text-gray-700 text-base space-y-2">
                  <div>
                    <b>Shipping methods:</b>
                  </div>
                  <ul className="list-disc pl-5">
                    <li>Standard shipping (5-7 business days) - $20 USD</li>
                    <li>Express shipping (2-3 business days) - $40 USD</li>
                  </ul>
                  <div>
                    <b>Free shipping</b> on purchases over $500 USD.
                  </div>
                  <div>
                    Shipping to: Argentina, Chile, Uruguay, Brazil, Mexico,
                    Spain.
                  </div>
                  <div className="text-xs text-gray-500">
                    * Delivery times may vary depending on location.
                  </div>
                </div>
              )}
              {tab === "Return policy" && (
                <div className="text-gray-700 text-base space-y-2">
                  <div>
                    <b>Returns accepted within 7 days</b> after receipt.
                  </div>
                  <div>
                    The product must be unused and in its original packaging.
                  </div>
                  <div>
                    To request a return, contact the seller from your profile.
                  </div>
                  <div className="text-xs text-gray-500">
                    * Return shipping costs are the responsibility of the buyer.
                  </div>
                </div>
              )}
              {tab === "Seller info" && (
                <SellerInfo
                  owner={owner}
                  onViewMoreProducts={(sellerId) => {
                    window.location.href = `/auctions?seller=${sellerId}`;
                  }}
                  show={isPremium}
                />
              )}
            </div>
          </div>
        </div>
        {/* Right column: auction info, bid, history, related */}
        <div className="flex flex-col gap-6">
          <AuctionInfoBox
            auctionInfo={auctionInfo}
            isActive={isActive}
            initialPrice={initialPrice}
            auctionId={
              auctionId ||
              auctionInfo?.auctionId ||
              auctionData?.auctionId ||
              ""
            }
            isOwner={isOwner}
            id={id}
          />
          <BidForm
            canBid={!!canBid}
            bidAmount={bidAmount}
            setBidAmount={setBidAmount}
            bidLoading={bidLoading}
            bidError={bidError}
            bidSuccess={bidSuccess}
            onSubmit={handleBidSubmit}
            showLoginPrompt={!!showLoginPrompt}
            showUpgradePrompt={!!showUpgradePrompt}
          />
          <BidHistory
            bids={bids}
            bidsLoading={bidsLoading}
            bidsError={bidsError}
          />
          <RelatedAuctions
            categoryName={category?.categoryName}
            currentAuctionId={
              auctionId ||
              auctionInfo?.auctionId ||
              auctionData?.auctionId ||
              ""
            }
          />
        </div>
      </div>
    </div>
  );
};

export default AuctionDetail;
