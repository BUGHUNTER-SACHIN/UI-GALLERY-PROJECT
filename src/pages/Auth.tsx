import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { User, Lock, Mail, ArrowRight, Users, Plus, Trash2 } from "lucide-react";
import { AnimatedBackground } from "@/components/AnimatedBackground";

interface SavedAccount {
    email: string;
    lastUsed: number;
}

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showAccountSwitcher, setShowAccountSwitcher] = useState(false);
    const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>([]);
    const { signIn, signUp, user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Load saved accounts from localStorage
        const accounts = localStorage.getItem('saved_accounts');
        if (accounts) {
            setSavedAccounts(JSON.parse(accounts));
        }
    }, []);

    useEffect(() => {
        if (!authLoading && user) {
            navigate("/gallery");
        }
    }, [user, authLoading, navigate]);

    const saveAccount = (email: string) => {
        const newAccount: SavedAccount = {
            email,
            lastUsed: Date.now()
        };

        const existing = savedAccounts.filter(acc => acc.email !== email);
        const updated = [newAccount, ...existing].slice(0, 5); // Keep max 5 accounts

        setSavedAccounts(updated);
        localStorage.setItem('saved_accounts', JSON.stringify(updated));
    };

    const removeAccount = (email: string) => {
        const updated = savedAccounts.filter(acc => acc.email !== email);
        setSavedAccounts(updated);
        localStorage.setItem('saved_accounts', JSON.stringify(updated));
        toast.success("Account removed from list");
    };

    const selectAccount = (accountEmail: string) => {
        setEmail(accountEmail);
        setShowAccountSwitcher(false);
        toast.info(`Selected ${accountEmail}`);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                await signIn(email, password);
                saveAccount(email);
                toast.success("Logged in successfully!");
            } else {
                await signUp(email, password);
                saveAccount(email);
                toast.success("Account created successfully!");
            }
            navigate("/gallery");
        } catch (error: any) {
            toast.error(error.message || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <AnimatedBackground />
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            <AnimatedBackground />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo/Title */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 mb-2">
                        AetherGallery
                    </h1>
                    <p className="text-gray-400">Your creative cloud platform</p>
                </motion.div>

                {/* Main Auth Card */}
                <motion.div
                    layout
                    className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl"
                >
                    {/* Tabs */}
                    <div className="flex gap-2 mb-6 bg-white/5 p-1 rounded-xl">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-3 rounded-lg font-medium transition-all ${isLogin
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-3 rounded-lg font-medium transition-all ${!isLogin
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Account Switcher Button */}
                    {savedAccounts.length > 0 && (
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full mb-4 border-white/20 hover:bg-white/10"
                            onClick={() => setShowAccountSwitcher(!showAccountSwitcher)}
                        >
                            <Users className="w-4 h-4 mr-2" />
                            Switch Account ({savedAccounts.length})
                        </Button>
                    )}

                    {/* Saved Accounts List */}
                    <AnimatePresence>
                        {showAccountSwitcher && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-4 space-y-2 overflow-hidden"
                            >
                                {savedAccounts.map((account) => (
                                    <motion.div
                                        key={account.email}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex items-center gap-2 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
                                    >
                                        <button
                                            onClick={() => selectAccount(account.email)}
                                            className="flex-1 flex items-center gap-2 text-left"
                                        >
                                            <User className="w-4 h-4 text-purple-400" />
                                            <span className="text-sm text-white">{account.email}</span>
                                        </button>
                                        <button
                                            onClick={() => removeAccount(account.email)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/20 rounded"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-400" />
                                        </button>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                Email
                            </label>
                            <Input
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-purple-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                Password
                            </label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-purple-500"
                            />
                        </div>

                        {isLogin && (
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                                >
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-6 text-lg shadow-lg hover:shadow-purple-500/50 transition-all"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Processing...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    {isLogin ? 'Sign In' : 'Create Account'}
                                    <ArrowRight className="w-5 h-5" />
                                </div>
                            )}
                        </Button>
                    </form>

                    {/* Additional Info */}
                    <div className="mt-6 text-center text-sm text-gray-400">
                        {isLogin ? (
                            <p>
                                Don't have an account?{' '}
                                <button
                                    onClick={() => setIsLogin(false)}
                                    className="text-purple-400 hover:text-purple-300 font-medium"
                                >
                                    Sign up now
                                </button>
                            </p>
                        ) : (
                            <p>
                                Already have an account?{' '}
                                <button
                                    onClick={() => setIsLogin(true)}
                                    className="text-purple-400 hover:text-purple-300 font-medium"
                                >
                                    Sign in
                                </button>
                            </p>
                        )}
                    </div>
                </motion.div>

                {/* Features */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 grid grid-cols-3 gap-4 text-center"
                >
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
                        <div className="text-2xl mb-1">🎨</div>
                        <div className="text-xs text-gray-400">AI Art</div>
                    </div>
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
                        <div className="text-2xl mb-1">🖼️</div>
                        <div className="text-xs text-gray-400">Gallery</div>
                    </div>
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
                        <div className="text-2xl mb-1">🎭</div>
                        <div className="text-xs text-gray-400">3D View</div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
