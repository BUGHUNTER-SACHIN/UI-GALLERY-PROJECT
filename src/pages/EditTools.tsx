import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/Layout";
import { getCloudinaryImages, CloudinaryImage } from "@/lib/cloudinary";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Crop, RotateCw, Pen, Palette, Sparkles, Grid3x3 } from "lucide-react";

type FilterPreset = {
  name: string;
  filter: string;
};

const filterPresets: FilterPreset[] = [
  { name: "None", filter: "" },
  { name: "Vivid", filter: "saturate(1.5) contrast(1.1)" },
  { name: "Black & White", filter: "grayscale(1)" },
  { name: "Dark", filter: "brightness(0.7) contrast(1.2)" },
  { name: "Lighten", filter: "brightness(1.3)" },
  { name: "Warm", filter: "sepia(0.3) saturate(1.3)" },
  { name: "Cool", filter: "hue-rotate(180deg) saturate(1.2)" },
  { name: "Vintage", filter: "sepia(0.5) contrast(0.9) brightness(1.1)" },
  { name: "High Contrast", filter: "contrast(1.5)" },
  { name: "Soft", filter: "contrast(0.8) brightness(1.1)" },
];

const collagePatterns = [
  { name: "Grid 2x2", images: 4, layout: "grid grid-cols-2 grid-rows-2" },
  { name: "Grid 3x1", images: 3, layout: "grid grid-cols-3" },
  { name: "Grid 2x3", images: 5, layout: "grid grid-cols-2 gap-2" },
  { name: "Vertical Split", images: 2, layout: "grid grid-cols-2" },
  { name: "Horizontal Split", images: 2, layout: "grid grid-rows-2" },
];

export default function EditTools() {
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Color Grading
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [shadows, setShadows] = useState(0);
  const [highlights, setHighlights] = useState(0);
  const [vibrance, setVibrance] = useState(0);
  
  // Transform
  const [rotation, setRotation] = useState(0);
  const [isCropping, setIsCropping] = useState(false);
  
  // Drawing
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState("#000000");
  const [drawThickness, setDrawThickness] = useState(2);
  const [drawingPaths, setDrawingPaths] = useState<any[]>([]);
  
  // Filters
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  
  // Collage
  const [collageImages, setCollageImages] = useState<string[]>([]);
  const [collagePattern, setCollagePattern] = useState(collagePatterns[0]);

  useEffect(() => {
    loadImages();
  }, []);

  useEffect(() => {
    if (selectedImage && canvasRef.current) {
      loadImageToCanvas();
    }
  }, [selectedImage]);

  const loadImages = async () => {
    const imgs = await getCloudinaryImages();
    setImages(imgs);
    if (imgs.length > 0) {
      setSelectedImage(imgs[0].secure_url);
    }
  };

  const loadImageToCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedImage) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    img.src = selectedImage;
  };

  const resetAll = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setShadows(0);
    setHighlights(0);
    setVibrance(0);
    setRotation(0);
    setSelectedFilter("");
    setDrawingPaths([]);
    toast.success("All settings reset");
  };

  const applyRotation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;
    
    tempCtx.putImageData(imgData, 0, 0);
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.drawImage(tempCanvas, -canvas.width / 2, -canvas.height / 2);
    ctx.restore();
    
    toast.success("Rotation applied");
  };

  const startCrop = () => {
    setIsCropping(true);
    toast.info("Click and drag to select crop area");
  };

  const enableDrawing = () => {
    const canvas = drawCanvasRef.current;
    if (!canvas || !selectedImage) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
      }
    };
    img.src = selectedImage;
  };

  const handleDrawStart = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = drawCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.strokeStyle = drawColor;
      ctx.lineWidth = drawThickness;
      ctx.lineCap = "round";
    }
  };

  const handleDrawMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = drawCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const handleDrawEnd = () => {
    setIsDrawing(false);
  };

  const clearDrawing = () => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    enableDrawing();
    toast.success("Drawing cleared");
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = canvas.toDataURL();
    link.click();
    toast.success("Image downloaded");
  };

  const addToCollage = (imageUrl: string) => {
    if (collageImages.length < collagePattern.images) {
      setCollageImages([...collageImages, imageUrl]);
      toast.success(`Added to collage (${collageImages.length + 1}/${collagePattern.images})`);
    } else {
      toast.error(`Maximum ${collagePattern.images} images for this pattern`);
    }
  };

  const removeFromCollage = (index: number) => {
    setCollageImages(collageImages.filter((_, i) => i !== index));
  };

  const getColorGradingFilter = () => {
    const shadowsFilter = shadows !== 0 ? `brightness(${1 + shadows / 100})` : "";
    const highlightsFilter = highlights !== 0 ? `contrast(${1 + highlights / 100})` : "";
    const vibranceFilter = vibrance !== 0 ? `saturate(${1 + vibrance / 100})` : "";
    
    return `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) ${shadowsFilter} ${highlightsFilter} ${vibranceFilter}`.trim();
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-8">Image Editing Studio</h1>
        
        <Tabs defaultValue="transform" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="transform" className="flex items-center gap-2">
              <Crop className="w-4 h-4" />
              Transform
            </TabsTrigger>
            <TabsTrigger value="draw" className="flex items-center gap-2">
              <Pen className="w-4 h-4" />
              Draw
            </TabsTrigger>
            <TabsTrigger value="color" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Color Grading
            </TabsTrigger>
            <TabsTrigger value="filters" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Filters
            </TabsTrigger>
            <TabsTrigger value="collage" className="flex items-center gap-2">
              <Grid3x3 className="w-4 h-4" />
              Collage
            </TabsTrigger>
          </TabsList>

          {/* Image Selection */}
          <div className="mt-6 mb-4">
            <Select value={selectedImage} onValueChange={setSelectedImage}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an image" />
              </SelectTrigger>
              <SelectContent>
                {images.map((img) => (
                  <SelectItem key={img.public_id} value={img.secure_url}>
                    {img.public_id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Transform Tab */}
          <TabsContent value="transform" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                {selectedImage && (
                  <div className="rounded-lg overflow-hidden border border-border">
                    <canvas ref={canvasRef} className="w-full" />
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Rotation: {rotation}°
                  </label>
                  <Slider
                    value={[rotation]}
                    onValueChange={(val) => setRotation(val[0])}
                    min={-180}
                    max={180}
                    step={1}
                  />
                  <Button onClick={applyRotation} className="w-full mt-4">
                    <RotateCw className="w-4 h-4 mr-2" />
                    Apply Rotation
                  </Button>
                </div>

                <div>
                  <Button onClick={startCrop} className="w-full">
                    <Crop className="w-4 h-4 mr-2" />
                    Crop Image
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Click and drag on the image to select crop area
                  </p>
                </div>

                <Button onClick={resetAll} variant="outline" className="w-full">
                  Reset All
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Draw Tab */}
          <TabsContent value="draw" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                {selectedImage && (
                  <div className="rounded-lg overflow-hidden border border-border">
                    <canvas
                      ref={drawCanvasRef}
                      className="w-full cursor-crosshair"
                      onMouseDown={handleDrawStart}
                      onMouseMove={handleDrawMove}
                      onMouseUp={handleDrawEnd}
                      onMouseLeave={handleDrawEnd}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Pen Color
                  </label>
                  <Input
                    type="color"
                    value={drawColor}
                    onChange={(e) => setDrawColor(e.target.value)}
                    className="w-full h-12"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Thickness: {drawThickness}px
                  </label>
                  <Slider
                    value={[drawThickness]}
                    onValueChange={(val) => setDrawThickness(val[0])}
                    min={1}
                    max={50}
                    step={1}
                  />
                </div>

                <Button onClick={enableDrawing} className="w-full">
                  <Pen className="w-4 h-4 mr-2" />
                  Enable Drawing
                </Button>

                <Button onClick={clearDrawing} variant="outline" className="w-full">
                  Clear Drawing
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Color Grading Tab */}
          <TabsContent value="color" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                {selectedImage && (
                  <div className="rounded-lg overflow-hidden border border-border">
                    <img
                      src={selectedImage}
                      alt="Preview"
                      style={{ filter: getColorGradingFilter() }}
                      className="w-full"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Brightness: {brightness}%
                  </label>
                  <Slider
                    value={[brightness]}
                    onValueChange={(val) => setBrightness(val[0])}
                    min={0}
                    max={200}
                    step={1}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Contrast: {contrast}%
                  </label>
                  <Slider
                    value={[contrast]}
                    onValueChange={(val) => setContrast(val[0])}
                    min={0}
                    max={200}
                    step={1}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Saturation: {saturation}%
                  </label>
                  <Slider
                    value={[saturation]}
                    onValueChange={(val) => setSaturation(val[0])}
                    min={0}
                    max={200}
                    step={1}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Shadows: {shadows}
                  </label>
                  <Slider
                    value={[shadows]}
                    onValueChange={(val) => setShadows(val[0])}
                    min={-100}
                    max={100}
                    step={1}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Highlights: {highlights}
                  </label>
                  <Slider
                    value={[highlights]}
                    onValueChange={(val) => setHighlights(val[0])}
                    min={-100}
                    max={100}
                    step={1}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Vibrance: {vibrance}
                  </label>
                  <Slider
                    value={[vibrance]}
                    onValueChange={(val) => setVibrance(val[0])}
                    min={-100}
                    max={100}
                    step={1}
                  />
                </div>

                <Button onClick={resetAll} variant="outline" className="w-full">
                  Reset Color Grading
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Filters Tab */}
          <TabsContent value="filters" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                {selectedImage && (
                  <div className="rounded-lg overflow-hidden border border-border">
                    <img
                      src={selectedImage}
                      alt="Preview"
                      style={{ filter: selectedFilter }}
                      className="w-full"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Filter Presets</h3>
                <div className="grid grid-cols-2 gap-3">
                  {filterPresets.map((preset) => (
                    <Button
                      key={preset.name}
                      onClick={() => setSelectedFilter(preset.filter)}
                      variant={selectedFilter === preset.filter ? "default" : "outline"}
                      className="w-full"
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Collage Tab */}
          <TabsContent value="collage" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Collage Preview ({collageImages.length}/{collagePattern.images})
                </h3>
                <div className={`${collagePattern.layout} gap-2 border border-border rounded-lg p-4 min-h-[400px]`}>
                  {collageImages.map((imgUrl, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={imgUrl}
                        alt={`Collage ${index + 1}`}
                        className="w-full h-full object-cover rounded"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeFromCollage(index)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  {Array.from({ length: collagePattern.images - collageImages.length }).map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      className="bg-muted rounded flex items-center justify-center text-muted-foreground"
                    >
                      Empty Slot
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Collage Pattern
                  </label>
                  <Select
                    value={collagePattern.name}
                    onValueChange={(value) => {
                      const pattern = collagePatterns.find((p) => p.name === value);
                      if (pattern) {
                        setCollagePattern(pattern);
                        setCollageImages([]);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {collagePatterns.map((pattern) => (
                        <SelectItem key={pattern.name} value={pattern.name}>
                          {pattern.name} ({pattern.images} images)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-foreground mb-2">Select Images</h3>
                  <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto">
                    {images.map((img) => (
                      <div
                        key={img.public_id}
                        className="relative cursor-pointer hover:opacity-75 transition-opacity"
                        onClick={() => addToCollage(img.secure_url)}
                      >
                        <img
                          src={img.secure_url}
                          alt={img.public_id}
                          className="w-full h-24 object-cover rounded border border-border"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => setCollageImages([])}
                  variant="outline"
                  className="w-full"
                >
                  Clear Collage
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex gap-4">
          <Button onClick={downloadImage} className="flex-1">
            Download Edited Image
          </Button>
          <Button onClick={resetAll} variant="outline" className="flex-1">
            Reset All Settings
          </Button>
        </div>
      </div>
    </Layout>
  );
}
