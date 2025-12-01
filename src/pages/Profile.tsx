import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Calendar, Image as ImageIcon, Heart, Wand2, Upload as UploadIcon, Camera } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getCloudinaryImages } from "@/lib/cloudinary";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export default function Profile() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalImages: 0,
        favorites: 0,
        uploads: 0,
        conversions: 0
    });
    const [recentActivity, setRecentActivity] = useState<any[]>([]);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        const images = await getCloudinaryImages();
        setStats({
            totalImages: images.length,
            favorites: images.filter(img => img.isFavorite).length,
            uploads: images.length,
            conversions: parseInt(localStorage.getItem('ai_conversions') || '0')
        });

        // Mock recent activity
        const activity = images.slice(0, 5).map(img => ({
            type: 'upload',
            title: `Uploaded ${img.public_id}`,
            time: new Date(img.created_at).toLocaleDateString(),
            icon: UploadIcon
        }));
        setRecentActivity(activity);
    };

    const handleAvatarUpload = () => {
        toast.info("Avatar upload coming soon!");
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
                    Your Profile
                </h1>
                <p className="text-xl text-gray-400">Manage your account and view your activity</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-1"
                >
                    <div className="glass-card p-8 text-center">
                        <div className="relative inline-block mb-6">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-4xl font-bold">
                                {user?.email?.[0].toUpperCase() || 'U'}
                            </div>
                            <button
                                onClick={handleAvatarUpload}
                                className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 rounded-full p-2 transition-colors"
                            >
                                <Camera className="w-5 h-5 text-white" />
                            </button>
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-2">
                            {user?.displayName || 'User'}
                        </h2>
                        <p className="text-gray-400 mb-6 flex items-center justify-center gap-2">
                            <Mail className="w-4 h-4" />
                            {user?.email}
                        </p>

                        <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-6">
                            <Calendar className="w-4 h-4" />
                            <span>Member since {new Date(user?.metadata?.creationTime || Date.now()).toLocaleDateString()}</span>
                        </div>

                        <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                            Edit Profile
                        </Button>
                    </div>
                </motion.div>

                {/* Stats and Activity */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 space-y-6"
                >
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="glass-card p-6 text-center">
                            <ImageIcon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                            <div className="text-3xl font-bold text-white mb-1">{stats.totalImages}</div>
                            <div className="text-sm text-gray-400">Total Images</div>
                        </div>
                        <div className="glass-card p-6 text-center">
                            <Heart className="w-8 h-8 text-pink-400 mx-auto mb-3" />
                            <div className="text-3xl font-bold text-white mb-1">{stats.favorites}</div>
                            <div className="text-sm text-gray-400">Favorites</div>
                        </div>
                        <div className="glass-card p-6 text-center">
                            <UploadIcon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                            <div className="text-3xl font-bold text-white mb-1">{stats.uploads}</div>
                            <div className="text-sm text-gray-400">Uploads</div>
                        </div>
                        <div className="glass-card p-6 text-center">
                            <Wand2 className="w-8 h-8 text-green-400 mx-auto mb-3" />
                            <div className="text-3xl font-bold text-white mb-1">{stats.conversions}</div>
                            <div className="text-sm text-gray-400">AI Conversions</div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="glass-card p-6">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Recent Activity
                        </h3>
                        <div className="space-y-4">
                            {recentActivity.length > 0 ? (
                                recentActivity.map((activity, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="flex items-center gap-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center">
                                            <activity.icon className="w-5 h-5 text-purple-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white font-medium">{activity.title}</p>
                                            <p className="text-sm text-gray-400">{activity.time}</p>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <p className="text-gray-400 text-center py-8">No recent activity</p>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="glass-card p-6">
                        <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Button
                                variant="outline"
                                className="justify-start h-auto py-4"
                                onClick={() => window.location.href = '/upload'}
                            >
                                <UploadIcon className="w-5 h-5 mr-3" />
                                <div className="text-left">
                                    <div className="font-semibold">Upload Images</div>
                                    <div className="text-xs text-gray-400">Add new photos to your collection</div>
                                </div>
                            </Button>
                            <Button
                                variant="outline"
                                className="justify-start h-auto py-4"
                                onClick={() => window.location.href = '/ai-converter'}
                            >
                                <Wand2 className="w-5 h-5 mr-3" />
                                <div className="text-left">
                                    <div className="font-semibold">AI Converter</div>
                                    <div className="text-xs text-gray-400">Transform images with AI</div>
                                </div>
                            </Button>
                            <Button
                                variant="outline"
                                className="justify-start h-auto py-4"
                                onClick={() => window.location.href = '/gallery'}
                            >
                                <ImageIcon className="w-5 h-5 mr-3" />
                                <div className="text-left">
                                    <div className="font-semibold">View Gallery</div>
                                    <div className="text-xs text-gray-400">Browse your collection</div>
                                </div>
                            </Button>
                            <Button
                                variant="outline"
                                className="justify-start h-auto py-4"
                                onClick={() => window.location.href = '/settings'}
                            >
                                <User className="w-5 h-5 mr-3" />
                                <div className="text-left">
                                    <div className="font-semibold">Settings</div>
                                    <div className="text-xs text-gray-400">Manage your preferences</div>
                                </div>
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
