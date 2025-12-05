import React from 'react';
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, Moon, Sun, Bell, Trash2, Save, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
export default function Settings() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [autoRotate3D, setAutoRotate3D] = useState(true);
  const [defaultCategory, setDefaultCategory] = useState("nature");
  const [imageQuality, setImageQuality] = useState("high");
  useEffect(() => {
    const savedSettings = localStorage.getItem("settings");
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setNotifications(settings.notifications ?? true);
      setAutoRotate3D(settings.autoRotate3D ?? true);
      setDefaultCategory(settings.defaultCategory || "nature");
      setImageQuality(settings.imageQuality || "high");
    }
  }, []);
  const handleSave = () => {
    localStorage.setItem("settings", JSON.stringify({
      notifications,
      autoRotate3D,
      defaultCategory,
      imageQuality
    }));
    toast.success("Settings saved successfully!");
  };
  const handleClearCache = () => {
    if (confirm("Are you sure you want to clear all cached data?")) {
      localStorage.removeItem("gallery_images");
      toast.success("Cache cleared successfully!");
    }
  };
  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      toast.error("Account deletion requires admin approval. Contact support.");
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "container mx-auto px-4 py-12 max-w-4xl" }, /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      className: "text-center mb-12"
    },
    /* @__PURE__ */ React.createElement("h1", { className: "text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-4" }, "Settings"),
    /* @__PURE__ */ React.createElement("p", { className: "text-xl text-muted-foreground" }, "Customize your experience")
  ), /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      className: "glass-card p-6"
    },
    /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-bold text-foreground mb-6 flex items-center gap-2" }, theme === "dark" ? /* @__PURE__ */ React.createElement(Moon, { className: "w-6 h-6" }) : /* @__PURE__ */ React.createElement(Sun, { className: "w-6 h-6" }), "Appearance"),
    /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between p-4 bg-black/5 dark:bg-white/5 rounded-lg" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Label, { className: "text-foreground font-medium" }, "Dark Mode"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-muted-foreground" }, "Toggle between dark and light theme")), /* @__PURE__ */ React.createElement(
      Switch,
      {
        checked: theme === "dark",
        onCheckedChange: toggleTheme,
        className: "border-black dark:border-transparent"
      }
    )))
  ), /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.1 },
      className: "glass-card p-6"
    },
    /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-bold text-foreground mb-6 flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Bell, { className: "w-6 h-6" }), "Notifications"),
    /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between p-4 bg-black/5 dark:bg-white/5 rounded-lg" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Label, { className: "text-foreground font-medium" }, "Enable Notifications"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-muted-foreground" }, "Receive updates about your uploads and conversions")), /* @__PURE__ */ React.createElement(
      Switch,
      {
        checked: notifications,
        onCheckedChange: setNotifications,
        className: "border-black dark:border-transparent"
      }
    )))
  ), /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.2 },
      className: "glass-card p-6"
    },
    /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-bold text-foreground mb-6 flex items-center gap-2" }, /* @__PURE__ */ React.createElement(SettingsIcon, { className: "w-6 h-6" }), "Preferences"),
    /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "p-4 bg-black/5 dark:bg-white/5 rounded-lg" }, /* @__PURE__ */ React.createElement(Label, { className: "text-foreground font-medium mb-2 block" }, "Default Upload Category"), /* @__PURE__ */ React.createElement(Select, { value: defaultCategory, onValueChange: setDefaultCategory }, /* @__PURE__ */ React.createElement(SelectTrigger, { className: "w-full bg-white dark:bg-white/5 border-black/10 dark:border-white/10 text-foreground" }, /* @__PURE__ */ React.createElement(SelectValue, null)), /* @__PURE__ */ React.createElement(SelectContent, null, /* @__PURE__ */ React.createElement(SelectItem, { value: "nature" }, "Nature"), /* @__PURE__ */ React.createElement(SelectItem, { value: "adventure" }, "Adventure"), /* @__PURE__ */ React.createElement(SelectItem, { value: "architecture" }, "Architecture"), /* @__PURE__ */ React.createElement(SelectItem, { value: "portrait" }, "Portrait"), /* @__PURE__ */ React.createElement(SelectItem, { value: "lifestyle" }, "Lifestyle"), /* @__PURE__ */ React.createElement(SelectItem, { value: "creative" }, "Creative")))), /* @__PURE__ */ React.createElement("div", { className: "p-4 bg-black/5 dark:bg-white/5 rounded-lg" }, /* @__PURE__ */ React.createElement(Label, { className: "text-foreground font-medium mb-2 block" }, "Image Quality"), /* @__PURE__ */ React.createElement(Select, { value: imageQuality, onValueChange: setImageQuality }, /* @__PURE__ */ React.createElement(SelectTrigger, { className: "w-full bg-white dark:bg-white/5 border-black/10 dark:border-white/10 text-foreground" }, /* @__PURE__ */ React.createElement(SelectValue, null)), /* @__PURE__ */ React.createElement(SelectContent, null, /* @__PURE__ */ React.createElement(SelectItem, { value: "low" }, "Low (Faster uploads)"), /* @__PURE__ */ React.createElement(SelectItem, { value: "medium" }, "Medium (Balanced)"), /* @__PURE__ */ React.createElement(SelectItem, { value: "high" }, "High (Best quality)")))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between p-4 bg-black/5 dark:bg-white/5 rounded-lg" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Label, { className: "text-foreground font-medium" }, "Auto-Rotate 3D Models"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-muted-foreground" }, "Automatically rotate 3D models in viewer")), /* @__PURE__ */ React.createElement(
      Switch,
      {
        checked: autoRotate3D,
        onCheckedChange: setAutoRotate3D,
        className: "border-black dark:border-transparent"
      }
    )))
  ), /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.3 },
      className: "glass-card p-6"
    },
    /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-bold text-foreground mb-6 flex items-center gap-2" }, /* @__PURE__ */ React.createElement(ImageIcon, { className: "w-6 h-6" }), "Data & Storage"),
    /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement(
      Button,
      {
        variant: "outline",
        className: "w-full justify-start",
        onClick: handleClearCache
      },
      /* @__PURE__ */ React.createElement(Trash2, { className: "w-4 h-4 mr-2" }),
      "Clear Cache"
    ))
  ), /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.4 },
      className: "glass-card p-6 border-2 border-red-500/20"
    },
    /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-bold text-red-500 mb-6" }, "Danger Zone"),
    /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "p-4 bg-red-500/10 rounded-lg" }, /* @__PURE__ */ React.createElement(Label, { className: "text-foreground font-medium mb-2 block" }, "Delete Account"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-muted-foreground mb-4" }, "Once you delete your account, there is no going back. Please be certain."), /* @__PURE__ */ React.createElement(
      Button,
      {
        variant: "destructive",
        onClick: handleDeleteAccount
      },
      /* @__PURE__ */ React.createElement(Trash2, { className: "w-4 h-4 mr-2" }),
      "Delete Account"
    )))
  ), /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { delay: 0.5 },
      className: "flex justify-end gap-4"
    },
    /* @__PURE__ */ React.createElement(
      Button,
      {
        onClick: handleSave,
        className: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
      },
      /* @__PURE__ */ React.createElement(Save, { className: "w-4 h-4 mr-2" }),
      "Save Changes"
    )
  )));
}
