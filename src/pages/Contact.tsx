import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, Github, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        // Simulate form submission
        setTimeout(() => {
            toast.success("Message sent successfully! We'll get back to you soon.");
            setFormData({ name: "", email: "", subject: "", message: "" });
            setSubmitting(false);
        }, 1000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-6">
                    Get In Touch
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    Have questions or feedback? We'd love to hear from you.
                </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12">
                {/* Contact Form */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-8"
                >
                    <h2 className="text-3xl font-bold text-white mb-6">Send a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <Label htmlFor="name" className="text-gray-400">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="mt-2 bg-white/5 border-white/10"
                                placeholder="Your name"
                            />
                        </div>
                        <div>
                            <Label htmlFor="email" className="text-gray-400">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="mt-2 bg-white/5 border-white/10"
                                placeholder="your@email.com"
                            />
                        </div>
                        <div>
                            <Label htmlFor="subject" className="text-gray-400">Subject</Label>
                            <Input
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                className="mt-2 bg-white/5 border-white/10"
                                placeholder="What's this about?"
                            />
                        </div>
                        <div>
                            <Label htmlFor="message" className="text-gray-400">Message</Label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows={5}
                                className="mt-2 w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Your message..."
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-6"
                        >
                            {submitting ? "Sending..." : (
                                <>
                                    <Send className="w-4 h-4 mr-2" />
                                    Send Message
                                </>
                            )}
                        </Button>
                    </form>
                </motion.div>

                {/* Contact Info */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-8"
                >
                    <div className="glass-card p-8">
                        <h2 className="text-3xl font-bold text-white mb-6">Contact Information</h2>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-lg bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white mb-1">Email</h3>
                                    <p className="text-gray-400">support@cloudcanvas.com</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-lg bg-pink-600/20 flex items-center justify-center flex-shrink-0">
                                    <Phone className="w-6 h-6 text-pink-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white mb-1">Phone</h3>
                                    <p className="text-gray-400">+91 98765 43210</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white mb-1">Location</h3>
                                    <p className="text-gray-400">Mumbai, Maharashtra, India</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-8">
                        <h3 className="text-2xl font-bold text-white mb-6">Follow Us</h3>
                        <div className="flex gap-4">
                            <motion.a
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                href="#"
                                className="w-12 h-12 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                            >
                                <Github className="w-6 h-6 text-gray-400" />
                            </motion.a>
                            <motion.a
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                href="#"
                                className="w-12 h-12 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                            >
                                <Twitter className="w-6 h-6 text-gray-400" />
                            </motion.a>
                            <motion.a
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                href="#"
                                className="w-12 h-12 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                            >
                                <Linkedin className="w-6 h-6 text-gray-400" />
                            </motion.a>
                        </div>
                    </div>


                </motion.div>
            </div>
        </div>
    );
}
