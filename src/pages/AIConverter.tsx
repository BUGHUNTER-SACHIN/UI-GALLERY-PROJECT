import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload as UploadIcon, Wand2, Download, Loader2, ImageIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const artStyles = [
    {
        id: "cartoon",
        name: "Cartoon",
        description: "Transform into vibrant cartoon art",
        gradient: "from-yellow-400 via-orange-500 to-red-500"
    },
    {
        id: "anime",
        name: "Anime",
        description: "Japanese animation style",
        gradient: "from-pink-400 via-purple-500 to-indigo-500"
    },
    {
        id: "sketch",
        name: "Pencil Sketch",
        description: "Hand-drawn pencil sketch",
        gradient: "from-gray-400 via-gray-600 to-gray-800"
    },
    {
        id: "oil-painting",
        name: "Oil Painting",
        description: "Classic oil painting style",
        gradient: "from-amber-600 via-orange-700 to-red-800"
    },
    {
        id: "watercolor",
        name: "Watercolor",
        description: "Soft watercolor painting",
        gradient: "from-blue-300 via-cyan-400 to-teal-500"
    },
    {
        id: "pixel-art",
        name: "Pixel Art",
        description: "Retro pixel art style",
        gradient: "from-green-400 via-emerald-500 to-teal-600"
    },
    {
        id: "3d-render",
        name: "3D Render",
        description: "3D rendered illustration",
        gradient: "from-violet-500 via-purple-600 to-fuchsia-700"
    },
    {
        id: "comic",
        name: "Comic Book",
        description: "Comic book style art",
        gradient: "from-red-500 via-pink-600 to-rose-700"
    },
];

export default function AIConverter() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [convertedImage, setConvertedImage] = useState<string | null>(null);
    const [selectedStyle, setSelectedStyle] = useState<string>("");
    const [converting, setConverting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [strength, setStrength] = useState([70]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { user } = useAuth();

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = (event) => {
            setSelectedImage(event.target?.result as string);
            setConvertedImage(null);
        };
        reader.readAsDataURL(file);
    };

    const handleConvert = async () => {
        if (!selectedFile || !selectedStyle) {
            toast.error("Please upload an image and select a style");
            return;
        }

        setConverting(true);
        setProgress(0);

        try {
            // Progress simulation
            const progressInterval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 5;
                });
            }, 500);

            // Call the backend API
            const formData = new FormData();
            formData.append('image', selectedFile);
            formData.append('style', selectedStyle);
            formData.append('strength', strength[0].toString());

            const response = await fetch(`${import.meta.env.VITE_AI_PROXY_URL || 'http://localhost:3000'}/api/convert`, {
                method: 'POST',
                body: formData,
                headers: {
                    'x-user-id': user?.uid || 'anonymous'
                }
            });

            clearInterval(progressInterval);

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Conversion failed');
            }

            const data = await response.json();
            setProgress(100);
            setConvertedImage(data.output);

            toast.success(`Image converted successfully! (${Math.round(data.processingTime / 1000)}s)`);
        } catch (error) {
            console.error('Conversion error:', error);
            toast.error(error instanceof Error ? error.message : "Conversion failed. Please try again.");
        } finally {
            setConverting(false);
            setTimeout(() => setProgress(0), 1000);
        }
    };

    const handleDownload = () => {
        if (!convertedImage) return;

        const link = document.createElement('a');
        link.href = convertedImage;
        link.download = `ai-converted-${selectedStyle}-${Date.now()}.png`;
        link.click();
        toast.success("Image downloaded!");
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-7xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <div className="flex items-center justify-center gap-3 mb-4">
                    <Wand2 className="w-12 h-12 text-purple-400" />
                    <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600">
                        AI Image Converter
                    </h1>
                    <Sparkles className="w-12 h-12 text-pink-400" />
                </div>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    Transform your photos into stunning artwork using AI-powered style transfer
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Control Panel */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                >
                    {/* Upload Section */}
                    <div className="glass-card p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            1. Upload Image
                        </h3>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                        <Button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                            disabled={converting}
                        >
                            <UploadIcon className="w-4 h-4 mr-2" />
                            {selectedImage ? "Change Image" : "Upload Image"}
                        </Button>
                    </div>

                    {/* Style Selection */}
                    <div className="glass-card p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            2. Select Art Style
                        </h3>

                        {/* Visual Style Preview Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                            {artStyles.map((style) => (
                                <button
                                    key={style.id}
                                    onClick={() => setSelectedStyle(style.id)}
                                    disabled={converting}
                                    className={`relative group overflow-hidden rounded-xl transition-all ${selectedStyle === style.id
                                        ? 'ring-2 ring-purple-500 scale-105'
                                        : 'hover:scale-105'
                                        }`}
                                >
                                    {/* Gradient Background */}
                                    <div className={`aspect-square bg-gradient-to-br ${style.gradient} relative`}>
                                        {/* Preview Image Overlay */}
                                        <img
                                            src={`/art-styles/${style.id}.png`}
                                            alt={style.name}
                                            className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                                            onError={(e) => {
                                                // Hide image if it fails to load, show gradient only
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />

                                        {/* Dark Overlay */}
                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                                        {/* Text Content */}
                                        <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                                            <p className="text-white font-bold text-sm drop-shadow-lg">{style.name}</p>
                                            <p className="text-white/90 text-xs line-clamp-1 drop-shadow-md">{style.description}</p>
                                        </div>
                                    </div>

                                    {/* Selected Indicator */}
                                    {selectedStyle === style.id && (
                                        <div className="absolute top-2 right-2 bg-purple-600 rounded-full p-1 z-20">
                                            <Sparkles className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Dropdown Selector (Alternative) */}
                        <Select value={selectedStyle} onValueChange={setSelectedStyle} disabled={converting}>
                            <SelectTrigger className="w-full bg-white/5 border-white/10">
                                <SelectValue placeholder="Or choose from dropdown" />
                            </SelectTrigger>
                            <SelectContent>
                                {artStyles.map((style) => (
                                    <SelectItem key={style.id} value={style.id}>
                                        <div>
                                            <div className="font-medium">{style.name}</div>
                                            <div className="text-xs text-gray-400">{style.description}</div>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {selectedStyle && (
                            <div className="mt-4 p-3 bg-purple-600/10 border border-purple-600/20 rounded-lg">
                                <p className="text-sm text-purple-300">
                                    ✨ {artStyles.find(s => s.id === selectedStyle)?.description}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Strength Control */}
                    {selectedStyle && (
                        <div className="glass-card p-6">
                            <Label className="text-white mb-4 block">Conversion Strength: {strength[0]}%</Label>
                            <Slider
                                value={strength}
                                onValueChange={setStrength}
                                min={0}
                                max={100}
                                step={5}
                                disabled={converting}
                                className="mt-2"
                            />
                            <p className="text-xs text-gray-400 mt-2">
                                Higher values create stronger transformations
                            </p>
                        </div>
                    )}

                    {/* Convert Button */}
                    <div className="glass-card p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            3. Convert
                        </h3>
                        <Button
                            onClick={handleConvert}
                            disabled={!selectedImage || !selectedStyle || converting}
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-12 text-lg font-bold"
                        >
                            {converting ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Converting...
                                </>
                            ) : (
                                <>
                                    <Wand2 className="w-5 h-5 mr-2" />
                                    Transform with AI
                                </>
                            )}
                        </Button>

                        {converting && (
                            <div className="mt-4">
                                <div className="flex justify-between text-sm text-gray-400 mb-2">
                                    <span>Processing...</span>
                                    <span>{progress}%</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                            </div>
                        )}
                    </div>

                    {/* Download Section */}
                    {convertedImage && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-card p-6"
                        >
                            <h3 className="text-lg font-semibold text-white mb-4">
                                4. Download
                            </h3>
                            <Button
                                onClick={handleDownload}
                                className="w-full bg-blue-600 hover:bg-blue-700"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download Result
                            </Button>
                        </motion.div>
                    )}

                    {/* Info */}
                    <div className="glass-card p-6 bg-gradient-to-br from-purple-600/10 to-pink-600/10 border border-white/10">
                        <h3 className="text-sm font-semibold text-white mb-2">💡 Tips</h3>
                        <ul className="text-xs text-gray-400 space-y-2">
                            <li>• Use high-quality images for best results</li>
                            <li>• Processing time: 30-60 seconds</li>
                            <li>• Works best with portraits and landscapes</li>
                            <li>• Try different styles for variety</li>
                        </ul>
                    </div>
                </motion.div>

                {/* Preview Area */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    {/* Original Image */}
                    <div className="glass-card p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-gray-400" />
                            Original Image
                        </h3>
                        <div className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-purple-900/20 to-black flex items-center justify-center">
                            {selectedImage ? (
                                <img
                                    src={selectedImage}
                                    alt="Original"
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <div className="text-center text-gray-500">
                                    <ImageIcon className="w-16 h-16 mx-auto mb-3 opacity-20" />
                                    <p>No image uploaded</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Converted Image */}
                    <div className="glass-card p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-purple-400" />
                            AI Converted
                        </h3>
                        <div className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-pink-900/20 to-black flex items-center justify-center relative">
                            {converting && (
                                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
                                    <div className="text-center">
                                        <Loader2 className="w-16 h-16 animate-spin text-purple-400 mx-auto mb-4" />
                                        <p className="text-white font-medium">Converting your image...</p>
                                        <p className="text-sm text-gray-400 mt-2">This may take a moment</p>
                                    </div>
                                </div>
                            )}
                            {convertedImage ? (
                                <img
                                    src={convertedImage}
                                    alt="Converted"
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <div className="text-center text-gray-500">
                                    <Wand2 className="w-16 h-16 mx-auto mb-3 opacity-20" />
                                    <p>Converted image will appear here</p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Example Styles Gallery */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-16"
            >
                <h2 className="text-3xl font-bold text-white text-center mb-8">
                    Available Art Styles
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {artStyles.map((style, idx) => (
                        <motion.div
                            key={style.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * idx }}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => setSelectedStyle(style.id)}
                            className={`glass-card p-4 cursor-pointer transition-all ${selectedStyle === style.id
                                ? 'ring-2 ring-purple-500'
                                : 'hover:bg-white/5'
                                }`}
                        >
                            <div className={`aspect-square rounded-lg bg-gradient-to-br ${style.gradient} mb-3 relative overflow-hidden`}>
                                {/* Preview Image */}
                                <img
                                    src={`/art-styles/${style.id}.png`}
                                    alt={style.name}
                                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                                    onError={(e) => {
                                        // Fallback to sparkles icon if image fails to load
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                                {/* Fallback Icon (hidden if image loads) */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Sparkles className="w-8 h-8 text-purple-400" />
                                </div>
                            </div>
                            <h4 className="font-semibold text-white text-sm">{style.name}</h4>
                            <p className="text-xs text-gray-400 mt-1">{style.description}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
