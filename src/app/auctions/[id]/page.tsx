"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AuctionDetail from "@/components/UI/AuctionDetail";
import { IAuctionDetailType } from "@/app/types/index";

const API_URL = process.env.NEXT_PUBLIC_API_URL;


export default function AuctionDetailPage() {
  const { id } = useParams();
  const [auction, setAuction] = useState<IAuctionDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetch(`${API_URL}/auctions/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("No se encontró la subasta");
        return res.json();
      })
      .then((data) => {
        setAuction(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center py-10">Cargando...</div>;
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!auction) return null;

  // Pasar los datos del producto y la subasta a AuctionDetail
  return (
    <AuctionDetail
      {...{
        ...auction.product,
        initialPrice: Number(auction.product.initialPrice),
        finalPrice: Number(auction.product.finalPrice),
        category: auction.product.category, // <-- Añadido
      }}
      auctionData={{
        name: auction.name,
        description: auction.description,
        endDate: auction.endDate,
        isActive: auction.isActive,
        auctionId: auction.id,
        userId: auction.owner?.id,
      }}
      auctionId={auction.id}
      userId={auction.owner?.id}
      owner={auction.owner}
    />
  );
}
