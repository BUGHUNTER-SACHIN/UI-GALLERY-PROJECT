import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload as UploadIcon, Download, RotateCw, FlipHorizontal, FlipVertical, Undo, Redo, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getCloudinaryImages } from "@/lib/cloudinary";
import type { CloudinaryImage } from "@/lib/cloudinary";

export default function ImageEditor() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [brightness, setBrightness] = useState([0]);
    const [contrast, setContrast] = useState([0]);
    const [saturation, setSaturation] = useState([0]);
    const [blur, setBlur] = useState([0]);
    const [hue, setHue] = useState([0]);
    const [rotation, setRotation] = useState(0);
    const [flipH, setFlipH] = useState(false);
    const [flipV, setFlipV] = useState(false);
    const [filter, setFilter] = useState('none');
    const [galleryImages, setGalleryImages] = useState<CloudinaryImage[]>([]);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const originalImageRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        loadGalleryImages();
    }, []);

    const loadGalleryImages = async () => {
        const images = await getCloudinaryImages();
        setGalleryImages(images);
    };

    useEffect(() => {
        if (selectedImage && canvasRef.current) {
            applyAllFilters();
        }
    }, [brightness, contrast, saturation, blur, hue, rotation, flipH, flipV, filter]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            setSelectedImage(event.target?.result as string);
            loadImage(event.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleGallerySelect = (imageUrl: string) => {
        setSelectedImage(imageUrl);
        loadImage(imageUrl);
    };

    const loadImage = (src: string) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            originalImageRef.current = img;
            if (canvasRef.current) {
                canvasRef.current.width = img.width;
                canvasRef.current.height = img.height;
                applyAllFilters();
            }
        };
        img.src = src;
    };

    const applyAllFilters = () => {
        if (!canvasRef.current || !originalImageRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = originalImageRef.current;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Apply transformations
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

        // Apply filters
        let filterString = `
            brightness(${100 + brightness[0]}%)
            contrast(${100 + contrast[0]}%)
            saturate(${100 + saturation[0]}%)
            blur(${blur[0]}px)
            hue-rotate(${hue[0]}deg)
        `.trim().replace(/\s+/g, ' ');

        // Preset filters
        if (filter === 'grayscale') filterString += ' grayscale(100%)';
        else if (filter === 'sepia') filterString += ' sepia(100%)';
        else if (filter === 'vintage') filterString += ' sepia(50%) contrast(110%)';
        else if (filter === 'cool') filterString += ' saturate(150%) hue-rotate(90deg)';
        else if (filter === 'warm') filterString += ' saturate(120%) sepia(30%)';

        ctx.filter = filterString;
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.restore();
    };

    const handleDownload = () => {
        if (!canvasRef.current) return;

        canvasRef.current.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `edited-image-${Date.now()}.png`;
            link.click();
            URL.revokeObjectURL(url);
            toast.success("Image downloaded successfully!");
        }, 'image/png');
    };

    const resetAll = () => {
        setBrightness([0]);
        setContrast([0]);
        setSaturation([0]);
        setBlur([0]);
        setHue([0]);
        setRotation(0);
        setFlipH(false);
        setFlipV(false);
        setFilter('none');
        toast.info("All adjustments reset");
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-7xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
                    Image Editor
                </h1>
                <p className="text-xl text-gray-400">
                    Professional editing tools for your images
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Editor Toolbar */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-1 space-y-6"
                >
                    {/* Upload Section */}
                    <div className="glass-card p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Load Image</h3>
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
                        >
                            <UploadIcon className="w-4 h-4 mr-2" />
                            Upload Image
                        </Button>

                        {/* Gallery Images */}
                        {galleryImages.length > 0 && (
                            <div className="mt-4">
                                <Label className="text-gray-400 mb-2 block">Or select from gallery:</Label>
                                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                                    {galleryImages.slice(0, 9).map((img) => (
                                        <button
                                            key={img.public_id}
                                            onClick={() => handleGallerySelect(img.secure_url)}
                                            className="aspect-square rounded-lg overflow-hidden hover:ring-2 hover:ring-purple-500 transition"
                                        >
                                            <img
                                                src={img.secure_url}
                                                alt={img.public_id}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Editing Tools */}
                    {selectedImage && (
                        <div className="glass-card p-6">
                            <Tabs defaultValue="adjust" className="w-full">
                                <TabsList className="w-full grid grid-cols-3">
                                    <TabsTrigger value="adjust">Adjust</TabsTrigger>
                                    <TabsTrigger value="filters">Filters</TabsTrigger>
                                    <TabsTrigger value="transform">Transform</TabsTrigger>
                                </TabsList>

                                <TabsContent value="adjust" className="space-y-6 mt-6">
                                    <div>
                                        <Label className="text-gray-400">Brightness: {brightness[0]}</Label>
                                        <Slider
                                            value={brightness}
                                            onValueChange={setBrightness}
                                            min={-100}
                                            max={100}
                                            step={1}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-gray-400">Contrast: {contrast[0]}</Label>
                                        <Slider
                                            value={contrast}
                                            onValueChange={setContrast}
                                            min={-100}
                                            max={100}
                                            step={1}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-gray-400">Saturation: {saturation[0]}</Label>
                                        <Slider
                                            value={saturation}
                                            onValueChange={setSaturation}
                                            min={-100}
                                            max={100}
                                            step={1}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-gray-400">Blur: {blur[0]}px</Label>
                                        <Slider
                                            value={blur}
                                            onValueChange={setBlur}
                                            min={0}
                                            max={20}
                                            step={1}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-gray-400">Hue: {hue[0]}°</Label>
                                        <Slider
                                            value={hue}
                                            onValueChange={setHue}
                                            min={0}
                                            max={360}
                                            step={1}
                                            className="mt-2"
                                        />
                                    </div>
                                </TabsContent>

                                <TabsContent value="filters" className="space-y-3 mt-6">
                                    {['none', 'grayscale', 'sepia', 'vintage', 'cool', 'warm'].map((f) => (
                                        <button
                                            key={f}
                                            onClick={() => setFilter(f)}
                                            className={`w-full p-3 rounded-lg text-left capitalize transition-all ${filter === f
                                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                                }`}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </TabsContent>

                                <TabsContent value="transform" className="space-y-4 mt-6">
                                    <Button
                                        onClick={() => setRotation((rotation - 90) % 360)}
                                        variant="outline"
                                        className="w-full"
                                    >
                                        <RotateCw className="w-4 h-4 mr-2" />
                                        Rotate Left
                                    </Button>
                                    <Button
                                        onClick={() => setRotation((rotation + 90) % 360)}
                                        variant="outline"
                                        className="w-full"
                                    >
                                        <RotateCw className="w-4 h-4 mr-2 transform scale-x-[-1]" />
                                        Rotate Right
                                    </Button>
                                    <Button
                                        onClick={() => setFlipH(!flipH)}
                                        variant="outline"
                                        className="w-full"
                                    >
                                        <FlipHorizontal className="w-4 h-4 mr-2" />
                                        Flip Horizontal
                                    </Button>
                                    <Button
                                        onClick={() => setFlipV(!flipV)}
                                        variant="outline"
                                        className="w-full"
                                    >
                                        <FlipVertical className="w-4 h-4 mr-2" />
                                        Flip Vertical
                                    </Button>
                                </TabsContent>
                            </Tabs>

                            <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                                <Button onClick={handleDownload} className="w-full bg-green-600 hover:bg-green-700">
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                </Button>
                                <Button onClick={resetAll} variant="ghost" className="w-full">
                                    <Undo className="w-4 h-4 mr-2" />
                                    Reset All
                                </Button>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Canvas Area */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 glass-card p-6"
                >
                    {selectedImage ? (
                        <div className="flex items-center justify-center min-h-[600px] bg-gradient-to-br from-purple-900/10 to-pink-900/10 rounded-lg">
                            <canvas
                                ref={canvasRef}
                                className="max-w-full max-h-[600px] object-contain rounded-lg shadow-2xl"
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center min-h-[600px] text-gray-400">
                            <ImageIcon className="w-24 h-24 mb-6 opacity-20" />
                            <p className="text-2xl font-medium">No image loaded</p>
                            <p className="text-sm mt-2">Upload an image or select from your gallery to start editing</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
