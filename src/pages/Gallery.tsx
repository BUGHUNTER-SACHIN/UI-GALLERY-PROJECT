import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloudinaryImage, getCloudinaryImages, saveImagesToLocal } from "@/lib/cloudinary";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Trash2, Search, Filter, Heart, Share2, Grid3x3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LazyImage } from "@/components/LazyImage";
import { toast } from "sonner";
import confetti from "canvas-confetti";

const categories = ["All", "Nature", "Adventure", "Architecture", "Old Snaps", "Portrait", "Lifestyle", "Creative"];

export default function Gallery() {
    const [images, setImages] = useState<CloudinaryImage[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [filterCategory, setFilterCategory] = useState("All");
    const [filterType, setFilterType] = useState<"all" | "favorites">("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadImages();
    }, []);

    const loadImages = async () => {
        setLoading(true);
        try {
            const imgs = await getCloudinaryImages();
            console.log("[Gallery UI] Loaded images:", imgs);
            setImages(imgs);
        } catch (error) {
            console.error("[Gallery UI] Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = (publicId: string) => {
        const updated = images.map(img =>
            img.public_id === publicId
                ? { ...img, isFavorite: !img.isFavorite }
                : img
        );
        setImages(updated);
        saveImagesToLocal(updated);

        const image = updated.find(img => img.public_id === publicId);
        if (image?.isFavorite) {
            confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.6 }
            });
            toast.success("Added to favorites!");
        } else {
            toast.info("Removed from favorites");
        }
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

    const handleShare = async (url: string, publicId: string) => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: publicId,
                    text: 'Check out this image!',
                    url: url
                });
            } else {
                await navigator.clipboard.writeText(url);
                toast.success("Link copied to clipboard!");
            }
        } catch (error) {
            console.error('Share failed:', error);
            toast.error("Failed to share");
        }
    };

    const filteredImages = images
        .filter(img => {
            // Search filter
            const matchesSearch = img.public_id.toLowerCase().includes(searchTerm.toLowerCase());

            // Category filter
            const matchesCategory = filterCategory === "All" ||
                img.category?.toLowerCase() === filterCategory.toLowerCase();

            // Favorites filter
            const matchesFavorites = filterType === "all" ||
                (filterType === "favorites" && img.isFavorite);

            return matchesSearch && matchesCategory && matchesFavorites;
        })
        .sort((a, b) => {
            if (sortBy === "newest") {
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            }
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        });

    const favoritesCount = images.filter(img => img.isFavorite).length;

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
                    Your Collection
                </h1>
                <p className="text-xl text-gray-400">
                    {images.length} images • {favoritesCount} favorites
                </p>
            </motion.div>

            {/* Filter Tabs */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-wrap gap-2 mb-6 justify-center"
            >
                <Button
                    variant={filterType === "all" ? "default" : "outline"}
                    onClick={() => setFilterType("all")}
                    className={filterType === "all" ? "bg-gradient-to-r from-purple-600 to-pink-600" : ""}
                >
                    <Grid3x3 className="w-4 h-4 mr-2" />
                    All ({images.length})
                </Button>
                <Button
                    variant={filterType === "favorites" ? "default" : "outline"}
                    onClick={() => setFilterType("favorites")}
                    className={filterType === "favorites" ? "bg-gradient-to-r from-purple-600 to-pink-600" : ""}
                >
                    <Heart className="w-4 h-4 mr-2" />
                    Favorites ({favoritesCount})
                </Button>
            </motion.div>

            {/* Search and Filter Bar */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto glass p-4 rounded-xl"
            >
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input
                        placeholder="Search images..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-transparent border-none focus:ring-0 text-lg"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger className="w-[180px] border-none bg-transparent focus:ring-0">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                    {cat}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[180px] border-none bg-transparent focus:ring-0">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="oldest">Oldest First</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </motion.div>

            <AnimatePresence mode="popLayout">
                {filteredImages.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="text-center py-20"
                    >
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-10 h-10 text-gray-500" />
                        </div>
                        <p className="text-gray-400 text-lg">
                            {filterType === "favorites"
                                ? "No favorites yet. Click the heart icon on images to add them!"
                                : "No images found. Upload some to get started!"}
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {filteredImages.map((image) => (
                            <motion.div
                                layout
                                key={image.public_id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                whileHover={{ y: -5 }}
                                className="group relative rounded-xl overflow-hidden glass-card border-0"
                            >
                                {/* Favorite Badge */}
                                {image.isFavorite && (
                                    <div className="absolute top-2 right-2 z-10 bg-red-500 rounded-full p-2">
                                        <Heart className="w-4 h-4 text-white fill-white" />
                                    </div>
                                )}

                                <div className="aspect-square overflow-hidden">
                                    {image.resource_type === 'video' ? (
                                        <video
                                            src={image.secure_url}
                                            controls
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <LazyImage
                                            src={image.secure_url}
                                            alt={image.public_id}
                                            aspectRatio="aspect-square"
                                            className="transition-transform duration-500 group-hover:scale-110"
                                        />
                                    )}
                                </div>

                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-4 backdrop-blur-sm">
                                    <div className="flex gap-2">
                                        <Button
                                            size="icon"
                                            variant="secondary"
                                            className="rounded-full hover:scale-110 transition-transform"
                                            onClick={() => toggleFavorite(image.public_id)}
                                        >
                                            <Heart className={`w-4 h-4 ${image.isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="secondary"
                                            className="rounded-full hover:scale-110 transition-transform"
                                            onClick={() => handleShare(image.secure_url, image.public_id)}
                                        >
                                            <Share2 className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="secondary"
                                            className="rounded-full hover:scale-110 transition-transform"
                                            onClick={() => handleDownload(image.secure_url, image.public_id)}
                                        >
                                            <Download className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="destructive"
                                            className="rounded-full hover:scale-110 transition-transform"
                                            onClick={() => handleDelete(image.public_id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <span className="text-white font-medium px-4 text-center truncate w-full">
                                        {image.public_id}
                                    </span>
                                    {image.category && (
                                        <span className="text-xs bg-purple-600/80 px-3 py-1 rounded-full">
                                            {image.category}
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
