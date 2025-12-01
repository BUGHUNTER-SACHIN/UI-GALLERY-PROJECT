import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { uploadToCloudinary, getCloudinaryImages, saveImagesToLocal } from "@/lib/cloudinary";
import { toast } from "sonner";
import { Upload as UploadIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const categories = [
  { id: "nature", name: "Nature" },
  { id: "adventure", name: "Adventure" },
  { id: "architecture", name: "Architecture" },
  { id: "old-snaps", name: "Old Snaps" },
  { id: "portrait", name: "Portrait" },
  { id: "lifestyle", name: "Lifestyle" },
  { id: "creative", name: "Creative" }
];

export default function Upload() {
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const navigate = useNavigate();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Show previews
    const fileArray = Array.from(files);
    const previewUrls: string[] = [];
    
    for (const file of fileArray) {
      const reader = new FileReader();
      reader.onloadend = () => {
        previewUrls.push(reader.result as string);
        if (previewUrls.length === fileArray.length) {
          setPreviews(previewUrls);
        }
      };
      reader.readAsDataURL(file);
    }

    // Upload all files
    if (!selectedCategory) {
      toast.error("Please select a category before uploading");
      return;
    }

    setUploading(true);
    try {
      const existingImages = await getCloudinaryImages();
      const uploadedResults = [];
      
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        const result = await uploadToCloudinary(file);
        // Add category to the uploaded image
        result.category = selectedCategory;
        uploadedResults.push(result);
        setUploadProgress(Math.round(((i + 1) / fileArray.length) * 100));
      }
      
      const updatedImages = [...existingImages, ...uploadedResults];
      saveImagesToLocal(updatedImages);
      toast.success(`${fileArray.length} file(s) uploaded successfully!`);
      setPreviews([]);
      setSelectedCategory("");
      setTimeout(() => navigate("/gallery"), 1000);
    } catch (error) {
      toast.error("Failed to upload. Make sure you have set up an unsigned upload preset in Cloudinary.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8 transition-all duration-300">Upload Images & Videos</h1>
          
          <div className="border-2 border-dashed border-border rounded-lg p-12 text-center transition-all duration-300 hover:border-primary/50">
            {previews.length > 0 ? (
              <div className="mb-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-auto">
                  {previews.map((preview, idx) => (
                    <img 
                      key={idx} 
                      src={preview} 
                      alt={`Preview ${idx + 1}`} 
                      className="w-full h-32 object-cover rounded-lg transition-transform duration-300 hover:scale-105" 
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <UploadIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4 transition-transform duration-300 hover:scale-110" />
                <p className="text-muted-foreground">Click below to select images or videos</p>
                <p className="text-sm text-muted-foreground mt-2">Multiple files supported</p>
              </div>
            )}

            {previews.length > 0 && (
              <div className="mb-6">
                <Label htmlFor="category-select" className="text-sm font-medium mb-2 block">
                  Select Category
                </Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={uploading}>
                  <SelectTrigger id="category-select" className="w-full">
                    <SelectValue placeholder="Choose a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {uploading && uploadProgress > 0 && (
              <div className="mb-4">
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">{uploadProgress}% uploaded</p>
              </div>
            )}

            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileSelect}
              disabled={uploading}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button disabled={uploading} asChild>
                <span className="transition-all duration-300">
                  {uploading ? `Uploading... ${uploadProgress}%` : "Select Files"}
                </span>
              </Button>
            </label>
          </div>
        </div>
      </div>
    </Layout>
  );
}
