import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Image, Upload, Edit, Box, Palette, Sparkles } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: <Image className="w-8 h-8" />,
      title: "Cloud Gallery",
      description: "Store and organize your images and videos with Cloudinary's powerful infrastructure"
    },
    {
      icon: <Upload className="w-8 h-8" />,
      title: "Easy Upload",
      description: "Upload multiple files simultaneously with category organization"
    },
    {
      icon: <Edit className="w-8 h-8" />,
      title: "Professional Editing",
      description: "Transform your visuals with comprehensive editing tools and filters"
    },
    {
      icon: <Box className="w-8 h-8" />,
      title: "3D Viewing",
      description: "Experience your photos in immersive 3D with Three.js powered viewer"
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Smart Categories",
      description: "Organize your collection with intuitive category management"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Creative Tools",
      description: "Create stunning collages and express your creativity with advanced tools"
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 animate-in fade-in duration-300">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-4xl shadow-lg">
              A
            </div>
            <span className="text-6xl font-bold text-foreground">AetherGallery</span>
          </div>
          <p className="text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Where simplicity meets sophistication. Your visual content management system that puts creativity at the forefront.
          </p>
          <div className="flex gap-4 justify-center">
            {user ? (
              <>
                <Button 
                  size="lg"
                  onClick={() => navigate("/gallery")}
                  className="transition-all duration-300 hover:scale-105"
                >
                  View Gallery
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/upload")}
                  className="transition-all duration-300 hover:scale-105"
                >
                  Upload Images
                </Button>
              </>
            ) : (
              <>
                <Button 
                  size="lg"
                  onClick={() => navigate("/auth")}
                  className="transition-all duration-300 hover:scale-105"
                >
                  Get Started
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/about")}
                  className="transition-all duration-300 hover:scale-105"
                >
                  Learn More
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center text-foreground mb-12">
            Powerful Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-6 transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                <div className="text-primary mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join AetherGallery today and start organizing, editing, and showcasing your visual content like never before.
          </p>
          <div className="flex gap-4 justify-center">
            {user ? (
              <Button 
                size="lg"
                onClick={() => navigate("/upload")}
                className="transition-all duration-300 hover:scale-105"
              >
                Upload Your First Image
              </Button>
            ) : (
              <Button 
                size="lg"
                onClick={() => navigate("/auth")}
                className="transition-all duration-300 hover:scale-105"
              >
                Sign Up Now
              </Button>
            )}
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate("/about")}
              className="transition-all duration-300 hover:scale-105"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
