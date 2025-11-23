import React from "react";
import { PlayIcon, EyeIcon, PencilIcon } from "@heroicons/react/24/outline";

export default function ImageCard({ image, onView, onEdit, onAnimate }) {
  return (
    <div className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-lg">

      {/* Image */}
      <img
        src={image.url}
        alt={image.title}
        className="
          w-full h-56 object-cover 
          rounded-2xl 
          transition-transform duration-300 
          group-hover:scale-105
        "
      />

      {/* Title badge */}
      <div className="
        absolute bottom-3 left-3 
        bg-black/40 
        px-3 py-1 
        text-sm text-white/90 
        rounded-lg 
        backdrop-blur-sm
      ">
        {image.title}
      </div>

      {/* Hover overlay */}
      <div className="
        absolute inset-0 
        bg-black/30 
        opacity-0 
        group-hover:opacity-100 
        transition-all duration-300 
        backdrop-blur-sm
        flex items-center justify-center gap-4
      ">

        {/* Animation Button */}
        <button
          onClick={() => onAnimate && onAnimate(image)}
          className="
            px-4 py-2 
            bg-white/10 
            hover:bg-white/20 
            rounded-lg 
            text-sm text-white flex items-center gap-2
          "
        >
          <PlayIcon className="w-4 h-4" />
          Animate
        </button>

        {/* View Button */}
        <button
          onClick={() => onView && onView(image)}
          className="
            px-4 py-2 
            bg-white/10 
            hover:bg-white/20 
            rounded-lg 
            text-sm text-white flex items-center gap-2
          "
        >
          <EyeIcon className="w-4 h-4" />
          View
        </button>

        {/* Edit Button */}
        <button
          onClick={() => onEdit && onEdit(image)}
          className="
            px-4 py-2 
            bg-white/10 
            hover:bg-white/20 
            rounded-lg 
            text-sm text-white flex items-center gap-2
          "
        >
          <PencilIcon className="w-4 h-4" />
          Edit
        </button>
      </div>
    </div>
  );
}
