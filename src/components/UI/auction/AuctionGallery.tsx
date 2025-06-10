import React from "react";

interface AuctionGalleryProps {
  mainImg: string | null;
  imgProduct: string[];
  name: string;
  zoomOpen: boolean;
  setZoomOpen: (open: boolean) => void;
  setMainImg: (img: string) => void;
}

const AuctionGallery: React.FC<AuctionGalleryProps> = ({
  mainImg,
  imgProduct,
  name,
  zoomOpen,
  setZoomOpen,
  setMainImg,
}) => (
  <>
    {/* Modal zoom */}
    {zoomOpen && mainImg && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
        onClick={() => setZoomOpen(false)}>
        <div className="relative max-w-3xl w-full flex items-center justify-center">
          <button
            className="absolute top-2 right-2 text-white text-2xl font-bold bg-black bg-opacity-40 rounded-full px-3 py-1 hover:bg-opacity-80 z-10"
            onClick={(e) => {
              e.stopPropagation();
              setZoomOpen(false);
            }}
            aria-label="Close zoom">
            ×
          </button>
          <img
            src={mainImg}
            alt={name}
            className="max-h-[80vh] max-w-full rounded-xl shadow-lg border bg-white"
            style={{ objectFit: "contain" }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    )}
    <div className="flex flex-col md:flex-row gap-6">
      {/* Thumbnails */}
      <div className="flex md:flex-col flex-row gap-2 md:mr-4 md:mb-0 mb-2 items-center justify-center">
        {Array.isArray(imgProduct) && imgProduct.length > 0 ? (
          imgProduct.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={name + " " + (idx + 1)}
              className={`w-14 h-14 object-cover rounded-lg border cursor-pointer transition-all shadow-sm ${
                mainImg === img
                  ? "ring-2 ring-blue-600"
                  : "opacity-80 hover:opacity-100"
              }`}
              onClick={() => setMainImg(img)}
              style={{ background: "#fff" }}
            />
          ))
        ) : (
          <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
            No Img
          </div>
        )}
      </div>
      {/* Main image */}
      <div className="flex-1 flex items-center justify-center min-h-[320px]">
        {mainImg ? (
          <img
            src={mainImg}
            alt={name}
            className="h-80 max-h-[340px] w-auto object-contain rounded-xl shadow border bg-white cursor-zoom-in"
            onClick={() => setZoomOpen(true)}
          />
        ) : (
          <div className="h-80 w-full flex items-center justify-center bg-gray-100 rounded-xl">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>
    </div>
    {/* Mobile thumbnails */}
    <div className="flex md:hidden gap-2 mt-2 justify-center">
      {Array.isArray(imgProduct) &&
        imgProduct.length > 0 &&
        imgProduct.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={name + " " + (idx + 1)}
            className={`w-12 h-12 object-cover rounded-lg border cursor-pointer transition-all shadow-sm ${
              mainImg === img
                ? "ring-2 ring-blue-600"
                : "opacity-80 hover:opacity-100"
            }`}
            onClick={() => setMainImg(img)}
            style={{ background: "#fff" }}
          />
        ))}
    </div>
  </>
);

export default AuctionGallery;
