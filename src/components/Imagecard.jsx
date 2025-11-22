import React from 'react'

export default function ImageCard({ image, onClick }) {
  return (
    <div className="relative group cursor-pointer" onClick={onClick}>
      <img
        src={image.url}
        alt={image.title}
        className="w-full h-40 object-cover rounded-md"
      />

      {/* Title Badge */}
      <div className="absolute bottom-2 left-2 text-xs bg-black/50 px-2 py-1 rounded">
        {image.title}
      </div>

      {/* Hover Tools */}
      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
        <button
          className="px-3 py-1 bg-white/10 rounded"
        >
          View
        </button>
      </div>
    </div>
  )
}
