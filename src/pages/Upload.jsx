import React from 'react';
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Upload as UploadIcon, X, FileImage, FileVideo, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { saveImageToFirestore } from "@/lib/firestore";
import { useAuth } from "@/contexts/AuthContext";
const categories = [
  { id: "nature", name: "Nature" },
  { id: "adventure", name: "Adventure" },
  { id: "architecture", name: "Architecture" },
  { id: "old-snaps", name: "Old Snaps" },
  { id: "portrait", name: "Portrait" },
  { id: "lifestyle", name: "Lifestyle" },
  { id: "creative", name: "Creative" }
];
export default function Upload() {
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const handleFileSelect = (e) => {
    if (e.target.files) {
      processFiles(Array.from(e.target.files));
    }
  };
  const processFiles = (newFiles) => {
    if (newFiles.length === 0) return;
    setFiles((prev) => [...prev, ...newFiles]);
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };
  const { user } = useAuth();
  const handleUpload = async () => {
    if (!selectedCategory) {
      toast.error("Please select a category before uploading");
      return;
    }
    if (files.length === 0) return;
    if (!user) {
      toast.error("You must be logged in to upload");
      return;
    }
    setUploading(true);
    try {
      const uploadedResults = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const result = await uploadToCloudinary(file);
        result.category = selectedCategory;
        console.log(`[Upload] Saving to Firestore for user: ${user.uid}`);
        try {
          await saveImageToFirestore(user.uid, result);
          console.log("[Upload] Saved to Firestore successfully");
        } catch (fsError) {
          console.error("[Upload] Firestore save failed:", fsError);
          throw fsError;
        }
        uploadedResults.push(result);
        const progress = Math.round((i + 1) / files.length * 100);
        console.log(`[Upload] Progress: ${progress}%`);
        setUploadProgress(progress);
      }
      toast.success(`${files.length} file(s) uploaded successfully!`);
      setTimeout(() => navigate("/gallery"), 1e3);
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload. Check your connection.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };
  const clearSelection = () => {
    setPreviews([]);
    setFiles([]);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  return /* @__PURE__ */ React.createElement("div", { className: "container mx-auto px-4 py-12 max-w-4xl" }, /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      className: "text-center mb-12"
    },
    /* @__PURE__ */ React.createElement("h1", { className: "text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-4" }, "Upload Your Art"),
    /* @__PURE__ */ React.createElement("p", { className: "text-gray-400" }, "Share your vision with the world")
  ), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8" }, /* @__PURE__ */ React.createElement("div", { className: "md:col-span-2 space-y-6" }, /* @__PURE__ */ React.createElement(
    motion.div,
    {
      whileHover: { scale: 1.01 },
      whileTap: { scale: 0.99 },
      className: cn(
        "border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer relative overflow-hidden group",
        isDragging ? "border-purple-500 bg-purple-500/10" : "border-white/10 hover:border-purple-500/50 hover:bg-white/5",
        previews.length > 0 ? "border-green-500/50" : ""
      ),
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
      onClick: () => fileInputRef.current?.click()
    },
    /* @__PURE__ */ React.createElement(
      "input",
      {
        ref: fileInputRef,
        type: "file",
        accept: "image/*,video/*",
        multiple: true,
        onChange: handleFileSelect,
        disabled: uploading,
        className: "hidden"
      }
    ),
    /* @__PURE__ */ React.createElement(AnimatePresence, { mode: "wait" }, previews.length > 0 ? /* @__PURE__ */ React.createElement(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "grid grid-cols-2 gap-4"
      },
      previews.map((preview, idx) => /* @__PURE__ */ React.createElement("div", { key: idx, className: "relative aspect-video rounded-lg overflow-hidden group/preview" }, /* @__PURE__ */ React.createElement(
        "img",
        {
          src: preview,
          alt: `Preview ${idx + 1}`,
          className: "w-full h-full object-cover"
        }
      ), /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-black/50 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center" }, /* @__PURE__ */ React.createElement(CheckCircle, { className: "w-8 h-8 text-green-500" }))))
    ) : /* @__PURE__ */ React.createElement(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "flex flex-col items-center gap-4"
      },
      /* @__PURE__ */ React.createElement("div", { className: "w-20 h-20 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500" }, /* @__PURE__ */ React.createElement(UploadIcon, { className: "w-10 h-10 text-gray-400 group-hover:text-purple-400 transition-colors" })),
      /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-lg font-medium text-white" }, "Drop files here or click to upload"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-400 mt-2" }, "Support for images and videos"))
    ))
  ), uploading && /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0, height: 0 },
      animate: { opacity: 1, height: "auto" },
      className: "space-y-2"
    },
    /* @__PURE__ */ React.createElement("div", { className: "flex justify-between text-sm text-gray-400" }, /* @__PURE__ */ React.createElement("span", null, "Uploading..."), /* @__PURE__ */ React.createElement("span", null, uploadProgress, "%")),
    /* @__PURE__ */ React.createElement(Progress, { value: uploadProgress, className: "h-2" })
  )), /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "glass-card p-6 space-y-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Label, { className: "text-gray-400 mb-2 block" }, "Category"), /* @__PURE__ */ React.createElement(Select, { value: selectedCategory, onValueChange: setSelectedCategory, disabled: uploading }, /* @__PURE__ */ React.createElement(SelectTrigger, { className: "w-full bg-white/5 border-white/10" }, /* @__PURE__ */ React.createElement(SelectValue, { placeholder: "Select category" })), /* @__PURE__ */ React.createElement(SelectContent, null, categories.map((category) => /* @__PURE__ */ React.createElement(SelectItem, { key: category.id, value: category.id }, category.name))))), /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, /* @__PURE__ */ React.createElement(
    Button,
    {
      onClick: handleUpload,
      disabled: uploading || files.length === 0 || !selectedCategory,
      className: "w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-6"
    },
    uploading ? "Uploading..." : "Upload Files"
  ), files.length > 0 && /* @__PURE__ */ React.createElement(
    Button,
    {
      variant: "ghost",
      onClick: clearSelection,
      disabled: uploading,
      className: "w-full text-gray-400 hover:text-white hover:bg-white/5"
    },
    /* @__PURE__ */ React.createElement(X, { className: "w-4 h-4 mr-2" }),
    " Clear Selection"
  ))), /* @__PURE__ */ React.createElement("div", { className: "glass-card p-6" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold text-white mb-4" }, "Upload Guidelines"), /* @__PURE__ */ React.createElement("ul", { className: "space-y-3 text-sm text-gray-400" }, /* @__PURE__ */ React.createElement("li", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(FileImage, { className: "w-4 h-4 text-purple-400" }), "High quality images (JPG, PNG)"), /* @__PURE__ */ React.createElement("li", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(FileVideo, { className: "w-4 h-4 text-pink-400" }), "Short videos (MP4, WebM)"), /* @__PURE__ */ React.createElement("li", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(CheckCircle, { className: "w-4 h-4 text-green-400" }), "Max file size: 10MB"))))));
}
