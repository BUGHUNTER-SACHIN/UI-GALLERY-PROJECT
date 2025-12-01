import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";

export const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const getUserDisplayName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split("@")[0];
    return "User";
  };

  const getUserInitials = () => {
    if (user?.displayName) {
      return user.displayName
        .split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

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
          <button onClick={() => navigate("/")} className="text-foreground hover:text-primary transition-all duration-300 hover:scale-105">
            Home
          </button>
          <button onClick={() => navigate("/gallery")} className="text-foreground hover:text-primary transition-all duration-300 hover:scale-105">
            Gallery
          </button>
          <button onClick={() => navigate("/about")} className="text-foreground hover:text-primary transition-all duration-300 hover:scale-105">
            About
          </button>
          <button onClick={() => navigate("/contact")} className="text-foreground hover:text-primary transition-all duration-300 hover:scale-105">
            Contact
          </button>
        </nav>

        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground hidden sm:block">
                {getUserDisplayName()}
              </span>
            </div>
            <Button onClick={logout} variant="default" className="transition-all duration-300 hover:scale-105">
              Logout
            </Button>
          </div>
        ) : (
          <Button onClick={() => navigate("/auth")} variant="default" className="transition-all duration-300 hover:scale-105">
            Login
          </Button>
        )}
      </div>
    </header>
  );
};
