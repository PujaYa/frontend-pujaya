import React from "react";
import Image from "next/image";

interface RelatedAuction {
  id: string;
  name: string;
  imgs?: string[];
}

interface RelatedAuctionsProps {
  categoryName?: string;
  currentAuctionId?: string;
}

const RelatedAuctions: React.FC<RelatedAuctionsProps> = ({
  categoryName,
  currentAuctionId,
}) => {
  const [auctions, setAuctions] = React.useState<RelatedAuction[]>([]);
  const [warning, setWarning] = React.useState<string | null>(null);
  const [indexes, setIndexes] = React.useState<{ [id: string]: number }>({});

  React.useEffect(() => {
    console.log(
      "[RelatedAuctions] categoryName:",
      categoryName,
      "currentAuctionId:",
      currentAuctionId
    );
    if (!categoryName) {
      setWarning(
        "Cannot show related auctions because this product does not have a valid category."
      );
      setAuctions([]);
      return;
    }
    setWarning(null);
    const fetchRelated = async () => {
      try {
        const res = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL
          }/auctions?category=${encodeURIComponent(categoryName)}&limit=6`
        );
        if (!res.ok) {
          setWarning("Error fetching related auctions.");
          setAuctions([]);
          return;
        }
        const data = await res.json();
        console.log("[RelatedAuctions] fetched auctions:", data.auctions);
        const filtered = (data.auctions || []).filter(
          (a: { id: string }) => a.id !== currentAuctionId
        );
        console.log("[RelatedAuctions] filtered auctions:", filtered);
        setAuctions(
          filtered.map(
            (a: {
              id: string;
              name: string;
              product?: { name?: string; imgProduct?: string[] };
            }) => ({
              id: a.id,
              name: a.product?.name || a.name,
              imgs: a.product?.imgProduct || [],
            })
          )
        );
        if (filtered.length === 0) {
          setWarning("No related auctions found.");
        } else {
          setWarning(null);
        }
      } catch {
        setWarning("Error fetching related auctions.");
        setAuctions([]);
      }
    };
    fetchRelated();
  }, [categoryName, currentAuctionId]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIndexes((prev) => {
        const next: { [id: string]: number } = { ...prev };
        auctions.forEach((a) => {
          const imgs = a.imgs || [];
          if (imgs.length > 1) {
            next[a.id] =
              typeof next[a.id] === "number"
                ? (next[a.id] + 1) % imgs.length
                : 1;
          }
        });
        return next;
      });
    }, 2200);
    return () => clearInterval(interval);
  }, [auctions]);

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h3 className="text-lg font-semibold mb-3 text-gray-900">
        Related auctions
      </h3>
      {warning ? (
        <div className="bg-yellow-100 text-yellow-800 rounded-lg p-4 text-center text-sm">
          {warning}
        </div>
      ) : auctions && auctions.length > 0 ? (
        <div className="flex gap-2">
          {auctions.map((a) => {
            const imgs = a.imgs || [];
            const currentIdx = indexes[a.id] || 0;
            const showImg =
              imgs.length > 0 ? imgs[currentIdx % imgs.length] : undefined;
            return (
              <div
                key={a.id}
                className="w-20 h-24 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-700 hover:shadow cursor-pointer transition relative overflow-hidden">
                {showImg ? (
                  <Image
                    src={showImg}
                    alt={a.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 object-cover rounded transition-all duration-500"
                  />
                ) : (
                  <span className="text-gray-400">No Img</span>
                )}
                <span className="text-xs text-center mt-1 line-clamp-2">
                  {a.name}
                </span>
                {imgs.length > 1 && (
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1">
                    {imgs.map((_, idx) => (
                      <span
                        key={idx}
                        className={`w-1.5 h-1.5 rounded-full ${
                          currentIdx === idx ? "bg-blue-500" : "bg-gray-300"
                        } transition-all`}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-gray-500">No related auctions found.</div>
      )}
    </div>
  );
};

export default RelatedAuctions;
