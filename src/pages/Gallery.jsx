import React from 'react';
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { getUserImages, deleteImageFromFirestore, toggleFavoriteInFirestore } from "@/lib/firestore";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Trash2, Search, Filter, Heart, Share2, Grid3x3, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LazyImage } from "@/components/LazyImage";
import { toast } from "sonner";
import confetti from "canvas-confetti";
const categories = ["All", "Nature", "Adventure", "Architecture", "Old Snaps", "Portrait", "Lifestyle", "Creative"];
export default function Gallery() {
  const { user } = useAuth();
  const [images, setImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterType, setFilterType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  useEffect(() => {
    if (user) {
      loadImages();
    }
  }, [user]);
  const loadImages = async () => {
    if (!user) return;
    setLoading(true);
    try {
      console.log("[Gallery] Fetching images for user:", user.uid);
      const imgs = await getUserImages(user.uid);
      console.log("[Gallery] Loaded images:", imgs);
      setImages(imgs);
    } catch (error) {
      console.error("[Gallery] Error loading images:", error);
      toast.error("Failed to load gallery");
    } finally {
      setLoading(false);
    }
  };
  const toggleFavorite = async (publicId) => {
    if (!user) return;
    const image = images.find((img) => img.public_id === publicId);
    if (!image) return;
    const previousImages = [...images];
    const updated = images.map(
      (img) => img.public_id === publicId ? { ...img, isFavorite: !img.isFavorite } : img
    );
    setImages(updated);
    try {
      if (image.id) {
        await toggleFavoriteInFirestore(user.uid, image.id, image.isFavorite || false);
      } else {
        console.error("No document ID found for image:", image);
        toast.error("Cannot update favorite: Missing ID");
        setImages(previousImages);
        return;
      }
      if (!image.isFavorite) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
        toast.success("Added to favorites!");
      } else {
        toast.info("Removed from favorites");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorite status");
      setImages(previousImages);
    }
  };
  const handleDelete = async (publicId) => {
    if (!user) return;
    const previousImages = [...images];
    setImages(images.filter((img) => img.public_id !== publicId));
    try {
      await deleteImageFromFirestore(user.uid, publicId);
      toast.success("Image deleted successfully");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
      setImages(previousImages);
    }
  };
  const handleDownload = async (url, publicId) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${publicId}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      toast.success("Image downloaded");
    } catch (error) {
      toast.error("Failed to download image");
    }
  };
  const handleShare = async (url, publicId) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: publicId,
          text: "Check out this image!",
          url
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Share failed:", error);
      toast.error("Failed to share");
    }
  };
  const filteredImages = images.filter((img) => {
    const matchesSearch = img.public_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "All" || img.category?.toLowerCase() === filterCategory.toLowerCase();
    const matchesFavorites = filterType === "all" || filterType === "favorites" && img.isFavorite;
    return matchesSearch && matchesCategory && matchesFavorites;
  }).sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });
  useEffect(() => {
    console.log("[Gallery Debug] Current Filter:", filterCategory);
    console.log("[Gallery Debug] Total Images:", images.length);
    console.log("[Gallery Debug] Filtered Images:", filteredImages.length);
  }, [filterCategory, images.length, filteredImages.length]);
  const favoritesCount = images.filter((img) => img.isFavorite).length;
  return /* @__PURE__ */ React.createElement("div", { className: "container mx-auto px-4 py-8" }, /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      className: "text-center mb-12"
    },
    /* @__PURE__ */ React.createElement("h1", { className: "text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-4" }, "Your Collection"),
    /* @__PURE__ */ React.createElement("p", { className: "text-xl text-gray-400" }, images.length, " images \u2022 ", favoritesCount, " favorites")
  ), /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      className: "flex flex-wrap gap-2 mb-6 justify-center"
    },
    /* @__PURE__ */ React.createElement(
      Button,
      {
        variant: filterType === "all" ? "default" : "outline",
        onClick: () => setFilterType("all"),
        className: filterType === "all" ? "bg-gradient-to-r from-purple-600 to-pink-600" : ""
      },
      /* @__PURE__ */ React.createElement(Grid3x3, { className: "w-4 h-4 mr-2" }),
      "All (",
      images.length,
      ")"
    ),
    /* @__PURE__ */ React.createElement(
      Button,
      {
        variant: filterType === "favorites" ? "default" : "outline",
        onClick: () => setFilterType("favorites"),
        className: filterType === "favorites" ? "bg-gradient-to-r from-purple-600 to-pink-600" : ""
      },
      /* @__PURE__ */ React.createElement(Heart, { className: "w-4 h-4 mr-2" }),
      "Favorites (",
      favoritesCount,
      ")"
    )
  ), /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { delay: 0.2 },
      className: "flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto glass p-4 rounded-xl"
    },
    /* @__PURE__ */ React.createElement("div", { className: "relative flex-1" }, /* @__PURE__ */ React.createElement(Search, { className: "absolute left-3 top-3 w-5 h-5 text-gray-400" }), /* @__PURE__ */ React.createElement(
      Input,
      {
        placeholder: "Search images...",
        value: searchTerm,
        onChange: (e) => setSearchTerm(e.target.value),
        className: "pl-10 bg-transparent border-none focus:ring-0 text-lg"
      }
    )),
    /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Select, { value: filterCategory, onValueChange: setFilterCategory }, /* @__PURE__ */ React.createElement(SelectTrigger, { className: "w-[180px] border-none bg-transparent focus:ring-0" }, /* @__PURE__ */ React.createElement(SelectValue, null)), /* @__PURE__ */ React.createElement(SelectContent, null, categories.map((cat) => /* @__PURE__ */ React.createElement(SelectItem, { key: cat, value: cat }, cat))))),
    /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 border-l border-white/10 pl-4" }, /* @__PURE__ */ React.createElement(Filter, { className: "w-5 h-5 text-gray-400" }), /* @__PURE__ */ React.createElement(Select, { value: sortBy, onValueChange: setSortBy }, /* @__PURE__ */ React.createElement(SelectTrigger, { className: "w-[180px] border-none bg-transparent focus:ring-0" }, /* @__PURE__ */ React.createElement(SelectValue, null)), /* @__PURE__ */ React.createElement(SelectContent, null, /* @__PURE__ */ React.createElement(SelectItem, { value: "newest" }, "Newest First"), /* @__PURE__ */ React.createElement(SelectItem, { value: "oldest" }, "Oldest First"))))
  ), filteredImages.length === 0 ? /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      className: "text-center py-20"
    },
    /* @__PURE__ */ React.createElement("div", { className: "w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6" }, /* @__PURE__ */ React.createElement(Search, { className: "w-10 h-10 text-gray-500" })),
    /* @__PURE__ */ React.createElement("p", { className: "text-gray-400 text-lg" }, filterType === "favorites" ? "No favorites yet. Click the heart icon on images to add them!" : "No images found. Upload some to get started!")
  ) : /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    },
    filteredImages.map((image) => /* @__PURE__ */ React.createElement(
      motion.div,
      {
        key: image.public_id,
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        whileHover: { y: -5 },
        className: "group relative rounded-xl overflow-hidden glass-card border-0"
      },
      image.isFavorite && /* @__PURE__ */ React.createElement("div", { className: "absolute top-2 right-2 z-10 bg-red-500 rounded-full p-2" }, /* @__PURE__ */ React.createElement(Heart, { className: "w-4 h-4 text-white fill-white" })),
      /* @__PURE__ */ React.createElement(
        "div",
        {
          className: "aspect-square overflow-hidden cursor-pointer",
          onClick: () => setSelectedImage(image)
        },
        image.resource_type === "video" ? /* @__PURE__ */ React.createElement(
          "video",
          {
            src: image.secure_url,
            controls: true,
            className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          }
        ) : /* @__PURE__ */ React.createElement(
          LazyImage,
          {
            src: image.secure_url,
            alt: image.public_id,
            aspectRatio: "aspect-square",
            className: "transition-transform duration-500 group-hover:scale-110"
          }
        )
      ),
      /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-4 backdrop-blur-sm pointer-events-none" }, /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 pointer-events-auto" }, /* @__PURE__ */ React.createElement(
        Button,
        {
          size: "icon",
          variant: "secondary",
          className: "rounded-full hover:scale-110 transition-transform",
          onClick: (e) => {
            e.stopPropagation();
            toggleFavorite(image.public_id);
          }
        },
        /* @__PURE__ */ React.createElement(Heart, { className: `w-4 h-4 ${image.isFavorite ? "fill-red-500 text-red-500" : ""}` })
      ), /* @__PURE__ */ React.createElement(
        Button,
        {
          size: "icon",
          variant: "secondary",
          className: "rounded-full hover:scale-110 transition-transform",
          onClick: (e) => {
            e.stopPropagation();
            handleShare(image.secure_url, image.public_id);
          }
        },
        /* @__PURE__ */ React.createElement(Share2, { className: "w-4 h-4" })
      ), /* @__PURE__ */ React.createElement(
        Button,
        {
          size: "icon",
          variant: "secondary",
          className: "rounded-full hover:scale-110 transition-transform",
          onClick: (e) => {
            e.stopPropagation();
            handleDownload(image.secure_url, image.public_id);
          }
        },
        /* @__PURE__ */ React.createElement(Download, { className: "w-4 h-4" })
      ), /* @__PURE__ */ React.createElement(
        Button,
        {
          size: "icon",
          variant: "destructive",
          className: "rounded-full hover:scale-110 transition-transform",
          onClick: (e) => {
            e.stopPropagation();
            handleDelete(image.public_id);
          }
        },
        /* @__PURE__ */ React.createElement(Trash2, { className: "w-4 h-4" })
      )), /* @__PURE__ */ React.createElement("span", { className: "text-white font-medium px-4 text-center truncate w-full" }, image.public_id), image.category && /* @__PURE__ */ React.createElement("span", { className: "text-xs bg-purple-600/80 px-3 py-1 rounded-full" }, image.category))
    ))
  ), /* @__PURE__ */ React.createElement(AnimatePresence, null, selectedImage && /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      className: "fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4",
      onClick: () => setSelectedImage(null)
    },
    /* @__PURE__ */ React.createElement(
      motion.button,
      {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.8 },
        className: "absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-50",
        onClick: () => setSelectedImage(null)
      },
      /* @__PURE__ */ React.createElement(X, { className: "w-6 h-6 text-white" })
    ),
    /* @__PURE__ */ React.createElement(
      motion.div,
      {
        initial: { scale: 0.9, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.9, opacity: 0 },
        className: "relative max-w-7xl max-h-[90vh] w-full flex items-center justify-center",
        onClick: (e) => e.stopPropagation()
      },
      selectedImage.resource_type === "video" ? /* @__PURE__ */ React.createElement(
        "video",
        {
          src: selectedImage.secure_url,
          controls: true,
          autoPlay: true,
          className: "max-w-full max-h-[85vh] rounded-lg shadow-2xl"
        }
      ) : /* @__PURE__ */ React.createElement(
        "img",
        {
          src: selectedImage.secure_url,
          alt: selectedImage.public_id,
          className: "max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
        }
      ),
      /* @__PURE__ */ React.createElement("div", { className: "absolute bottom-[-60px] left-0 right-0 flex justify-center gap-4" }, /* @__PURE__ */ React.createElement(
        Button,
        {
          variant: "secondary",
          className: "rounded-full",
          onClick: () => toggleFavorite(selectedImage.public_id)
        },
        /* @__PURE__ */ React.createElement(Heart, { className: `w-4 h-4 mr-2 ${selectedImage.isFavorite ? "fill-red-500 text-red-500" : ""}` }),
        selectedImage.isFavorite ? "Favorited" : "Favorite"
      ), /* @__PURE__ */ React.createElement(
        Button,
        {
          variant: "secondary",
          className: "rounded-full",
          onClick: () => handleDownload(selectedImage.secure_url, selectedImage.public_id)
        },
        /* @__PURE__ */ React.createElement(Download, { className: "w-4 h-4 mr-2" }),
        "Download"
      ))
    )
  )));
}
