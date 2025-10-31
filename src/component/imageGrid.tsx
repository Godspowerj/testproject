"use client";

import { useEffect, useState } from "react";

type ImageType = {
  id: string;
  urls: { small: string; regular: string };
  alt_description: string;
};
import { getRandomImages, searchImages } from "../utilis/unsplash";

export default function ImageGrid() {
  const [images, setImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
  const [userName, setUserName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // useEffect(() => {
  //   const fetchImages = async () => {
  //     try {
  //       const data = await getRandomImages();
  //       setImages(data);
  //     } catch (err) {
  //       console.error("Failed to fetch images:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchImages();
  // }, []);

  // Handle search and pagination
  useEffect(() => {
    const handleSearch = async () => {
      if (!query) {
        // Reset to random images when search is cleared
        setLoading(true);
        setCurrentPage(1);
        try {
          const data = await getRandomImages();
          setImages(data);
          setTotalPages(1);
        } catch (err) {
          console.error("Failed to fetch images:", err);
        } finally {
          setLoading(false);
        }
        return;
      }

      setLoading(true);

      try {
        // Fetch search results in another way to get total_pages info and results (learnt something new here)
        // const { results, total_pages } = await searchImages(query, currentPage);

        const response = await searchImages(query, currentPage);
        const results = response.results;
        const total_pages = response.total_pages;

        setImages(results);
        setTotalPages(Math.min(total_pages, 5)); // Limit to 5 pages
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    };

    handleSearch();
  }, [query, currentPage]);

  const handleSelect = (image: ImageType) => {
    setSelectedImage(image);
  };

  const closeOverlay = () => {
    setSelectedImage(null);
  };

  const handleDownload = async () => {
    const card = document.getElementById("card-design");
    if (!card) return;

    // Using html2canvas
    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(card, { scale: 2 });
    const image = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = image;
    link.download = `${userName || "thank-you"}.png`;
    link.click();
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen from-slate-50 to-slate-100 ">
      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCurrentPage(1); // Reset to page 1 on new search
            }}
            placeholder="Search for images... (e.g., nature, flowers, sunset)"
            className="w-full px-6 py-4 pr-12 bg-white border-2 border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-700 placeholder-slate-400"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Name Input */}
      <div className="max-w-md mx-auto mb-12">
        <label className="block text-sm font-medium text-slate-700 mb-2 text-left">
          Your Name (for the card)
        </label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter your name..."
          className="w-full px-5 py-3 bg-white border-2 border-slate-200 rounded-xl shadow-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-700 placeholder-slate-400"
        />
      </div>

      {/* Images Grid */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-600 text-lg">Loading images...</p>
          </div>
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-block p-6 bg-white rounded-2xl shadow-sm">
            <svg
              className="w-16 h-16 mx-auto text-slate-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-slate-600 text-lg">
              No images found. Try searching for something!
            </p>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {images.map((img) => (
              <div
                key={img.id}
                className="group relative rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                onClick={() => handleSelect(img)}
              >
                <div className="aspect-4/3 overflow-hidden">
                  <img
                    src={img.urls.small}
                    alt={img.alt_description || "Unsplash Image"}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0  from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white text-sm font-medium line-clamp-2">
                      {img.alt_description || "Click to select"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Simple Pagination - Only show if searching */}
          {query && totalPages > 1 && (
            <div className="flex items-center justify-center gap-6 mt-12">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 rounded-xl font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Previous
              </button>

              <div className="px-6 py-3 bg-white rounded-xl shadow-sm border-2 border-slate-200">
                <span className="text-slate-700 font-semibold">
                  Page {currentPage} of {totalPages}
                </span>
              </div>

              <button
                onClick={goToNextPage}
                disabled={currentPage >= totalPages}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Next
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Card Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className="relative w-full"
            style={{ maxWidth: "min(90vw, 500px)", minWidth: "320px" }}
          >
            {/* Close button */}
            <button
              onClick={closeOverlay}
              className="absolute -top-14 right-0 w-12 h-12 bg-white hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-800 text-2xl font-bold transition-all shadow-lg z-10"
            >
              ✕
            </button>

            <div
              id="card-design"
              className="relative from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl overflow-hidden"
              style={{ aspectRatio: "4/5" }}
            >
              {/* Card Content */}
              <div className="relative h-full flex flex-col p-8 sm:p-10">
                

                {/* Image */}
                <div className="flex-1 flex items-center justify-center mb-6">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl w-full">
                    <img
                      src={selectedImage.urls.regular}
                      alt="Selected"
                      className="w-full h-full object-cover"
                      style={{ aspectRatio: "4/5" }}
                    />
                  </div>
                </div>

                {/* Name */}
                <div className="flex justify-center absolute bottom-0 left-1/2 -translate-x-1/2 mb-20">
                  <div className="px-6 sm:px-8 py-3">
                    <p className="text-white text-3xl sm:text-3xl font-semibold whitespace-nowrap">
                      {userName || "Your Name"}
                    </p>
                  </div>
                </div>

                {/* Thank You Text */}
                <div className="text-center mb-12 absolute top-12 left-1/2 -translate-x-1/2">
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                    Thank You!
                  </h2>
                </div>  
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center mt-8">
              <button
                onClick={closeOverlay}
                className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all backdrop-blur-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDownload}
                className="px-8 py-3 from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60 transition-all flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
