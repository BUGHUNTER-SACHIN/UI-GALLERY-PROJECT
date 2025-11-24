import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import ImageCard from "../components/Imagecard";
import Layout from "../layout/Layout";
// 1. Import the AI Modal and Icons
import AiEditorModal from "../components/AiEditorModal";
import { Wand2, Loader2 } from "lucide-react";

export default function Gallery() {
  // --- Original State ---
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // --- NEW: AI Editor State ---
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // --- Original Fetch Logic ---
  const fetchImages = async () => {
    setLoading(true);

    let query = supabase.from("images").select("*");

    if (sortBy === "newest")
      query = query.order("created_at", { ascending: false });
    else if (sortBy === "oldest")
      query = query.order("created_at", { ascending: true });

    const { data, error } = await query;

    if (error) console.log("Gallery fetch error:", error);
    setImages(data || []);

    setLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, [sortBy]);

  // --- NEW: Open Editor Handler ---
  const handleOpenEditor = (imageUrl) => {
    if (!imageUrl) return;
    setSelectedImage(imageUrl);
    setIsEditorOpen(true);
  };

  const filteredImages = images.filter((img) =>
    img.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="px-4 pb-20">

        {/* Title */}
        <h1 className="text-center text-5xl font-bold text-cyan-400 mt-10 mb-2">
          AetherGallery
        </h1>
        <p className="text-center text-gray-400 mb-10">
          Discover Stunning Images
        </p>

        {/* Search + Sort */}
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4 mb-10">
          <input
            type="text"
            placeholder="Search"
            className="flex-1 p-3 rounded-xl bg-white/5 backdrop-blur text-gray-200 border border-white/10 focus:outline-none focus:border-cyan-500/50 transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="p-3 rounded-xl bg-white/5 backdrop-blur text-gray-200 border border-white/10 focus:outline-none focus:border-cyan-500/50"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest" className="bg-slate-900">Newest</option>
            <option value="oldest" className="bg-slate-900">Oldest</option>
          </select>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center my-10">
             <Loader2 className="animate-spin text-cyan-500" size={32} />
          </div>
        )}

        {/* No images */}
        {!loading && filteredImages.length === 0 && (
          <p className="text-center opacity-70 text-gray-500">No images found.</p>
        )}

        {/* Gallery Grid */}
        <div className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          md:grid-cols-3 
          gap-6 
          max-w-6xl 
          mx-auto
        ">
          {filteredImages.map((image) => (
            // Wrapper div to position the Edit button
            <div key={image.id} className="relative group">
              
              <ImageCard image={image} />
              
              {/* NEW: Edit Button (Visible on Hover) */}
              <button 
                onClick={() => handleOpenEditor(image.image_url || image.url)} 
                className="
                  absolute bottom-4 right-4 
                  bg-cyan-500 hover:bg-cyan-400 text-black 
                  px-4 py-2 rounded-lg 
                  text-sm font-bold 
                  flex items-center gap-2
                  opacity-0 group-hover:opacity-100 
                  translate-y-2 group-hover:translate-y-0
                  transition-all duration-300 shadow-lg shadow-cyan-500/20
                  z-10 cursor-pointer
                "
              >
                <Wand2 size={16} /> Edit AI
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 mt-10 mb-4">
          © 2025 AetherGallery
        </p>

        {/* --- NEW: The AI Editor Modal --- */}
        <AiEditorModal 
          isOpen={isEditorOpen} 
          onClose={() => setIsEditorOpen(false)} 
          initialImage={selectedImage} 
        />

      </div>
    </Layout>
  );
}