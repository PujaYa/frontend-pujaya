import React from "react";

interface AuctionTabsProps {
  tab: string;
  setTab: (tab: string) => void;
  isPremium: boolean;
}

const tabs = ["Description", "Shipping", "Return policy", "Seller info"];

const AuctionTabs: React.FC<AuctionTabsProps> = ({
  tab,
  setTab,
  isPremium,
}) => {
  return (
    <nav className="flex gap-2 border-b mb-4 bg-white">
      {tabs.map((t) =>
        t === "Seller info" && !isPremium ? null : (
          <span
            key={t}
            className={`relative cursor-pointer px-5 py-3 text-base font-semibold transition-colors duration-200
              ${
                tab === t
                  ? "text-blue-700 after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-blue-700 after:rounded-full after:transition-all after:duration-300"
                  : "text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-t-md"
              }
            `}
            style={{
              display: "inline-block",
              minWidth: 120,
              textAlign: "center",
              position: "relative",
              zIndex: 1,
            }}
            onClick={() => setTab(t)}
            role="tab"
            aria-selected={tab === t}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setTab(t);
            }}>
            {t}
          </span>
        )
      )}
    </nav>
  );
};

export default AuctionTabs;
