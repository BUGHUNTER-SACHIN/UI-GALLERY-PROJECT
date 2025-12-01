import { Home, Search, FolderOpen, Upload, Image, Paintbrush, Box, Sliders, Sparkles, Music, Grid } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { Switch } from "./ui/switch";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Image, label: "Gallery", path: "/gallery" },
  { icon: FolderOpen, label: "Categories", path: "/categories" },
  { icon: Upload, label: "Upload", path: "/upload" },
  { icon: Paintbrush, label: "Editing Tools", path: "/edit" },
  { icon: Box, label: "View Image in 3D", path: "/3d-view" },
  { icon: Sparkles, label: "NeoConvert", path: "/neoconvert" },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

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
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* User Info Section */}
      {user && (
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-sidebar-accent/30">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-sidebar-foreground truncate">
                {getUserDisplayName()}
              </p>
              <p className="text-xs text-sidebar-foreground/70 truncate">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 py-8 px-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 mb-2",
                isActive 
                  ? "bg-sidebar-accent text-sidebar-primary scale-105" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-primary hover:scale-105"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-300 hover:bg-sidebar-accent/30">
          <span className="text-sm font-medium text-sidebar-foreground flex items-center gap-2">
            <span className="text-lg transition-transform duration-300">{theme === "dark" ? "🌙" : "☀️"}</span>
            {theme === "dark" ? "Dark Mode" : "Light Mode"}
          </span>
          <Switch 
            checked={theme === "dark"} 
            onCheckedChange={toggleTheme}
            className="transition-all duration-300"
          />
        </div>
      </div>
    </aside>
  );
};
