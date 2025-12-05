import React from 'react';
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Calendar, Image as ImageIcon, Heart, Wand2, Upload as UploadIcon, Camera } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserImages } from "@/lib/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
export default function Profile() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalImages: 0,
    favorites: 0,
    uploads: 0,
    conversions: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  useEffect(() => {
    if (user?.displayName) {
      setNewName(user.displayName);
    }
  }, [user]);
  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);
  const loadStats = async () => {
    if (!user) return;
    const images = await getUserImages(user.uid);
    setStats({
      totalImages: images.length,
      favorites: images.filter((img) => img.isFavorite).length,
      uploads: images.length,
      conversions: parseInt(localStorage.getItem("ai_conversions") || "0")
    });
    const activity = images.slice(0, 5).map((img) => ({
      type: "upload",
      title: `Uploaded ${img.public_id}`,
      time: new Date(img.created_at).toLocaleDateString(),
      icon: UploadIcon
    }));
    setRecentActivity(activity);
  };
  const handleAvatarUpload = () => {
    toast.info("Avatar upload coming soon!");
  };
  const handleSaveProfile = async () => {
    if (!auth.currentUser) return;
    try {
      await updateProfile(auth.currentUser, {
        displayName: newName
      });
      setIsEditing(false);
      toast.success("Profile updated successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "container mx-auto px-4 py-12 max-w-6xl" }, /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      className: "text-center mb-12"
    },
    /* @__PURE__ */ React.createElement("h1", { className: "text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-4" }, "Your Profile"),
    /* @__PURE__ */ React.createElement("p", { className: "text-xl text-gray-400" }, "Manage your account and view your activity")
  ), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8" }, /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      className: "lg:col-span-1"
    },
    /* @__PURE__ */ React.createElement("div", { className: "glass-card p-8 text-center" }, /* @__PURE__ */ React.createElement("div", { className: "relative inline-block mb-6" }, /* @__PURE__ */ React.createElement("div", { className: "w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-4xl font-bold" }, user?.email?.[0].toUpperCase() || "U"), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: handleAvatarUpload,
        className: "absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 rounded-full p-2 transition-colors"
      },
      /* @__PURE__ */ React.createElement(Camera, { className: "w-5 h-5 text-white" })
    )), /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-bold text-white mb-2" }, isEditing ? /* @__PURE__ */ React.createElement(
      Input,
      {
        value: newName,
        onChange: (e) => setNewName(e.target.value),
        className: "text-center bg-white/10 border-white/20 text-white"
      }
    ) : user?.displayName || "User"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-400 mb-6 flex items-center justify-center gap-2" }, /* @__PURE__ */ React.createElement(Mail, { className: "w-4 h-4" }), user?.email), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center gap-2 text-sm text-gray-400 mb-6" }, /* @__PURE__ */ React.createElement(Calendar, { className: "w-4 h-4" }), /* @__PURE__ */ React.createElement("span", null, "Member since ", new Date(user?.metadata?.creationTime || Date.now()).toLocaleDateString())), isEditing ? /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement(
      Button,
      {
        onClick: handleSaveProfile,
        className: "flex-1 bg-green-600 hover:bg-green-700"
      },
      "Save"
    ), /* @__PURE__ */ React.createElement(
      Button,
      {
        onClick: () => setIsEditing(false),
        variant: "outline",
        className: "flex-1"
      },
      "Cancel"
    )) : /* @__PURE__ */ React.createElement(
      Button,
      {
        onClick: () => setIsEditing(true),
        className: "w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
      },
      "Edit Profile"
    ))
  ), /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      className: "lg:col-span-2 space-y-6"
    },
    /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "glass-card p-6 text-center" }, /* @__PURE__ */ React.createElement(ImageIcon, { className: "w-8 h-8 text-purple-400 mx-auto mb-3" }), /* @__PURE__ */ React.createElement("div", { className: "text-3xl font-bold text-white mb-1" }, stats.totalImages), /* @__PURE__ */ React.createElement("div", { className: "text-sm text-gray-400" }, "Total Images")), /* @__PURE__ */ React.createElement("div", { className: "glass-card p-6 text-center" }, /* @__PURE__ */ React.createElement(Heart, { className: "w-8 h-8 text-pink-400 mx-auto mb-3" }), /* @__PURE__ */ React.createElement("div", { className: "text-3xl font-bold text-white mb-1" }, stats.favorites), /* @__PURE__ */ React.createElement("div", { className: "text-sm text-gray-400" }, "Favorites")), /* @__PURE__ */ React.createElement("div", { className: "glass-card p-6 text-center" }, /* @__PURE__ */ React.createElement(UploadIcon, { className: "w-8 h-8 text-blue-400 mx-auto mb-3" }), /* @__PURE__ */ React.createElement("div", { className: "text-3xl font-bold text-white mb-1" }, stats.uploads), /* @__PURE__ */ React.createElement("div", { className: "text-sm text-gray-400" }, "Uploads")), /* @__PURE__ */ React.createElement("div", { className: "glass-card p-6 text-center" }, /* @__PURE__ */ React.createElement(Wand2, { className: "w-8 h-8 text-green-400 mx-auto mb-3" }), /* @__PURE__ */ React.createElement("div", { className: "text-3xl font-bold text-white mb-1" }, stats.conversions), /* @__PURE__ */ React.createElement("div", { className: "text-sm text-gray-400" }, "AI Conversions"))),
    /* @__PURE__ */ React.createElement("div", { className: "glass-card p-6" }, /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-bold text-white mb-6 flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Calendar, { className: "w-5 h-5" }), "Recent Activity"), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, recentActivity.length > 0 ? recentActivity.map((activity, idx) => /* @__PURE__ */ React.createElement(
      motion.div,
      {
        key: idx,
        initial: { opacity: 0, x: -10 },
        animate: { opacity: 1, x: 0 },
        transition: { delay: idx * 0.1 },
        className: "flex items-center gap-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
      },
      /* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center" }, /* @__PURE__ */ React.createElement(activity.icon, { className: "w-5 h-5 text-purple-400" })),
      /* @__PURE__ */ React.createElement("div", { className: "flex-1" }, /* @__PURE__ */ React.createElement("p", { className: "text-white font-medium" }, activity.title), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-400" }, activity.time))
    )) : /* @__PURE__ */ React.createElement("p", { className: "text-gray-400 text-center py-8" }, "No recent activity"))),
    /* @__PURE__ */ React.createElement("div", { className: "glass-card p-6" }, /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-bold text-white mb-6" }, "Quick Actions"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" }, /* @__PURE__ */ React.createElement(
      Button,
      {
        variant: "outline",
        className: "justify-start h-auto py-4",
        onClick: () => window.location.href = "/upload"
      },
      /* @__PURE__ */ React.createElement(UploadIcon, { className: "w-5 h-5 mr-3" }),
      /* @__PURE__ */ React.createElement("div", { className: "text-left" }, /* @__PURE__ */ React.createElement("div", { className: "font-semibold" }, "Upload Images"), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-400" }, "Add new photos to your collection"))
    ), /* @__PURE__ */ React.createElement(
      Button,
      {
        variant: "outline",
        className: "justify-start h-auto py-4",
        onClick: () => window.location.href = "/ai-converter"
      },
      /* @__PURE__ */ React.createElement(Wand2, { className: "w-5 h-5 mr-3" }),
      /* @__PURE__ */ React.createElement("div", { className: "text-left" }, /* @__PURE__ */ React.createElement("div", { className: "font-semibold" }, "AI Converter"), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-400" }, "Transform images with AI"))
    ), /* @__PURE__ */ React.createElement(
      Button,
      {
        variant: "outline",
        className: "justify-start h-auto py-4",
        onClick: () => window.location.href = "/gallery"
      },
      /* @__PURE__ */ React.createElement(ImageIcon, { className: "w-5 h-5 mr-3" }),
      /* @__PURE__ */ React.createElement("div", { className: "text-left" }, /* @__PURE__ */ React.createElement("div", { className: "font-semibold" }, "View Gallery"), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-400" }, "Browse your collection"))
    ), /* @__PURE__ */ React.createElement(
      Button,
      {
        variant: "outline",
        className: "justify-start h-auto py-4",
        onClick: () => window.location.href = "/settings"
      },
      /* @__PURE__ */ React.createElement(User, { className: "w-5 h-5 mr-3" }),
      /* @__PURE__ */ React.createElement("div", { className: "text-left" }, /* @__PURE__ */ React.createElement("div", { className: "font-semibold" }, "Settings"), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-400" }, "Manage your preferences"))
    )))
  )));
}
