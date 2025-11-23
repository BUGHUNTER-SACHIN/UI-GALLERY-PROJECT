import React from "react";
import { XMarkIcon, PlayIcon, PencilIcon, ArrowsPointingOutIcon } from "@heroicons/react/24/outline";

export default function ImagePreview({ image, onClose }) {
  if (!image) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">

      {/* Modal Container */}
      <div className="relative bg-black/40 border border-white/10 backdrop-blur-xl rounded-2xl p-6 w-full max-w-4xl animate-fadeIn scale-100">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-white transition"
        >
          <XMarkIcon className="w-7 h-7" />
        </button>

        {/* Image */}
        <img
          src={image.url}
          alt={image.title}
          className="
            w-full max-h-[550px] object-contain 
            rounded-xl shadow-lg 
            mb-5
          "
        />

        {/* Title */}
        <h2 className="text-2xl font-semibold text-white mb-4">
          {image.title}
        </h2>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          
          {/* Animate Button */}
          <button
            className="
              px-4 py-2 rounded-lg 
              bg-white/10 hover:bg-white/20
              text-white flex items-center gap-2 transition
            "
          >
            <PlayIcon className="w-5 h-5" />
            Animate
          </button>

          {/* View Fullscreen */}
          <button
            className="
              px-4 py-2 rounded-lg 
              bg-white/10 hover:bg-white/20
              text-white flex items-center gap-2 transition
            "
            onClick={() => window.open(image.url, "_blank")}
          >
            <ArrowsPointingOutIcon className="w-5 h-5" />
            Fullscreen
          </button>

          {/* Edit Button */}
          <button
            className="
              px-4 py-2 rounded-lg 
              bg-white/10 hover:bg-white/20
              text-white flex items-center gap-2 transition
            "
          >
            <PencilIcon className="w-5 h-5" />
            Edit
          </button>
        </div>

      </div>

      {/* fade animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.25s ease-out; }
      `}</style>
    </div>
  );
}
