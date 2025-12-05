import React from 'react';
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
export default function Index() {
  return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8" }, /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.8 }
    },
    /* @__PURE__ */ React.createElement("h1", { className: "text-6xl md:text-8xl font-bold tracking-tighter mb-6" }, /* @__PURE__ */ React.createElement("span", { className: "bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500" }, "AetherGallery"), /* @__PURE__ */ React.createElement("br", null)),
    /* @__PURE__ */ React.createElement("p", { className: "text-xl text-gray-400 max-w-2xl mx-auto" }, "Experience your digital art in a whole new dimension. Upload, edit, and view in 3D with our next-gen platform.")
  ), /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { delay: 0.5, duration: 0.8 },
      className: "flex gap-4"
    },
    /* @__PURE__ */ React.createElement(Link, { to: "/auth" }, /* @__PURE__ */ React.createElement("button", { className: "px-8 py-4 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform" }, "Get Started")),
    /* @__PURE__ */ React.createElement(Link, { to: "/gallery" }, /* @__PURE__ */ React.createElement("button", { className: "px-8 py-4 bg-white/10 text-white rounded-full font-bold hover:bg-white/20 transition-colors backdrop-blur-md" }, "View Gallery"))
  ));
}
