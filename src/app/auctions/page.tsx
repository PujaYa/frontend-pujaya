"use client";

import AuctionList from "@/components/AuctionList";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Modularización: Filtros y búsqueda
function AuctionFilters({
  search,
  setSearch,
  category,
  setCategory,
  sort,
  setSort,
  categories,
}: {
  search: string;
  setSearch: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  sort: string;
  setSort: (v: string) => void;
  categories: string[];
}) {
  return (
    <div className="bg-white rounded-xl shadow p-4 mb-8 flex flex-col md:flex-row gap-4 items-center">
      <input
        type="text"
        placeholder="Search auctions..."
        className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/3"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select
        className="border border-gray-300 rounded-lg px-4 py-2"
        value={category}
        onChange={(e) => setCategory(e.target.value)}>
        <option value="">All</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <select
        className="border border-gray-300 rounded-lg px-4 py-2"
        value={sort}
        onChange={(e) => setSort(e.target.value)}>
        <option value="ending">Ending Soon</option>
        <option value="newest">Newest</option>
        <option value="lowest">Lowest Price</option>
        <option value="highest">Highest Price</option>
      </select>
    </div>
  );
}

export default function AuctionsPage() {
  const { userData } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPremium, setIsPremium] = useState(false);
  // Estado para filtros: leer los query params SOLO al primer render
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "";
  const initialSort = searchParams.get("sort") || "ending";
  const initialSeller = searchParams.get("seller") || "";
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState(initialSort);
  const [sellerId, setSellerId] = useState(initialSeller);
  // Puedes cargar las categorías dinámicamente si lo deseas
  const categories = [
    "Art & Antiques",
    "Jewelry & Watches",
    "Vintage Technology",
    "Industrial Equipment",
    "Gaming & Entertainment",
    "Real Estate",
    "Books & Manuscripts",
    "Garden & Outdoor",
    "Home & Furniture",
    "Vehicles & Automotive",
    "Wine & Spirits",
    "Sports Equipment",
    "Musical Instruments",
    "Coins & Stamps",
    "Collectibles",
  ];

  // Verificar el rol del usuario cuando userData cambie
  useEffect(() => {
    if (userData?.user?.role === "premium") {
      setIsPremium(true);
    } else {
      setIsPremium(false);
    }
    // Debug log
    // console.log("User role:", userData?.user?.role);
  }, [userData]);

  // Sincronizar los filtros con la URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (sort && sort !== "ending") params.set("sort", sort);
    if (sellerId) params.set("seller", sellerId);
    const paramString = params.toString();
    router.replace(`/auctions${paramString ? `?${paramString}` : ""}`);
    // eslint-disable-next-line
  }, [search, category, sort, sellerId]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Active Auctions
          </h1>
          <p className="text-gray-500">
            Discover all active auctions in different categories
          </p>
        </div>

        {/* Premium user button */}
        {isPremium ? (
          <Link
            href="/auctions/create"
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
            <span>+</span>
            <span>Create Auction</span>
          </Link>
        ) : userData ? (
          <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-lg">
            Upgrade to Premium to create auctions
          </div>
        ) : null}
      </div>

      {/* Filtros y búsqueda modularizados */}
      <AuctionFilters
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        sort={sort}
        setSort={setSort}
        categories={categories}
      />

      {/* Botón para limpiar el filtro de vendedor si está activo */}
      {sellerId && (
        <div className="mb-4 flex justify-end">
          <button
            className="flex items-center gap-1 bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1 rounded-md text-sm font-medium shadow-sm transition-all"
            style={{ minHeight: 0, height: "32px" }}
            onClick={() => setSellerId("")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 14L14 6M6 6l8 8"
              />
            </svg>
            See all
          </button>
        </div>
      )}

      {/* Auction list con filtros */}
      <AuctionList
        search={search}
        category={category}
        sort={sort}
        sellerId={sellerId}
      />
    </main>
  );
}
