import React, { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import ImageCard from '../components/Imagecard'   // ✅ FIXED: Correct file name

export default function Gallery() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchImages = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from('images')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.log('Gallery fetch error:', error)
      setImages([])
    } else {
      setImages(data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchImages()
  }, [])

  return (
    <div>
      <h2 className="text-2xl mb-4">Gallery</h2>

      {loading && <p className="opacity-70">Loading images...</p>}

      {!loading && images.length === 0 && (
        <p className="opacity-70">No images uploaded yet.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image) => (
          <ImageCard key={image.id} image={image} />
        ))}
      </div>
    </div>
  )
}
