import React from 'react';
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload as UploadIcon, Wand2, Download, Loader2, ImageIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
const artStyles = [
  {
    id: "cartoon",
    name: "Cartoon",
    description: "Transform into vibrant cartoon art",
    gradient: "from-yellow-400 via-orange-500 to-red-500"
  },
  {
    id: "anime",
    name: "Anime",
    description: "Japanese animation style",
    gradient: "from-pink-400 via-purple-500 to-indigo-500"
  },
  {
    id: "sketch",
    name: "Pencil Sketch",
    description: "Hand-drawn pencil sketch",
    gradient: "from-gray-400 via-gray-600 to-gray-800"
  },
  {
    id: "oil-painting",
    name: "Oil Painting",
    description: "Classic oil painting style",
    gradient: "from-amber-600 via-orange-700 to-red-800"
  },
  {
    id: "watercolor",
    name: "Watercolor",
    description: "Soft watercolor painting",
    gradient: "from-blue-300 via-cyan-400 to-teal-500"
  },
  {
    id: "pixel-art",
    name: "Pixel Art",
    description: "Retro pixel art style",
    gradient: "from-green-400 via-emerald-500 to-teal-600"
  },
  {
    id: "3d-render",
    name: "3D Render",
    description: "3D rendered illustration",
    gradient: "from-violet-500 via-purple-600 to-fuchsia-700"
  },
  {
    id: "comic",
    name: "Comic Book",
    description: "Comic book style art",
    gradient: "from-red-500 via-pink-600 to-rose-700"
  }
];
export default function AIConverter() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [convertedImage, setConvertedImage] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState("");
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [strength, setStrength] = useState([70]);
  const fileInputRef = useRef(null);
  const { user } = useAuth();
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result);
      setConvertedImage(null);
    };
    reader.readAsDataURL(file);
  };
  const handleConvert = async () => {
    if (!selectedImage || !selectedStyle) {
      toast.error("Please upload an image and select a style");
      return;
    }
    setConverting(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 100);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2e3));
      clearInterval(interval);
      setProgress(100);
      setConvertedImage(selectedImage);
      toast.info("AI Feature is currently in development. Returning original image.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate image");
    } finally {
      setConverting(false);
      clearInterval(interval);
    }
  };
  const handleDownload = () => {
    if (!convertedImage) return;
    const link = document.createElement("a");
    link.href = convertedImage;
    link.download = `ai-converted-${selectedStyle}-${Date.now()}.png`;
    link.click();
    toast.success("Image downloaded!");
  };
  return /* @__PURE__ */ React.createElement("div", { className: "container mx-auto px-4 py-12 max-w-7xl" }, /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      className: "text-center mb-12"
    },
    /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center gap-3 mb-4" }, /* @__PURE__ */ React.createElement(Wand2, { className: "w-12 h-12 text-purple-400" }), /* @__PURE__ */ React.createElement("h1", { className: "text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600" }, "AI Image Converter"), /* @__PURE__ */ React.createElement(Sparkles, { className: "w-12 h-12 text-pink-400" })),
    /* @__PURE__ */ React.createElement("p", { className: "text-xl text-gray-400 max-w-2xl mx-auto" }, "Transform your photos into stunning artwork using AI-powered style transfer")
  ), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8" }, /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      className: "space-y-6"
    },
    /* @__PURE__ */ React.createElement("div", { className: "glass-card p-6" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold text-white mb-4" }, "1. Upload Image"), /* @__PURE__ */ React.createElement(
      "input",
      {
        ref: fileInputRef,
        type: "file",
        accept: "image/*",
        onChange: handleImageUpload,
        className: "hidden"
      }
    ), /* @__PURE__ */ React.createElement(
      Button,
      {
        onClick: () => fileInputRef.current?.click(),
        className: "w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
        disabled: converting
      },
      /* @__PURE__ */ React.createElement(UploadIcon, { className: "w-4 h-4 mr-2" }),
      selectedImage ? "Change Image" : "Upload Image"
    )),
    /* @__PURE__ */ React.createElement("div", { className: "glass-card p-6" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold text-white mb-4" }, "2. Select Art Style"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 mb-6" }, artStyles.map((style) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: style.id,
        onClick: () => setSelectedStyle(style.id),
        disabled: converting,
        className: `relative group overflow-hidden rounded-xl transition-all ${selectedStyle === style.id ? "ring-2 ring-purple-500 scale-105" : "hover:scale-105"}`
      },
      /* @__PURE__ */ React.createElement("div", { className: `aspect-square bg-gradient-to-br ${style.gradient} relative` }, /* @__PURE__ */ React.createElement(
        "img",
        {
          src: `/art-styles/${style.id}.png`,
          alt: style.name,
          className: "absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity",
          onError: (e) => {
            e.currentTarget.style.display = "none";
          }
        }
      ), /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" }), /* @__PURE__ */ React.createElement("div", { className: "absolute bottom-0 left-0 right-0 p-3 z-10" }, /* @__PURE__ */ React.createElement("p", { className: "text-white font-bold text-sm drop-shadow-lg" }, style.name), /* @__PURE__ */ React.createElement("p", { className: "text-white/90 text-xs line-clamp-1 drop-shadow-md" }, style.description))),
      selectedStyle === style.id && /* @__PURE__ */ React.createElement("div", { className: "absolute top-2 right-2 bg-purple-600 rounded-full p-1 z-20" }, /* @__PURE__ */ React.createElement(Sparkles, { className: "w-4 h-4 text-white" }))
    ))), /* @__PURE__ */ React.createElement(Select, { value: selectedStyle, onValueChange: setSelectedStyle, disabled: converting }, /* @__PURE__ */ React.createElement(SelectTrigger, { className: "w-full bg-white/5 border-white/10" }, /* @__PURE__ */ React.createElement(SelectValue, { placeholder: "Or choose from dropdown" })), /* @__PURE__ */ React.createElement(SelectContent, null, artStyles.map((style) => /* @__PURE__ */ React.createElement(SelectItem, { key: style.id, value: style.id }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "font-medium" }, style.name), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-400" }, style.description)))))), selectedStyle && /* @__PURE__ */ React.createElement("div", { className: "mt-4 p-3 bg-purple-600/10 border border-purple-600/20 rounded-lg" }, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-purple-300" }, "\u2728 ", artStyles.find((s) => s.id === selectedStyle)?.description))),
    selectedStyle && /* @__PURE__ */ React.createElement("div", { className: "glass-card p-6" }, /* @__PURE__ */ React.createElement(Label, { className: "text-white mb-4 block" }, "Conversion Strength: ", strength[0], "%"), /* @__PURE__ */ React.createElement(
      Slider,
      {
        value: strength,
        onValueChange: setStrength,
        min: 0,
        max: 100,
        step: 5,
        disabled: converting,
        className: "mt-2"
      }
    ), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-gray-400 mt-2" }, "Higher values create stronger transformations")),
    /* @__PURE__ */ React.createElement("div", { className: "glass-card p-6" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold text-white mb-4" }, "3. Convert"), /* @__PURE__ */ React.createElement(
      Button,
      {
        onClick: handleConvert,
        disabled: !selectedImage || !selectedStyle || converting,
        className: "w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-12 text-lg font-bold"
      },
      converting ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Loader2, { className: "w-5 h-5 mr-2 animate-spin" }), "Converting...") : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Wand2, { className: "w-5 h-5 mr-2" }), "Transform with AI")
    ), converting && /* @__PURE__ */ React.createElement("div", { className: "mt-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between text-sm text-gray-400 mb-2" }, /* @__PURE__ */ React.createElement("span", null, "Processing..."), /* @__PURE__ */ React.createElement("span", null, progress, "%")), /* @__PURE__ */ React.createElement(Progress, { value: progress, className: "h-2" }))),
    convertedImage && /* @__PURE__ */ React.createElement(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        className: "glass-card p-6"
      },
      /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold text-white mb-4" }, "4. Download"),
      /* @__PURE__ */ React.createElement(
        Button,
        {
          onClick: handleDownload,
          className: "w-full bg-blue-600 hover:bg-blue-700"
        },
        /* @__PURE__ */ React.createElement(Download, { className: "w-4 h-4 mr-2" }),
        "Download Result"
      )
    ),
    /* @__PURE__ */ React.createElement("div", { className: "glass-card p-6 bg-gradient-to-br from-purple-600/10 to-pink-600/10 border border-white/10" }, /* @__PURE__ */ React.createElement("h3", { className: "text-sm font-semibold text-white mb-2" }, "\u{1F4A1} Tips"), /* @__PURE__ */ React.createElement("ul", { className: "text-xs text-gray-400 space-y-2" }, /* @__PURE__ */ React.createElement("li", null, "\u2022 Use high-quality images for best results"), /* @__PURE__ */ React.createElement("li", null, "\u2022 Processing time: 30-60 seconds"), /* @__PURE__ */ React.createElement("li", null, "\u2022 Works best with portraits and landscapes"), /* @__PURE__ */ React.createElement("li", null, "\u2022 Try different styles for variety")))
  ), /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { delay: 0.2 },
      className: "lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6"
    },
    /* @__PURE__ */ React.createElement("div", { className: "glass-card p-6" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold text-white mb-4 flex items-center gap-2" }, /* @__PURE__ */ React.createElement(ImageIcon, { className: "w-5 h-5 text-gray-400" }), "Original Image"), /* @__PURE__ */ React.createElement("div", { className: "aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-purple-900/20 to-black flex items-center justify-center" }, selectedImage ? /* @__PURE__ */ React.createElement(
      "img",
      {
        src: selectedImage,
        alt: "Original",
        className: "w-full h-full object-contain"
      }
    ) : /* @__PURE__ */ React.createElement("div", { className: "text-center text-gray-500" }, /* @__PURE__ */ React.createElement(ImageIcon, { className: "w-16 h-16 mx-auto mb-3 opacity-20" }), /* @__PURE__ */ React.createElement("p", null, "No image uploaded")))),
    /* @__PURE__ */ React.createElement("div", { className: "glass-card p-6" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold text-white mb-4 flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Sparkles, { className: "w-5 h-5 text-purple-400" }), "AI Converted"), /* @__PURE__ */ React.createElement("div", { className: "aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-pink-900/20 to-black flex items-center justify-center relative" }, converting && /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10" }, /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement(Loader2, { className: "w-16 h-16 animate-spin text-purple-400 mx-auto mb-4" }), /* @__PURE__ */ React.createElement("p", { className: "text-white font-medium" }, "Converting your image..."), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-400 mt-2" }, "This may take a moment"))), convertedImage ? /* @__PURE__ */ React.createElement(
      "img",
      {
        src: convertedImage,
        alt: "Converted",
        className: "w-full h-full object-contain"
      }
    ) : /* @__PURE__ */ React.createElement("div", { className: "text-center text-gray-500" }, /* @__PURE__ */ React.createElement(Wand2, { className: "w-16 h-16 mx-auto mb-3 opacity-20" }), /* @__PURE__ */ React.createElement("p", null, "Converted image will appear here"))))
  )), /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.4 },
      className: "mt-16"
    },
    /* @__PURE__ */ React.createElement("h2", { className: "text-3xl font-bold text-white text-center mb-8" }, "Available Art Styles"),
    /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4" }, artStyles.map((style, idx) => /* @__PURE__ */ React.createElement(
      motion.div,
      {
        key: style.id,
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.1 * idx },
        whileHover: { scale: 1.05 },
        onClick: () => setSelectedStyle(style.id),
        className: `glass-card p-4 cursor-pointer transition-all ${selectedStyle === style.id ? "ring-2 ring-purple-500" : "hover:bg-white/5"}`
      },
      /* @__PURE__ */ React.createElement("div", { className: `aspect-square rounded-lg bg-gradient-to-br ${style.gradient} mb-3 relative overflow-hidden` }, /* @__PURE__ */ React.createElement(
        "img",
        {
          src: `/art-styles/${style.id}.png`,
          alt: style.name,
          className: "absolute inset-0 w-full h-full object-cover opacity-60",
          onError: (e) => {
            e.currentTarget.style.display = "none";
          }
        }
      ), /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 flex items-center justify-center" }, /* @__PURE__ */ React.createElement(Sparkles, { className: "w-8 h-8 text-purple-400" }))),
      /* @__PURE__ */ React.createElement("h4", { className: "font-semibold text-white text-sm" }, style.name),
      /* @__PURE__ */ React.createElement("p", { className: "text-xs text-gray-400 mt-1" }, style.description)
    )))
  ));
}
