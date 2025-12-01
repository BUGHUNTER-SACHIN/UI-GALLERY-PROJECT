import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, Moon, Sun, Bell, Trash2, Save, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function Settings() {
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [notifications, setNotifications] = useState(true);
    const [autoRotate3D, setAutoRotate3D] = useState(true);
    const [defaultCategory, setDefaultCategory] = useState("nature");
    const [imageQuality, setImageQuality] = useState("high");

    useEffect(() => {
        // Load settings from localStorage
        const savedSettings = localStorage.getItem('settings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            setNotifications(settings.notifications ?? true);
            setAutoRotate3D(settings.autoRotate3D ?? true);
            setDefaultCategory(settings.defaultCategory || "nature");
            setImageQuality(settings.imageQuality || "high");
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('settings', JSON.stringify({
            notifications,
            autoRotate3D,
            defaultCategory,
            imageQuality
        }));
        toast.success("Settings saved successfully!");
    };

    const handleClearCache = () => {
        if (confirm("Are you sure you want to clear all cached data?")) {
            localStorage.removeItem('gallery_images');
            toast.success("Cache cleared successfully!");
        }
    };

    const handleDeleteAccount = () => {
        if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            toast.error("Account deletion requires admin approval. Contact support.");
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
                    Settings
                </h1>
                <p className="text-xl text-gray-400">Customize your experience</p>
            </motion.div>

            <div className="space-y-6">
                {/* Appearance */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6"
                >
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        {theme === "dark" ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
                        Appearance
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                            <div>
                                <Label className="text-white font-medium">Dark Mode</Label>
                                <p className="text-sm text-gray-400">Toggle between dark and light theme</p>
                            </div>
                            <Switch
                                checked={theme === "dark"}
                                onCheckedChange={toggleTheme}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Notifications */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6"
                >
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <Bell className="w-6 h-6" />
                        Notifications
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                            <div>
                                <Label className="text-white font-medium">Enable Notifications</Label>
                                <p className="text-sm text-gray-400">Receive updates about your uploads and conversions</p>
                            </div>
                            <Switch
                                checked={notifications}
                                onCheckedChange={setNotifications}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Preferences */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6"
                >
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <SettingsIcon className="w-6 h-6" />
                        Preferences
                    </h2>
                    <div className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-lg">
                            <Label className="text-white font-medium mb-2 block">Default Upload Category</Label>
                            <Select value={defaultCategory} onValueChange={setDefaultCategory}>
                                <SelectTrigger className="w-full bg-white/5 border-white/10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="nature">Nature</SelectItem>
                                    <SelectItem value="adventure">Adventure</SelectItem>
                                    <SelectItem value="architecture">Architecture</SelectItem>
                                    <SelectItem value="portrait">Portrait</SelectItem>
                                    <SelectItem value="lifestyle">Lifestyle</SelectItem>
                                    <SelectItem value="creative">Creative</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="p-4 bg-white/5 rounded-lg">
                            <Label className="text-white font-medium mb-2 block">Image Quality</Label>
                            <Select value={imageQuality} onValueChange={setImageQuality}>
                                <SelectTrigger className="w-full bg-white/5 border-white/10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low (Faster uploads)</SelectItem>
                                    <SelectItem value="medium">Medium (Balanced)</SelectItem>
                                    <SelectItem value="high">High (Best quality)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                            <div>
                                <Label className="text-white font-medium">Auto-Rotate 3D Models</Label>
                                <p className="text-sm text-gray-400">Automatically rotate 3D models in viewer</p>
                            </div>
                            <Switch
                                checked={autoRotate3D}
                                onCheckedChange={setAutoRotate3D}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Data & Storage */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-6"
                >
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <ImageIcon className="w-6 h-6" />
                        Data & Storage
                    </h2>
                    <div className="space-y-4">
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={handleClearCache}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Clear Cache
                        </Button>
                    </div>
                </motion.div>

                {/* Danger Zone */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card p-6 border-2 border-red-500/20"
                >
                    <h2 className="text-2xl font-bold text-red-500 mb-6">Danger Zone</h2>
                    <div className="space-y-4">
                        <div className="p-4 bg-red-500/10 rounded-lg">
                            <Label className="text-white font-medium mb-2 block">Delete Account</Label>
                            <p className="text-sm text-gray-400 mb-4">
                                Once you delete your account, there is no going back. Please be certain.
                            </p>
                            <Button
                                variant="destructive"
                                onClick={handleDeleteAccount}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Account
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Save Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex justify-end gap-4"
                >
                    <Button
                        onClick={handleSave}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}
