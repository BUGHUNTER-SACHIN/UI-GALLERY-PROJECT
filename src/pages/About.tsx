import { motion } from "framer-motion";
import { Sparkles, Image, Wand2, Box, Edit, Zap, Shield, Cloud } from "lucide-react";

export default function About() {
    const features = [
        {
            icon: Cloud,
            title: "Cloud Storage",
            description: "Securely store your images with Cloudinary integration"
        },
        {
            icon: Wand2,
            title: "AI Converter",
            description: "Transform photos into stunning artwork with AI"
        },
        {
            icon: Edit,
            title: "Advanced Editor",
            description: "Professional editing tools at your fingertips"
        },
        {
            icon: Box,
            title: "3D Viewer",
            description: "Interactive 3D model viewing and manipulation"
        },
        {
            icon: Shield,
            title: "Secure",
            description: "Firebase authentication keeps your data safe"
        },
        {
            icon: Zap,
            title: "Lightning Fast",
            description: "Built with React and modern web technologies"
        }
    ];

    const stats = [
        { label: "Active Users", value: "1000+" },
        { label: "Images Uploaded", value: "50K+" },
        { label: "AI Conversions", value: "10K+" },
        { label: "Happy Creators", value: "500+" }
    ];

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 mb-6">
                    About AetherGallery
                </h1>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                    A modern, feature-rich platform for creative professionals to store, edit, and transform their visual content using cutting-edge AI technology.
                </p>
            </motion.div>

            {/* Stats Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
            >
                {stats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        whileHover={{ scale: 1.05 }}
                        className="glass-card p-6 text-center"
                    >
                        <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
                            {stat.value}
                        </div>
                        <div className="text-sm text-gray-400">{stat.label}</div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Mission Statement */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-8 mb-16"
            >
                <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="w-8 h-8 text-purple-400" />
                    <h2 className="text-3xl font-bold text-white">Our Mission</h2>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed">
                    We believe creativity should be accessible to everyone. AetherGallery combines powerful cloud storage, professional editing tools, and AI-powered transformations into one seamless platform. Whether you're a photographer, designer, or digital artist, we provide the tools you need to bring your vision to life.
                </p>
            </motion.div>

            {/* Features Grid */}
            <div className="mb-16">
                <h2 className="text-4xl font-bold text-center text-white mb-12">
                    Powerful Features
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * idx }}
                            whileHover={{ y: -5 }}
                            className="glass-card p-6 border border-white/10"
                        >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-4">
                                <feature.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-400">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Tech Stack */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="glass-card p-8"
            >
                <h2 className="text-3xl font-bold text-white mb-6 text-center">
                    Built With Modern Technology
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {["React", "TypeScript", "Firebase", "Cloudinary", "Three.js", "Replicate AI", "Tailwind CSS", "Framer Motion"].map((tech, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ scale: 1.05 }}
                            className="bg-white/5 rounded-lg p-4 text-center text-gray-300 font-medium"
                        >
                            {tech}
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
