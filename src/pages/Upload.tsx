import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Upload as UploadIcon, X, FileImage, FileVideo, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { uploadToCloudinary, getCloudinaryImages, saveImagesToLocal } from "@/lib/cloudinary";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { saveImageToFirestore } from "@/lib/firestore";
import { useAuth } from "@/contexts/AuthContext";

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
    const [files, setFiles] = useState<File[]>([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            processFiles(Array.from(e.target.files));
        }
    };

    const processFiles = (newFiles: File[]) => {
        if (newFiles.length === 0) return;

        setFiles(prev => [...prev, ...newFiles]);

        newFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files) {
            processFiles(Array.from(e.dataTransfer.files));
        }
    };



    // ... inside component ...

    const { user } = useAuth();

    const handleUpload = async () => {
        if (!selectedCategory) {
            toast.error("Please select a category before uploading");
            return;
        }

        if (files.length === 0) return;

        if (!user) {
            toast.error("You must be logged in to upload");
            return;
        }

        setUploading(true);
        try {
            const uploadedResults = [];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const result = await uploadToCloudinary(file);
                result.category = selectedCategory;

                // Save to Firestore
                console.log(`[Upload] Saving to Firestore for user: ${user.uid}`);
                try {
                    await saveImageToFirestore(user.uid, result);
                    console.log("[Upload] Saved to Firestore successfully");
                } catch (fsError) {
                    console.error("[Upload] Firestore save failed:", fsError);
                    throw fsError;
                }

                uploadedResults.push(result);
                const progress = Math.round(((i + 1) / files.length) * 100);
                console.log(`[Upload] Progress: ${progress}%`);
                setUploadProgress(progress);
            }

            toast.success(`${files.length} file(s) uploaded successfully!`);

            setTimeout(() => navigate("/gallery"), 1000);
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload. Check your connection.");
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const clearSelection = () => {
        setPreviews([]);
        setFiles([]);
        setUploadProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
                    Upload Your Art
                </h1>
                <p className="text-gray-400">Share your vision with the world</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <motion.div
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className={cn(
                            "border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer relative overflow-hidden group",
                            isDragging ? "border-purple-500 bg-purple-500/10" : "border-white/10 hover:border-purple-500/50 hover:bg-white/5",
                            previews.length > 0 ? "border-green-500/50" : ""
                        )}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,video/*"
                            multiple
                            onChange={handleFileSelect}
                            disabled={uploading}
                            className="hidden"
                        />

                        <AnimatePresence mode="wait">
                            {previews.length > 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="grid grid-cols-2 gap-4"
                                >
                                    {previews.map((preview, idx) => (
                                        <div key={idx} className="relative aspect-video rounded-lg overflow-hidden group/preview">
                                            <img
                                                src={preview}
                                                alt={`Preview ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                                                <CheckCircle className="w-8 h-8 text-green-500" />
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center gap-4"
                                >
                                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                        <UploadIcon className="w-10 h-10 text-gray-400 group-hover:text-purple-400 transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-medium text-white">Drop files here or click to upload</p>
                                        <p className="text-sm text-gray-400 mt-2">Support for images and videos</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {uploading && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="space-y-2"
                        >
                            <div className="flex justify-between text-sm text-gray-400">
                                <span>Uploading...</span>
                                <span>{uploadProgress}%</span>
                            </div>
                            <Progress value={uploadProgress} className="h-2" />
                        </motion.div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="glass-card p-6 space-y-6">
                        <div>
                            <Label className="text-gray-400 mb-2 block">Category</Label>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={uploading}>
                                <SelectTrigger className="w-full bg-white/5 border-white/10">
                                    <SelectValue placeholder="Select category" />
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

                        <div className="space-y-3">
                            <Button
                                onClick={handleUpload}
                                disabled={uploading || files.length === 0 || !selectedCategory}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-6"
                            >
                                {uploading ? "Uploading..." : "Upload Files"}
                            </Button>

                            {files.length > 0 && (
                                <Button
                                    variant="ghost"
                                    onClick={clearSelection}
                                    disabled={uploading}
                                    className="w-full text-gray-400 hover:text-white hover:bg-white/5"
                                >
                                    <X className="w-4 h-4 mr-2" /> Clear Selection
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="glass-card p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Upload Guidelines</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li className="flex items-center gap-2">
                                <FileImage className="w-4 h-4 text-purple-400" />
                                High quality images (JPG, PNG)
                            </li>
                            <li className="flex items-center gap-2">
                                <FileVideo className="w-4 h-4 text-pink-400" />
                                Short videos (MP4, WebM)
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                Max file size: 10MB
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
