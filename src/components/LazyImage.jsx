import React from 'react';
import { useState, useRef } from "react";
import { Skeleton } from "./ui/skeleton";
export function LazyImage({ src, alt, className = "", aspectRatio = "aspect-square" }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const imgRef = useRef(null);
  return /* @__PURE__ */ React.createElement("div", { ref: imgRef, className: `${aspectRatio} relative overflow-hidden ${className}` }, !isLoaded && /* @__PURE__ */ React.createElement(Skeleton, { className: "absolute inset-0" }), isInView && /* @__PURE__ */ React.createElement(
    "img",
    {
      src,
      alt,
      loading: "lazy",
      onLoad: () => setIsLoaded(true),
      className: `w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`
    }
  ));
}
