import React from 'react';
import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Upload as UploadIcon, Image as ImageIcon, X, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import * as THREE from "three";
import { toast } from "sonner";
import { getUserImages } from "@/lib/firestore";
import { useAuth } from "@/contexts/AuthContext";
function TexturedBox({ textureUrl, ...props }) {
  const meshRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.2;
    }
  });
  const loadedTexture = textureUrl ? useLoader(THREE.TextureLoader, textureUrl) : null;
  const texture = loadedTexture && Array.isArray(loadedTexture) ? loadedTexture[0] : loadedTexture;
  useEffect(() => {
    if (texture && !Array.isArray(texture)) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
    }
  }, [texture]);
  return /* @__PURE__ */ React.createElement(
    "mesh",
    {
      ...props,
      ref: meshRef,
      onPointerOver: () => setHovered(true),
      onPointerOut: () => setHovered(false)
    },
    /* @__PURE__ */ React.createElement("boxGeometry", { args: [2, 2, 2] }),
    texture ? /* @__PURE__ */ React.createElement("meshStandardMaterial", { map: texture }) : /* @__PURE__ */ React.createElement("meshStandardMaterial", { color: hovered ? "#a855f7" : "#ec4899" })
  );
}
function TexturedSphere({ textureUrl, ...props }) {
  const loadedTexture = textureUrl ? useLoader(THREE.TextureLoader, textureUrl) : null;
  const texture = loadedTexture && Array.isArray(loadedTexture) ? loadedTexture[0] : loadedTexture;
  useEffect(() => {
    if (texture && !Array.isArray(texture)) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
    }
  }, [texture]);
  return /* @__PURE__ */ React.createElement("mesh", { ...props }, /* @__PURE__ */ React.createElement("sphereGeometry", { args: [1, 32, 32] }), texture ? /* @__PURE__ */ React.createElement("meshStandardMaterial", { map: texture }) : /* @__PURE__ */ React.createElement("meshStandardMaterial", { color: "#8b5cf6", metalness: 0.5, roughness: 0.2 }));
}
function TexturedTorus({ textureUrl, ...props }) {
  const meshRef = useRef(null);
  const loadedTexture = textureUrl ? useLoader(THREE.TextureLoader, textureUrl) : null;
  const texture = loadedTexture && Array.isArray(loadedTexture) ? loadedTexture[0] : loadedTexture;
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.3;
      meshRef.current.rotation.z += delta * 0.5;
    }
  });
  useEffect(() => {
    if (texture && !Array.isArray(texture)) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(2, 1);
    }
  }, [texture]);
  return /* @__PURE__ */ React.createElement("mesh", { ...props, ref: meshRef }, /* @__PURE__ */ React.createElement("torusGeometry", { args: [1.5, 0.5, 16, 100] }), texture ? /* @__PURE__ */ React.createElement("meshStandardMaterial", { map: texture }) : /* @__PURE__ */ React.createElement("meshStandardMaterial", { color: "#ec4899" }));
}
function SwipeStack({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  if (!images || images.length === 0) {
    return /* @__PURE__ */ React.createElement("div", { className: "w-full h-full flex flex-col items-center justify-center text-center p-8" }, /* @__PURE__ */ React.createElement("div", { className: "w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-4" }, /* @__PURE__ */ React.createElement(ImageIcon, { className: "w-10 h-10 text-white/50" })), /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-bold text-white mb-2" }, "No Memories Yet"), /* @__PURE__ */ React.createElement("p", { className: "text-white/70 max-w-md" }, "Upload photos in the Gallery to see them appear here as a 3D swipeable stack!"));
  }
  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };
  const handleBack = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  const currentImage = images[currentIndex];
  const nextIndex = (currentIndex + 1) % images.length;
  const nextImage = images[nextIndex];
  const variants = {
    enter: (direction2) => ({
      x: direction2 > 0 ? 500 : -500,
      opacity: 0,
      scale: 0.9,
      rotate: direction2 > 0 ? 10 : -10
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        x: { type: "spring", stiffness: 200, damping: 25 },
        opacity: { duration: 0.4, ease: "easeOut" },
        scale: { duration: 0.4, ease: "easeOut" },
        rotate: { duration: 0.4, ease: "easeOut" }
      }
    },
    exit: (direction2) => ({
      zIndex: 0,
      x: direction2 < 0 ? 500 : -500,
      opacity: 0,
      scale: 0.9,
      rotate: direction2 < 0 ? 10 : -10,
      transition: {
        x: { type: "spring", stiffness: 200, damping: 25 },
        opacity: { duration: 0.3, ease: "easeIn" },
        scale: { duration: 0.3, ease: "easeIn" },
        rotate: { duration: 0.3, ease: "easeIn" }
      }
    })
  };
  return /* @__PURE__ */ React.createElement("div", { className: "relative w-full h-full flex flex-col items-center justify-center min-h-[500px]" }, /* @__PURE__ */ React.createElement("div", { className: "relative w-72 h-[450px] md:w-96 md:h-[600px] perspective-1000" }, /* @__PURE__ */ React.createElement(
    motion.div,
    {
      key: nextIndex,
      initial: { scale: 0.9, opacity: 0 },
      animate: { scale: 0.95, opacity: 0.6 },
      transition: { duration: 0.4 },
      className: "absolute inset-0 bg-gray-200 dark:bg-gray-800 rounded-2xl shadow-xl transform translate-y-4 overflow-hidden"
    },
    nextImage && /* @__PURE__ */ React.createElement(
      "img",
      {
        src: nextImage.secure_url,
        alt: "Next",
        className: "w-full h-full object-cover opacity-50 blur-[1px]"
      }
    )
  ), /* @__PURE__ */ React.createElement(AnimatePresence, { initial: false, custom: direction, mode: "popLayout" }, /* @__PURE__ */ React.createElement(
    motion.div,
    {
      key: currentIndex,
      custom: direction,
      variants,
      initial: "enter",
      animate: "center",
      exit: "exit",
      className: "absolute inset-0 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing border border-purple-100 dark:border-white/10",
      drag: "x",
      dragConstraints: { left: 0, right: 0 },
      dragElastic: 0.7,
      onDragEnd: (e, { offset, velocity }) => {
        const swipe = offset.x;
        if (swipe < -100) {
          handleNext();
        } else if (swipe > 100) {
          handleBack();
        }
      }
    },
    /* @__PURE__ */ React.createElement("div", { className: "relative w-full h-full group" }, currentImage.resource_type === "video" ? /* @__PURE__ */ React.createElement(
      "video",
      {
        src: currentImage.secure_url,
        className: "w-full h-full object-cover",
        autoPlay: true,
        muted: true,
        loop: true
      }
    ) : /* @__PURE__ */ React.createElement(
      "img",
      {
        src: currentImage.secure_url,
        alt: currentImage.public_id,
        className: "w-full h-full object-cover pointer-events-none"
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6" }, /* @__PURE__ */ React.createElement("p", { className: "text-white font-medium truncate" }, currentImage.public_id.split("/").pop())))
  ))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-8 mt-12" }, /* @__PURE__ */ React.createElement(
    Button,
    {
      onClick: handleBack,
      variant: "outline",
      size: "icon",
      className: "w-14 h-14 rounded-full border-2 border-purple-500/50 hover:bg-purple-500/10 hover:border-purple-500 transition-all hover:scale-110 active:scale-95 bg-white/50 dark:bg-transparent"
    },
    /* @__PURE__ */ React.createElement(ArrowLeft, { className: "w-6 h-6 text-purple-600 dark:text-purple-400" })
  ), /* @__PURE__ */ React.createElement("div", { className: "text-black dark:text-gray-400 font-medium" }, currentIndex + 1, " / ", images.length), /* @__PURE__ */ React.createElement(
    Button,
    {
      onClick: handleNext,
      variant: "outline",
      size: "icon",
      className: "w-14 h-14 rounded-full border-2 border-pink-500/50 hover:bg-pink-500/10 hover:border-pink-500 transition-all hover:scale-110 active:scale-95 bg-white/50 dark:bg-transparent"
    },
    /* @__PURE__ */ React.createElement(ArrowRight, { className: "w-6 h-6 text-pink-600 dark:text-pink-400" })
  )));
}
export default function ThreeDViewer() {
  const { user } = useAuth();
  const [selectedModel, setSelectedModel] = useState("box");
  const [autoRotate, setAutoRotate] = useState(true);
  const [textureUrl, setTextureUrl] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  useEffect(() => {
    if (user) {
      loadGalleryImages();
    }
  }, [user]);
  const loadGalleryImages = async () => {
    if (!user) return;
    try {
      console.log("Fetching images for user:", user.uid);
      const images = await getUserImages(user.uid);
      console.log("Fetched images:", images);
      setGalleryImages(images);
    } catch (error) {
      console.error("Error loading images:", error);
      toast.error("Failed to load gallery images");
    }
  };
  const models = [
    { id: "box", name: "Cube", component: TexturedBox },
    { id: "sphere", name: "Sphere", component: TexturedSphere },
    { id: "torus", name: "Torus", component: TexturedTorus },
    { id: "memories", name: "Memories", component: null }
    // Special case
  ];
  const ModelComponent = models.find((m) => m.id === selectedModel)?.component || TexturedBox;
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setTextureUrl(event.target?.result);
      toast.success("Texture applied to 3D model!");
    };
    reader.readAsDataURL(file);
  };
  const handleGallerySelect = (imageUrl) => {
    setTextureUrl(imageUrl);
    toast.success("Texture applied to 3D model!");
  };
  const clearTexture = () => {
    setTextureUrl(null);
    toast.info("Texture removed");
  };
  return /* @__PURE__ */ React.createElement("div", { className: "container mx-auto px-4 py-12 max-w-7xl" }, /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      className: "text-center mb-12"
    },
    /* @__PURE__ */ React.createElement("h1", { className: "text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-600 mb-4" }, "3D Viewer"),
    /* @__PURE__ */ React.createElement("p", { className: "text-xl text-black dark:text-muted-foreground" }, selectedModel === "memories" ? "Swipe through your memories" : "Apply your images as textures on 3D models")
  ), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-6" }, /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      className: "glass-card p-6 space-y-6 lg:col-span-1"
    },
    /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold text-black dark:text-foreground mb-4" }, "Select Mode"), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, models.map((model) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: model.id,
        onClick: () => setSelectedModel(model.id),
        className: `w-full p-3 rounded-lg text-left transition-all ${selectedModel === model.id ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg" : "bg-black/5 dark:bg-white/5 text-black dark:text-gray-300 hover:bg-black/10 dark:hover:bg-white/10 hover:text-black dark:hover:text-white"}`
      },
      model.name
    )))),
    selectedModel !== "memories" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "pt-6 border-t border-black/10 dark:border-white/10" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold text-black dark:text-foreground mb-4" }, "Apply Texture"), /* @__PURE__ */ React.createElement(
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
        className: "w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
      },
      /* @__PURE__ */ React.createElement(UploadIcon, { className: "w-4 h-4 mr-2" }),
      "Upload Image"
    ), textureUrl && /* @__PURE__ */ React.createElement(
      Button,
      {
        onClick: clearTexture,
        variant: "outline",
        className: "w-full mt-2"
      },
      "Remove Texture"
    )), galleryImages.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "pt-6 border-t border-black/10 dark:border-white/10" }, /* @__PURE__ */ React.createElement(Label, { className: "text-black dark:text-muted-foreground mb-3 block" }, "Or select from gallery:"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-2 max-h-64 overflow-y-auto" }, galleryImages.slice(0, 12).map((img) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: img.public_id,
        onClick: () => handleGallerySelect(img.secure_url),
        className: `aspect-square rounded-lg overflow-hidden transition-all ${textureUrl === img.secure_url ? "ring-2 ring-purple-500" : "hover:ring-2 hover:ring-purple-400"}`
      },
      /* @__PURE__ */ React.createElement(
        "img",
        {
          src: img.secure_url,
          alt: img.public_id,
          className: "w-full h-full object-cover"
        }
      )
    ))))),
    /* @__PURE__ */ React.createElement("div", { className: "pt-6 border-t border-black/10 dark:border-white/10" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold text-black dark:text-foreground mb-4" }, "Controls"), /* @__PURE__ */ React.createElement("div", { className: "space-y-3 text-sm text-black dark:text-gray-400" }, selectedModel === "memories" ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("div", { className: "w-2 h-2 rounded-full bg-purple-400" }), /* @__PURE__ */ React.createElement("span", null, "Swipe Left/Right")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("div", { className: "w-2 h-2 rounded-full bg-pink-400" }), /* @__PURE__ */ React.createElement("span", null, "Use Buttons"))) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("div", { className: "w-2 h-2 rounded-full bg-purple-400" }), /* @__PURE__ */ React.createElement("span", null, "Left Click: Rotate")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("div", { className: "w-2 h-2 rounded-full bg-pink-400" }), /* @__PURE__ */ React.createElement("span", null, "Right Click: Pan")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("div", { className: "w-2 h-2 rounded-full bg-blue-400" }), /* @__PURE__ */ React.createElement("span", null, "Scroll: Zoom"))))),
    selectedModel !== "memories" && /* @__PURE__ */ React.createElement("div", { className: "pt-6 border-t border-black/10 dark:border-white/10" }, /* @__PURE__ */ React.createElement(
      Button,
      {
        variant: "outline",
        className: "w-full",
        onClick: () => setAutoRotate(!autoRotate)
      },
      /* @__PURE__ */ React.createElement(RotateCcw, { className: "w-4 h-4 mr-2" }),
      autoRotate ? "Stop" : "Start",
      " Auto-Rotate"
    ))
  ), /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { delay: 0.2 },
      className: "lg:col-span-3 glass-card p-2 overflow-hidden"
    },
    /* @__PURE__ */ React.createElement("div", { className: "relative w-full aspect-video md:aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-purple-900/20 dark:via-black dark:to-pink-900/20" }, selectedModel === "memories" ? /* @__PURE__ */ React.createElement(SwipeStack, { images: galleryImages }) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Canvas, { shadows: true }, /* @__PURE__ */ React.createElement(PerspectiveCamera, { makeDefault: true, position: [0, 0, 8] }), /* @__PURE__ */ React.createElement("ambientLight", { intensity: 0.5 }), /* @__PURE__ */ React.createElement("spotLight", { position: [10, 10, 10], angle: 0.15, penumbra: 1, castShadow: true }), /* @__PURE__ */ React.createElement("pointLight", { position: [-10, -10, -10], intensity: 0.5 }), /* @__PURE__ */ React.createElement(Suspense, { fallback: null }, /* @__PURE__ */ React.createElement(ModelComponent, { position: [0, 0, 0], textureUrl }), /* @__PURE__ */ React.createElement(Environment, { preset: "sunset" })), /* @__PURE__ */ React.createElement(
      OrbitControls,
      {
        enablePan: true,
        enableZoom: true,
        enableRotate: true,
        autoRotate,
        autoRotateSpeed: 2
      }
    )), textureUrl && /* @__PURE__ */ React.createElement("div", { className: "absolute top-4 left-4 bg-white/80 dark:bg-black/60 backdrop-blur px-3 py-2 rounded-lg flex items-center gap-2 shadow-lg" }, /* @__PURE__ */ React.createElement(ImageIcon, { className: "w-4 h-4 text-green-500 dark:text-green-400" }), /* @__PURE__ */ React.createElement("span", { className: "text-sm text-gray-900 dark:text-white" }, "Texture Applied")))),
    /* @__PURE__ */ React.createElement("div", { className: "mt-4 p-4 bg-black/5 dark:bg-white/5 rounded-lg" }, /* @__PURE__ */ React.createElement("h3", { className: "text-black dark:text-foreground font-semibold mb-2" }, "About This Mode"), /* @__PURE__ */ React.createElement("p", { className: "text-black dark:text-muted-foreground text-sm" }, "Currently viewing: ", /* @__PURE__ */ React.createElement("span", { className: "text-purple-600 dark:text-purple-400" }, models.find((m) => m.id === selectedModel)?.name)))
  )), /* @__PURE__ */ React.createElement(AnimatePresence, null, selectedImage && /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      className: "fixed inset-0 z-50 flex items-center justify-center bg-white/95 dark:bg-black/95 backdrop-blur-sm p-4",
      onClick: () => setSelectedImage(null)
    },
    /* @__PURE__ */ React.createElement(
      motion.button,
      {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.8 },
        className: "absolute top-4 right-4 p-2 bg-black/10 dark:bg-white/10 rounded-full hover:bg-black/20 dark:hover:bg-white/20 transition-colors z-50",
        onClick: () => setSelectedImage(null)
      },
      /* @__PURE__ */ React.createElement(X, { className: "w-6 h-6 text-foreground" })
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
      )
    )
  )));
}
