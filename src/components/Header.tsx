import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";

export const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
            A
          </div>
          <span className="text-2xl font-bold text-foreground">AetherGallery</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <button onClick={() => navigate("/")} className="text-foreground hover:text-primary transition-colors">
            Home
          </button>
          <button onClick={() => navigate("/gallery")} className="text-foreground hover:text-primary transition-colors">
            Gallery
          </button>
          <button onClick={() => navigate("/about")} className="text-foreground hover:text-primary transition-colors">
            About
          </button>
          <button onClick={() => navigate("/contact")} className="text-foreground hover:text-primary transition-colors">
            Contact
          </button>
        </nav>

        {user ? (
          <Button onClick={logout} variant="default">
            Logout
          </Button>
        ) : (
          <Button onClick={() => navigate("/auth")} variant="default">
            Login
          </Button>
        )}
      </div>
    </header>
  );
};
