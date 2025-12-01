import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 animate-in fade-in duration-300">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-primary mb-6 transition-all duration-300">
            About AetherGallery
          </h1>
          
          <div className="space-y-6 text-lg text-foreground">
            <p className="leading-relaxed">
              Welcome to AetherGallery, where simplicity meets sophistication. We set out with a clear vision: 
              to create a gallery platform that's intuitive enough for anyone to use, yet powerful enough to 
              satisfy the demands of professional photographers, digital artists, and creative enthusiasts. 
              What started as a simple idea has evolved into a comprehensive visual content management system 
              that puts your creativity at the forefront.
            </p>

            <div className="bg-card border border-border rounded-lg p-6 transition-all duration-300 hover:shadow-lg">
              <h2 className="text-2xl font-semibold text-primary mb-4">Our Philosophy</h2>
              <p className="text-muted-foreground leading-relaxed">
                In a world cluttered with overly complex software, we believe that powerful tools don't have 
                to be complicated. AetherGallery strips away the unnecessary while preserving the essential. 
                Every feature has been thoughtfully designed to enhance your workflow without getting in your way. 
                Whether you're organizing family photos or curating a professional portfolio, our platform adapts 
                to your needs rather than forcing you to adapt to it.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 transition-all duration-300 hover:shadow-lg">
              <h2 className="text-2xl font-semibold text-primary mb-4">Advanced Features</h2>
              <div className="text-muted-foreground space-y-4">
                <p className="leading-relaxed">
                  <strong className="text-foreground">Cloud-Powered Storage:</strong> Built on Cloudinary's robust 
                  infrastructure, your images and videos are stored securely with lightning-fast delivery worldwide. 
                  Upload multiple files simultaneously, with support for various formats including high-resolution 
                  images and video content.
                </p>
                
                <p className="leading-relaxed">
                  <strong className="text-foreground">Professional Editing Suite:</strong> Transform your visuals with 
                  our comprehensive editing tools. Apply color grading adjustments including brightness, contrast, saturation, 
                  shadows, highlights, and vibrance. Choose from carefully crafted filter presets like Vivid, Vintage, 
                  and High Contrast. Use transformation tools for cropping, rotating, and precise adjustments. Express 
                  your creativity with the pen tool featuring customizable colors and thickness settings.
                </p>

                <p className="leading-relaxed">
                  <strong className="text-foreground">Immersive 3D Viewing:</strong> Experience your photos like never 
                  before with our innovative 3D image viewer. Powered by Three.js and React Three Fiber, this feature 
                  brings depth and dimension to your gallery, creating an engaging viewing experience that goes beyond 
                  traditional flat displays.
                </p>

                <p className="leading-relaxed">
                  <strong className="text-foreground">Smart Organization:</strong> Keep your collection organized with 
                  intuitive category management. Sort images into Nature, Adventure, Architecture, Old Snaps, Portrait, 
                  Lifestyle, and Creative categories. Filter and browse your collection effortlessly with our tab-based 
                  navigation system.
                </p>

                <p className="leading-relaxed">
                  <strong className="text-foreground">Creative Collages:</strong> Combine multiple images into stunning 
                  collages with various layout patterns. Choose from grid layouts, vertical splits, horizontal arrangements, 
                  and more to create compelling visual stories.
                </p>

                <p className="leading-relaxed">
                  <strong className="text-foreground">Seamless Experience:</strong> Enjoy smooth transitions and interactions 
                  throughout the application. Dark and light mode support ensures comfortable viewing in any environment. 
                  Responsive design guarantees a perfect experience on desktop, tablet, and mobile devices.
                </p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 transition-all duration-300 hover:shadow-lg">
              <h2 className="text-2xl font-semibold text-primary mb-4">Open Source & MIT Licensed</h2>
              <p className="text-muted-foreground leading-relaxed">
                AetherGallery is proudly open source and released under the MIT License. We believe in the power 
                of community-driven development and the freedom to modify, distribute, and use software without 
                restrictions. Whether you're a developer looking to contribute, a business wanting to customize 
                the platform for your needs, or an individual seeking to learn from our codebase, you're welcome 
                to use AetherGallery freely. The MIT License grants you permission to use, copy, modify, merge, 
                publish, distribute, sublicense, and sell copies of the software, subject only to including the 
                original copyright and permission notice. This commitment to open source reflects our dedication 
                to transparency, collaboration, and giving back to the developer community.
              </p>
            </div>

            <div className="pt-6 flex gap-4">
              <Button 
                onClick={() => navigate("/gallery")}
                className="transition-all duration-300 hover:scale-105"
              >
                Explore Gallery
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate("/upload")}
                className="transition-all duration-300 hover:scale-105"
              >
                Start Uploading
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
