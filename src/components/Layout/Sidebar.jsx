import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Image, Upload, Wand2, Edit, Box, Info, Mail, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
const sidebarItems = [
  { name: "Home", path: "/", icon: Home },
  { name: "Gallery", path: "/gallery", icon: Image },
  { name: "Upload", path: "/upload", icon: Upload },
  { name: "AI Converter", path: "/ai-converter", icon: Wand2 },
  { name: "Image Editor", path: "/editor", icon: Edit },
  { name: "3D Viewer", path: "/3d-viewer", icon: Box },
  { name: "Profile", path: "/profile", icon: User },
  { name: "Settings", path: "/settings", icon: Settings },
  { name: "About", path: "/about", icon: Info },
  { name: "Contact", path: "/contact", icon: Mail }
];
export function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(true);
  const timerRef = useRef(null);
  const handleMouseEnter = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setCollapsed(false);
  };
  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => {
      setCollapsed(true);
    }, 300);
  };
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);
  return /* @__PURE__ */ React.createElement(
    motion.aside,
    {
      initial: { x: -280 },
      animate: { x: 0, width: collapsed ? 80 : 280 },
      className: cn(
        "fixed left-0 top-24 bottom-0 z-40 glass-card border-r border-black/10 dark:border-white/10 transition-all duration-300",
        collapsed ? "w-20" : "w-70"
      ),
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave
    },
    /* @__PURE__ */ React.createElement("div", { className: "flex flex-col h-full p-4" }, /* @__PURE__ */ React.createElement("nav", { className: "flex-1 space-y-2 mt-4" }, sidebarItems.map((item) => {
      const isActive = location.pathname === item.path;
      return /* @__PURE__ */ React.createElement(
        Link,
        {
          key: item.path,
          to: item.path,
          className: cn(
            "relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
            isActive ? "text-white bg-purple-600 shadow-lg" : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
          ),
          title: collapsed ? item.name : void 0
        },
        isActive && /* @__PURE__ */ React.createElement(
          motion.div,
          {
            layoutId: "sidebar-indicator",
            className: "absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-0",
            transition: { type: "spring", bounce: 0.2, duration: 0.6 }
          }
        ),
        /* @__PURE__ */ React.createElement(item.icon, { className: cn("w-5 h-5 relative z-10 flex-shrink-0", isActive && "text-white") }),
        /* @__PURE__ */ React.createElement(AnimatePresence, null, !collapsed && /* @__PURE__ */ React.createElement(
          motion.span,
          {
            initial: { opacity: 0, x: -10 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -10 },
            transition: { duration: 0.2 },
            className: "relative z-10 whitespace-nowrap overflow-hidden"
          },
          item.name
        ))
      );
    })), !collapsed && /* @__PURE__ */ React.createElement("div", { className: "pt-4 border-t border-black/10 dark:border-white/10" }, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-muted-foreground text-center" }, "Cloud Canvas Gallery")))
  );
}
