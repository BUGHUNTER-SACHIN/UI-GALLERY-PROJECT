import React from 'react';
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, Info, Mail, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
const navItems = [
  { name: "Home", path: "/", icon: Home },
  { name: "About", path: "/about", icon: Info },
  { name: "Contact", path: "/contact", icon: Mail }
];
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    motion.nav,
    {
      initial: { y: -100 },
      animate: { y: 0 },
      className: cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "glass-card shadow-lg" : "bg-transparent"
      )
    },
    /* @__PURE__ */ React.createElement("div", { className: "container mx-auto px-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between h-20" }, /* @__PURE__ */ React.createElement(Link, { to: "/", className: "text-2xl font-bold" }, /* @__PURE__ */ React.createElement("span", { className: "bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600" }, "AetherGallery")), /* @__PURE__ */ React.createElement("div", { className: "hidden md:flex items-center gap-2" }, navItems.map((item) => {
      const isActive = location.pathname === item.path;
      return /* @__PURE__ */ React.createElement(
        Link,
        {
          key: item.path,
          to: item.path,
          className: cn(
            "relative px-4 py-2 rounded-xl text-sm font-medium transition-colors",
            isActive ? "text-white" : "text-gray-400 hover:text-white"
          )
        },
        isActive && /* @__PURE__ */ React.createElement(
          motion.div,
          {
            layoutId: "navbar-indicator",
            className: "absolute inset-0 bg-white/10 rounded-xl",
            transition: { type: "spring", bounce: 0.2, duration: 0.6 }
          }
        ),
        /* @__PURE__ */ React.createElement("span", { className: "relative z-10 flex items-center gap-2" }, /* @__PURE__ */ React.createElement(item.icon, { className: "w-4 h-4" }), item.name)
      );
    })), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-4" }, user && /* @__PURE__ */ React.createElement(
      Button,
      {
        onClick: handleLogout,
        variant: "outline",
        className: "hidden md:flex items-center gap-2 border-white/20 hover:bg-white/10"
      },
      /* @__PURE__ */ React.createElement(LogOut, { className: "w-4 h-4" }),
      "Logout"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "md:hidden text-white p-2",
        onClick: () => setIsOpen(!isOpen)
      },
      isOpen ? /* @__PURE__ */ React.createElement(X, null) : /* @__PURE__ */ React.createElement(Menu, null)
    ))))
  ), /* @__PURE__ */ React.createElement(AnimatePresence, null, isOpen && /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      className: "fixed inset-0 z-40 bg-black/95 backdrop-blur-xl pt-24 px-6 md:hidden"
    },
    /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-4" }, navItems.map((item) => /* @__PURE__ */ React.createElement(
      Link,
      {
        key: item.path,
        to: item.path,
        onClick: () => setIsOpen(false),
        className: cn(
          "flex items-center gap-4 p-4 rounded-xl text-lg font-medium transition-colors",
          location.pathname === item.path ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
        )
      },
      /* @__PURE__ */ React.createElement(item.icon, { className: "w-6 h-6" }),
      item.name
    )), user && /* @__PURE__ */ React.createElement(
      Button,
      {
        onClick: () => {
          handleLogout();
          setIsOpen(false);
        },
        variant: "outline",
        className: "flex items-center gap-4 p-4 rounded-xl text-lg font-medium border-white/20 hover:bg-white/10"
      },
      /* @__PURE__ */ React.createElement(LogOut, { className: "w-6 h-6" }),
      "Logout"
    ))
  )));
}
