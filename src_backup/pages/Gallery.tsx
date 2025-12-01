import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { CloudinaryImage, getCloudinaryImages, saveImagesToLocal } from "@/lib/cloudinary";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Gallery() {
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    const imgs = await getCloudinaryImages();
    setImages(imgs);
  };

  const handleDelete = (publicId: string) => {
    const updated = images.filter(img => img.public_id !== publicId);
    setImages(updated);
    saveImagesToLocal(updated);
    toast.success("Image deleted successfully");
  };

  const handleDownload = async (url: string, publicId: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${publicId}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      toast.success("Image downloaded");
    } catch (error) {
      toast.error("Failed to download image");
    }
  };

  const filteredImages = images
    .filter(img => img.public_id.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary mb-4">AetherGallery</h1>
          <p className="text-xl text-muted-foreground">Discover Stunning Images</p>
        </div>

        <div className="flex gap-4 mb-8 max-w-4xl mx-auto">
          <Input
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredImages.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No images yet. Upload some to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image) => (
              <div key={image.public_id} className="group relative rounded-lg overflow-hidden bg-card border border-border">
                {image.resource_type === 'video' ? (
                  <video
                    src={image.secure_url}
                    controls
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <img
                    src={image.secure_url}
                    alt={image.public_id}
                    loading="lazy"
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => handleDownload(image.secure_url, image.public_id)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleDelete(image.public_id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <footer className="mt-20 text-center text-muted-foreground">
          © 2025 AetherGallery
        </footer>
      </div>
    </Layout>
  );
}
