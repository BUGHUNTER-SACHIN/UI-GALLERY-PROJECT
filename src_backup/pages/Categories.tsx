import { Layout } from "@/components/Layout";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CloudinaryImage, getCloudinaryImages } from "@/lib/cloudinary";
import { Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { saveImagesToLocal } from "@/lib/cloudinary";

const categoryList = [
  { id: "all", name: "All" },
  { id: "nature", name: "Nature" },
  { id: "adventure", name: "Adventure" },
  { id: "architecture", name: "Architecture" },
  { id: "old-snaps", name: "Old Snaps" },
  { id: "portrait", name: "Portrait" },
  { id: "lifestyle", name: "Lifestyle" },
  { id: "creative", name: "Creative" }
];

export default function Categories() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [images, setImages] = useState<CloudinaryImage[]>([]);

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

  // Calculate category counts
  const getCategoryCount = (categoryId: string): number => {
    if (categoryId === "all") {
      return images.length;
    }
    return images.filter(img => img.category === categoryId).length;
  };

  // Get filtered images for selected category
  const getFilteredImages = (categoryId: string): CloudinaryImage[] => {
    if (categoryId === "all") {
      return images;
    }
    return images.filter(img => img.category === categoryId);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 animate-in fade-in duration-300">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-primary mb-4 transition-all duration-300">
            Browse by Category
          </h1>
          <p className="text-xl text-muted-foreground">
            Explore our curated collection organized by themes
          </p>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="inline-flex h-auto p-1 bg-muted rounded-lg mb-8 overflow-x-auto w-full justify-start">
            {categoryList.map((category) => {
              const count = getCategoryCount(category.id);
              return (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="px-6 py-3 rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground transition-all duration-300"
                >
                  <span className="font-medium">{category.name}</span>
                  {count > 0 && (
                    <span className="ml-2 text-xs text-muted-foreground">({count})</span>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {categoryList.map((category) => {
            const filteredImages = getFilteredImages(category.id);
            const count = getCategoryCount(category.id);
            
            return (
              <TabsContent key={category.id} value={category.id} className="mt-6">
                <div className="mb-6">
                  <h2 className="text-3xl font-semibold text-foreground mb-2">
                    {category.name === "All" ? "All Images" : `${category.name} Images`}
                  </h2>
                  <p className="text-muted-foreground">
                    {count} {count === 1 ? 'image' : 'images'} in this category
                  </p>
                </div>

                {filteredImages.length === 0 ? (
                  <div className="col-span-full text-center py-16 bg-card border border-border rounded-lg">
                    <p className="text-muted-foreground text-lg">
                      No images in this category yet. Start uploading and tag them with categories!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                            onClick={() => {
                              handleDelete(image.public_id);
                              loadImages();
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </Layout>
  );
}
