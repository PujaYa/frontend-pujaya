import React from "react";

// Cambiar el tipo de prop para que Auction reciba una subasta (auction) y no un producto directamente
interface AuctionProps {
  product: {
    name: string;
    imgProduct: string[];
    description: string;
    initialPrice: number;
  };
}

const Auction: React.FC<AuctionProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col transition hover:scale-105 duration-200">
      {/* Imagen del producto */}
      <div className="bg-gray-100 h-48 flex items-center justify-center">
        <Image
          src={
            product.imgProduct && product.imgProduct.length > 0
              ? product.imgProduct[0]
              : "/no-image.png"
          }
          alt={auction.product.name}
          width={400}
          height={300}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      </div>
      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-lg text-gray-900 mb-2">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-2">{product.description}</p>
        <span className="text-blue-700 text-xl font-bold mb-2">
          ${product.initialPrice} USD
        </span>
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold mt-auto transition">
          Bid Now
        </button>
      </div>
    </div>
  );
};

export default Auction;
