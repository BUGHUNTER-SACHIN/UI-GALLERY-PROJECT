import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { useAuth } from "../context/AuthContext";
import Layout from "../layout/Layout";

export default function Dashboard() {
  const { user } = useAuth();
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [previewImg, setPreviewImg] = useState(null);

  const fetchImages = async () => {
    const { data } = await supabase
      .from("images")
      .select("*")
      .eq("owner", user.id)
      .order("created_at", { ascending: false });

    setImages(data || []);
  };

  useEffect(() => {
    if (user) fetchImages();
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setPreviewImg(reader.result);
    reader.readAsDataURL(file);

    uploadImage(file);
  };

  const uploadImage = async (file) => {
    setUploading(true);

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${user.id}/${fileName}`;

    const { error } = await supabase.storage
      .from("images")
      .upload(filePath, file);

    if (error) {
      console.log(error);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("images")
      .getPublicUrl(filePath);

    const publicUrl = data.publicUrl;

    await supabase.from("images").insert({
      url: publicUrl,
      title: file.name,
      owner: user.id,
      created_at: new Date().toISOString(),
    });

    fetchImages();
    setUploading(false);
    setPreviewImg(null);
  };

  return (
    <Layout>
      <div className="px-6 py-6">

        <h2 className="text-4xl font-bold text-cyan-400 mb-6 text-center">
          Dashboard
        </h2>

        {/* Upload Box */}
        <div className="max-w-xl mx-auto p-6 rounded-2xl border border-cyan-400/30 bg-white/5 backdrop-blur-xl text-center shadow-lg">

          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-cyan-400/40 rounded-xl p-10 hover:bg-white/5 transition">
              <p className="text-gray-300 mb-2 text-lg">Click to upload</p>
              <p className="text-sm text-gray-500">PNG / JPG / JPEG</p>
            </div>

            <input type="file" className="hidden" onChange={handleFileChange} />
          </label>

          {previewImg && (
            <div className="mt-4">
              <p className="text-gray-300 mb-2">Image Preview</p>
              <img
                src={previewImg}
                className="w-full h-56 object-cover rounded-xl shadow-lg"
              />
            </div>
          )}

          {uploading && (
            <p className="text-yellow-400 mt-4 animate-pulse">Uploading...</p>
          )}
        </div>

        {/* Uploaded Images List */}
        <h3 className="text-2xl text-white mt-10 mb-4 text-center">
          Your Uploaded Images
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4 max-w-5xl mx-auto">
          {images.map((img) => (
            <div
              key={img.id}
              className="bg-white/5 p-2 rounded-xl backdrop-blur shadow-lg"
            >
              <img
                src={img.url}
                className="rounded-xl w-full h-48 object-cover"
              />
              <div className="mt-2 text-gray-300 text-sm">{img.title}</div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
