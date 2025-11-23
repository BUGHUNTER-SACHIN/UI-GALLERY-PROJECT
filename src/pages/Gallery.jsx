import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import ImageCard from "../components/ImageCard";
import Layout from "../layout/Layout";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");

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

  const filteredImages = images.filter((img) =>
    img.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="px-4">

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
            className="flex-1 p-3 rounded-xl bg-white/5 backdrop-blur text-gray-200 border border-white/10 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="p-3 rounded-xl bg-white/5 backdrop-blur text-gray-200 border border-white/10"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center opacity-70">Loading images...</p>
        )}

        {/* No images */}
        {!loading && filteredImages.length === 0 && (
          <p className="text-center opacity-70">No images found.</p>
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
            <ImageCard key={image.id} image={image} />
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 mt-10 mb-4">
          © 2024 AetherGallery
        </p>
      </div>
    </Layout>
  );
}
