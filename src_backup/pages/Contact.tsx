import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent successfully! We'll get back to you soon.");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 animate-in fade-in duration-300">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-primary mb-6 transition-all duration-300">
            Get in Touch
          </h1>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Have questions, suggestions, or just want to say hello? We're all ears! Whether you're
                experiencing technical issues, have feature requests, or simply want to share your
                AetherGallery creations with us, we'd love to hear from you.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Drop us a message using the form, and our team will get back to you as soon as possible.
                We typically respond within 24 hours on business days. Your feedback helps us make
                AetherGallery better for everyone!
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-4 p-6 bg-card border border-border rounded-lg transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
                  <Mail className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Email Us</h3>
                    <a
                      href="mailto:support.aethergallery@gmail.com"
                      className="text-primary hover:underline break-all"
                    >
                      aethergallery021@gmail.com
                    </a>
                    <p className="text-sm text-muted-foreground mt-2">
                      Direct support for all your queries
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-card border border-border rounded-lg transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
                  <Phone className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Call Us</h3>
                    <a
                      href="tel:+919044247819"
                      className="text-primary hover:underline"
                    >
                      +91 9044247819
                    </a>
                    <p className="text-sm text-muted-foreground mt-2">
                      Available for urgent support
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-card border border-border rounded-lg transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
                  <MapPin className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Visit Us</h3>
                    <p className="text-foreground">
                      Mumbai, Maharashtra, India
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Our creative hub location
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 bg-card border border-border rounded-lg p-8 shadow-lg">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-foreground mb-2">Send us a Message</h2>
                <p className="text-sm text-muted-foreground">
                  Fill out the form below and we'll reach back to you ASAP!
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Your Name *
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="transition-all duration-200 focus:scale-[1.01]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address *
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  required
                  className="transition-all duration-200 focus:scale-[1.01]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Your Message *
                </label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what's on your mind... We're here to help!"
                  required
                  rows={6}
                  className="transition-all duration-200 focus:scale-[1.01] resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full transition-all duration-300 hover:scale-[1.02] text-base py-6"
              >
                Send Message
              </Button>

              <p className="text-xs text-center text-muted-foreground mt-4">
                * Required fields. We respect your privacy and never share your information.
              </p>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
