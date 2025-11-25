import { Home, Search, FolderOpen, Upload, Image, Paintbrush, Box, Sliders, Sparkles, Music, Grid } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { Switch } from "./ui/switch";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Search, label: "Search", path: "/search" },
  { icon: FolderOpen, label: "Categories", path: "/categories" },
  { icon: Upload, label: "Upload", path: "/upload" },
  { icon: Image, label: "Preview Image", path: "/preview" },
  { icon: Paintbrush, label: "Editing Tools", path: "/edit" },
  { icon: Box, label: "View Image in 3D", path: "/3d-view" },
  { icon: Sliders, label: "Color Grading", path: "/color-grading" },
  { icon: Sparkles, label: "Basic Filters", path: "/filters" },
  { icon: Music, label: "Convert Image (AI)", path: "/convert" },
  { icon: Grid, label: "Collage Feature", path: "/collage" },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="flex-1 py-8 px-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-2",
                isActive 
                  ? "bg-sidebar-accent text-sidebar-primary" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-primary"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm font-medium text-sidebar-foreground flex items-center gap-2">
            <span className="text-lg">🌙</span>
            Light Mode
          </span>
          <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
        </div>
      </div>
    </aside>
  );
};
