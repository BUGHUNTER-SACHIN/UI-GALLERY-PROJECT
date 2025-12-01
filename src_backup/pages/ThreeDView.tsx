import { useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import { Layout } from "@/components/Layout";
import { getCloudinaryImages, CloudinaryImage } from "@/lib/cloudinary";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function ImagePlane({ imageUrl }: { imageUrl: string }) {
  const texture = useTexture(imageUrl);
  
  return (
    <mesh>
      <planeGeometry args={[5, 5]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

export default function ThreeDView() {
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    const imgs = await getCloudinaryImages();
    setImages(imgs);
    if (imgs.length > 0) {
      setSelectedImage(imgs[0].secure_url);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-8">3D Image Viewer</h1>
        
        <div className="mb-6">
          <Select value={selectedImage} onValueChange={setSelectedImage}>
            <SelectTrigger className="w-full max-w-md">
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

        {selectedImage ? (
          <div className="w-full h-[600px] bg-card rounded-lg border border-border">
            <Canvas camera={{ position: [0, 0, 8] }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <Suspense fallback={null}>
                <ImagePlane imageUrl={selectedImage} />
              </Suspense>
              <OrbitControls />
            </Canvas>
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            No images available. Upload some images first!
          </div>
        )}

        <p className="mt-4 text-sm text-muted-foreground text-center">
          Drag to rotate • Scroll to zoom • Right-click to pan
        </p>
      </div>
    </Layout>
  );
}
