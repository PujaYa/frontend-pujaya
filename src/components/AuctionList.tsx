'use client';
import React, { useEffect, useState } from 'react';
import Auction from './Auction';
import Link from 'next/link';

const PAGE_SIZE = 6;
const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface AuctionListProps {
  search?: string;
  category?: string;
  sort?: string;
  sellerId?: string;
}

// Definir un tipo mínimo para Auction (puedes reemplazarlo por el tipo real si lo tienes)
type AuctionType = {
  id: string;
  product: {
    name: string;
    imgProduct: string[];
    description: string;
    initialPrice: number;
  };
};

// Subcomponente para la tarjeta de subasta
function AuctionCard({ auction }: { auction: any }) {
  return (
    <Link
      key={auction.id}
      href={`/auctions/${auction.id}`}
      className="block transition hover:scale-105"
    >
      <Auction auction={auction} />
    </Link>
  );
}

const AuctionList: React.FC<AuctionListProps> = ({
  search = '',
  category = '',
  sort = 'ending',
  sellerId = '',
}) => {
  const [products, setProducts] = useState<AuctionType[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Construir query params
    const params = new URLSearchParams();
    params.append('limit', PAGE_SIZE.toString());
    params.append('page', page.toString());
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    if (sort) params.append('sort', sort);
    if (sellerId) params.append('seller', sellerId);
    fetch(`${API_URL}/auctions?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.auctions || []);
        setTotal(data.total || 0);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [page, search, category, sort, sellerId]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      {loading ? (
        <div className="text-center text-gray-500 py-10">Loading auctions...</div>
      ) : products && products.length === 0 ? (
        <div className="text-center text-gray-500 py-10">No auctions found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {products &&
            products.map((auction) => <AuctionCard key={auction.id} auction={auction} />)}
        </div>
      )}
      {/* Paginación */}
      <div className="flex justify-center items-center gap-2 mt-10">
        <button
          className="px-3 py-1 rounded bg-gray-200 text-gray-500"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            className={`px-3 py-1 rounded ${
              page === idx + 1 ? 'bg-blue-700 text-white font-bold' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setPage(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
        <button
          className="px-3 py-1 rounded bg-gray-200 text-gray-700"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AuctionList;
