import React, { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()   // ✅ Correct way to get logged-in user
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)

  // Fetch all images uploaded by this user
  const fetchImages = async () => {
    const { data } = await supabase
      .from('images')
      .select('*')
      .eq('owner', user.id)
      .order('created_at', { ascending: false })

    setImages(data || [])
  }

  useEffect(() => {
    if (user) fetchImages()
  }, [user])

  const uploadImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)

    const fileName = `${Date.now()}-${file.name}`
    const filePath = `${user.id}/${fileName}`  // ✅ Upload inside user's folder

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file)

    if (uploadError) {
      console.log(uploadError)
      setUploading(false)
      return
    }

    // Generate public URL
    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    const publicUrl = data.publicUrl

    // Insert metadata into Supabase Database
    await supabase.from('images').insert({
      url: publicUrl,
      title: file.name,
      owner: user.id,
      created_at: new Date().toISOString(), // important for sorting
      tags: []
    })

    fetchImages()
    setUploading(false)
  }

  return (
    <div>
      <h2 className="text-2xl mb-4">Dashboard</h2>

      <input type="file" onChange={uploadImage} />
      {uploading && <p className="mt-2 text-yellow-400">Uploading...</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {images.map(img => (
          <div key={img.id} className="bg-white/5 p-2 rounded">
            <img src={img.url} alt="" className="rounded w-full h-40 object-cover" />
            <div className="mt-1">{img.title}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
