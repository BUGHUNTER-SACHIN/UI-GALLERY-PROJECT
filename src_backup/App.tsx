import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Gallery from "./pages/Gallery";
import Upload from "./pages/Upload";
import EditTools from "./pages/EditTools";
import ThreeDView from "./pages/ThreeDView";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Categories from "./pages/Categories";
import NotFound from "./pages/NotFound";
import NeoConvert from "./pages/NeoConvert";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/categories" element={<Categories />} />
              
              {/* Protected Routes - Require Authentication */}
              <Route 
                path="/gallery" 
                element={
                  <ProtectedRoute>
                    <Gallery />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/upload" 
                element={
                  <ProtectedRoute>
                    <Upload />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/edit" 
                element={
                  <ProtectedRoute>
                    <EditTools />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/3d-view" 
                element={
                  <ProtectedRoute>
                    <ThreeDView />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/neoconvert" 
                element={
                  <ProtectedRoute>
                    <NeoConvert />
                  </ProtectedRoute>
                } 
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;