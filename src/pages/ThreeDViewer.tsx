import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei";
import { motion } from "framer-motion";
import { RotateCcw, Upload as UploadIcon, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import * as THREE from "three";
import { getCloudinaryImages, type CloudinaryImage } from "@/lib/cloudinary";
import { toast } from "sonner";

// 3D Models with texture support
function TexturedBox({ textureUrl, ...props }: any) {
    const meshRef = useRef<THREE.Mesh>(null!);
    const [hovered, setHovered] = useState(false);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.5;
            meshRef.current.rotation.y += delta * 0.2;
        }
    });

    // Load texture if provided - handle array return type
    const loadedTexture = textureUrl ? useLoader(THREE.TextureLoader, textureUrl) : null;
    const texture = loadedTexture && Array.isArray(loadedTexture) ? loadedTexture[0] : loadedTexture;

    useEffect(() => {
        if (texture && !Array.isArray(texture)) {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
        }
    }, [texture]);

    return (
        <mesh
            {...props}
            ref={meshRef}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            <boxGeometry args={[2, 2, 2]} />
            {texture ? (
                <meshStandardMaterial map={texture as THREE.Texture} />
            ) : (
                <meshStandardMaterial color={hovered ? '#a855f7' : '#ec4899'} />
            )}
        </mesh>
    );
}

function TexturedSphere({ textureUrl, ...props }: any) {
    const loadedTexture = textureUrl ? useLoader(THREE.TextureLoader, textureUrl) : null;
    const texture = loadedTexture && Array.isArray(loadedTexture) ? loadedTexture[0] : loadedTexture;

    useEffect(() => {
        if (texture && !Array.isArray(texture)) {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
        }
    }, [texture]);

    return (
        <mesh {...props}>
            <sphereGeometry args={[1, 32, 32]} />
            {texture ? (
                <meshStandardMaterial map={texture as THREE.Texture} />
            ) : (
                <meshStandardMaterial color="#8b5cf6" metalness={0.5} roughness={0.2} />
            )}
        </mesh>
    );
}

function TexturedTorus({ textureUrl, ...props }: any) {
    const meshRef = useRef<THREE.Mesh>(null!);
    const loadedTexture = textureUrl ? useLoader(THREE.TextureLoader, textureUrl) : null;
    const texture = loadedTexture && Array.isArray(loadedTexture) ? loadedTexture[0] : loadedTexture;

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.3;
            meshRef.current.rotation.z += delta * 0.5;
        }
    });

    useEffect(() => {
        if (texture && !Array.isArray(texture)) {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(2, 1);
        }
    }, [texture]);

    return (
        <mesh {...props} ref={meshRef}>
            <torusGeometry args={[1.5, 0.5, 16, 100]} />
            {texture ? (
                <meshStandardMaterial map={texture as THREE.Texture} />
            ) : (
                <meshStandardMaterial color="#ec4899" />
            )}
        </mesh>
    );
}

export default function ThreeDViewer() {
    const [selectedModel, setSelectedModel] = useState<'box' | 'sphere' | 'torus'>('box');
    const [autoRotate, setAutoRotate] = useState(true);
    const [textureUrl, setTextureUrl] = useState<string | null>(null);
    const [galleryImages, setGalleryImages] = useState<CloudinaryImage[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadGalleryImages();
    }, []);

    const loadGalleryImages = async () => {
        const images = await getCloudinaryImages();
        setGalleryImages(images);
    };

    const models = [
        { id: 'box', name: 'Cube', component: TexturedBox },
        { id: 'sphere', name: 'Sphere', component: TexturedSphere },
        { id: 'torus', name: 'Torus', component: TexturedTorus },
    ];

    const ModelComponent = models.find(m => m.id === selectedModel)?.component || TexturedBox;

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            setTextureUrl(event.target?.result as string);
            toast.success("Texture applied to 3D model!");
        };
        reader.readAsDataURL(file);
    };

    const handleGallerySelect = (imageUrl: string) => {
        setTextureUrl(imageUrl);
        toast.success("Texture applied to 3D model!");
    };

    const clearTexture = () => {
        setTextureUrl(null);
        toast.info("Texture removed");
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-7xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
                    3D Viewer
                </h1>
                <p className="text-xl text-gray-400">
                    Apply your images as textures on 3D models
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Control Panel */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card p-6 space-y-6 lg:col-span-1"
                >
                    {/* Model Selection */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Select Model</h3>
                        <div className="space-y-2">
                            {models.map(model => (
                                <button
                                    key={model.id}
                                    onClick={() => setSelectedModel(model.id as any)}
                                    className={`w-full p-3 rounded-lg text-left transition-all ${selectedModel === model.id
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    {model.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Texture Upload */}
                    <div className="pt-6 border-t border-white/10">
                        <h3 className="text-lg font-semibold text-white mb-4">Apply Texture</h3>
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

                        {textureUrl && (
                            <Button
                                onClick={clearTexture}
                                variant="outline"
                                className="w-full mt-2"
                            >
                                Remove Texture
                            </Button>
                        )}
                    </div>

                    {/* Gallery Images */}
                    {galleryImages.length > 0 && (
                        <div className="pt-6 border-t border-white/10">
                            <Label className="text-gray-400 mb-3 block">Or select from gallery:</Label>
                            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                                {galleryImages.slice(0, 12).map((img) => (
                                    <button
                                        key={img.public_id}
                                        onClick={() => handleGallerySelect(img.secure_url)}
                                        className={`aspect-square rounded-lg overflow-hidden transition-all ${textureUrl === img.secure_url
                                                ? 'ring-2 ring-purple-500'
                                                : 'hover:ring-2 hover:ring-purple-400'
                                            }`}
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

                    {/* Controls Info */}
                    <div className="pt-6 border-t border-white/10">
                        <h3 className="text-lg font-semibold text-white mb-4">Controls</h3>
                        <div className="space-y-3 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                                <span>Left Click: Rotate</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-pink-400"></div>
                                <span>Right Click: Pan</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                <span>Scroll: Zoom</span>
                            </div>
                        </div>
                    </div>

                    {/* Auto Rotate */}
                    <div className="pt-6 border-t border-white/10">
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setAutoRotate(!autoRotate)}
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            {autoRotate ? 'Stop' : 'Start'} Auto-Rotate
                        </Button>
                    </div>
                </motion.div>

                {/* 3D Canvas */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-3 glass-card p-2 overflow-hidden"
                >
                    <div className="relative w-full aspect-video md:aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20">
                        <Canvas shadows>
                            <PerspectiveCamera makeDefault position={[0, 0, 8]} />
                            <ambientLight intensity={0.5} />
                            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow />
                            <pointLight position={[-10, -10, -10]} intensity={0.5} />

                            <Suspense fallback={null}>
                                <ModelComponent position={[0, 0, 0]} textureUrl={textureUrl} />
                                <Environment preset="sunset" />
                            </Suspense>

                            <OrbitControls
                                enablePan={true}
                                enableZoom={true}
                                enableRotate={true}
                                autoRotate={autoRotate}
                                autoRotateSpeed={2}
                            />
                        </Canvas>

                        {/* Texture Indicator */}
                        {textureUrl && (
                            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-2 rounded-lg flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-green-400" />
                                <span className="text-sm text-white">Texture Applied</span>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 p-4 bg-white/5 rounded-lg">
                        <h3 className="text-white font-semibold mb-2">About This Model</h3>
                        <p className="text-gray-400 text-sm">
                            Currently viewing: <span className="text-purple-400">
                                {models.find(m => m.id === selectedModel)?.name}
                            </span>
                            {textureUrl && (
                                <span className="ml-2 text-green-400">with custom texture</span>
                            )}
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                            Upload an image or select from your gallery to apply it as a texture on the 3D model.
                            Use your mouse to interact with the model.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
