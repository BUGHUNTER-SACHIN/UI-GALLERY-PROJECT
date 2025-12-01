import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Index() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                        AetherGallery
                    </span>
                    <br />
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    Experience your digital art in a whole new dimension.
                    Upload, edit, and view in 3D with our next-gen platform.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="flex gap-4"
            >
                <Link to="/auth">
                    <button className="px-8 py-4 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform">
                        Get Started
                    </button>
                </Link>
                <Link to="/gallery">
                    <button className="px-8 py-4 bg-white/10 text-white rounded-full font-bold hover:bg-white/20 transition-colors backdrop-blur-md">
                        View Gallery
                    </button>
                </Link>
            </motion.div>
        </div>
    );
}
