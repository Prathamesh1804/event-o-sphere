import React, { useState } from 'react';

export default function EventCard({ event, onAdd, loading, added }) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Optimized fallbacks
  const categoryImages = {
    Technical: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=75&w=600",
    Cultural: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=75&w=600",
    Sports: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=75&w=600",
    Workshop: "https://images.unsplash.com/photo-1544531585-9847b68c8c86?auto=format&fit=crop&q=75&w=600",
    Academic: "https://images.unsplash.com/photo-1523050338192-0673073990bb?auto=format&fit=crop&q=75&w=600",
  };

  const imageSrc = event.posterUrl || categoryImages[event.category] || categoryImages.Technical;

  /**
   * 🛡️ MODIFIED SYNC HANDLER
   * Checks if Google API is ready before calling the onAdd function.
   *
   */
  const handleSyncClick = () => {
    // Check if gapi exists on the window object and if its client is initialized
    if (typeof window.gapi === 'undefined' || !window.gapi.client) {
      alert("Google Calendar service is still connecting. Please wait 2 seconds and try again.");
      return;
    }
    // If ready, proceed with the original onAdd function
    onAdd();
  };

  return (
    <div className="group bg-white rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full animate-fade-in">
      
      {/* Image Container Section */}
      <div className="relative h-52 md:h-64 w-full overflow-hidden bg-gray-100">
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse flex items-center justify-center">
            <span className="text-gray-400 text-[10px] font-black tracking-widest uppercase">Loading...</span>
          </div>
        )}

        <img
          src={imageSrc}
          loading="lazy"
          className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 ${
            isImageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
          alt={event.title}
          onLoad={() => setIsImageLoaded(true)}
          onError={(e) => { 
            e.target.onerror = null; 
            e.target.src = categoryImages.Technical; 
            setIsImageLoaded(true);
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        
        <div className="absolute top-4 left-4 z-10">
          <span className="backdrop-blur-md bg-white/80 text-gray-900 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm border border-white/50">
            {event.category}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 md:p-8 flex flex-col flex-1 bg-gradient-to-b from-white to-gray-50/30">
        <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-4 leading-tight">
          {event.title}
        </h3>
        
        <div className="space-y-3 md:space-y-4 mb-8">
          <div className="flex items-center text-gray-500 font-medium text-xs md:text-sm italic">
            <span className="bg-indigo-50 p-2 rounded-lg mr-3 md:mr-4 text-indigo-600 text-base">📅</span>
            {event.date?.toDate().toLocaleDateString('en-US', { 
              month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
            })}
          </div>
          <div className="flex items-center text-gray-500 font-medium text-xs md:text-sm">
            <span className="bg-rose-50 p-2 rounded-lg mr-3 md:mr-4 text-rose-600 text-base">📍</span>
            {event.venue}
          </div>
        </div>

        {/* 🔘 UPDATED BUTTON: Now calls handleSyncClick instead of onAdd directly */}
        <button
          disabled={loading || added}
          onClick={handleSyncClick}
          className={`mt-auto w-full py-4 md:py-5 rounded-xl md:rounded-[1.5rem] font-black text-[10px] md:text-xs tracking-widest transition-all duration-300 active:scale-95
            ${added 
              ? "bg-green-50 text-green-600 border-2 border-green-100 cursor-default shadow-none" 
              : "bg-gray-900 text-white hover:bg-indigo-600 shadow-xl shadow-indigo-100 hover:shadow-indigo-200"}
          `}
        >
          {added ? "✓ ADDED TO HUB" : loading ? "SYNCING..." : "SYNC TO CALENDAR"}
        </button>
      </div>
    </div>
  );
}