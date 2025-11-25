import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { uploadToCloudinary, getCloudinaryImages, saveImagesToLocal } from "@/lib/cloudinary";
import { toast } from "sonner";
import { Upload as UploadIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Upload() {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    try {
      const result = await uploadToCloudinary(file);
      const existingImages = await getCloudinaryImages();
      const updatedImages = [...existingImages, result];
      saveImagesToLocal(updatedImages);
      toast.success("Image uploaded successfully!");
      setTimeout(() => navigate("/gallery"), 1000);
    } catch (error) {
      toast.error("Failed to upload image. Make sure you have set up an unsigned upload preset in Cloudinary.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">Upload Image</h1>
          
          <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
            {preview ? (
              <div className="mb-6">
                <img src={preview} alt="Preview" className="max-h-96 mx-auto rounded-lg" />
              </div>
            ) : (
              <div className="mb-6">
                <UploadIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Click below to select an image</p>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploading}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button disabled={uploading} asChild>
                <span>{uploading ? "Uploading..." : "Select Image"}</span>
              </Button>
            </label>
          </div>
        </div>
      </div>
    </Layout>
  );
}
