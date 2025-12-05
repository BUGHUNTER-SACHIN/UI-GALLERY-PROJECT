import React from 'react';
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
export function MainLayout({ children }) {
  const { user } = useAuth();
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-purple-500/30" }, /* @__PURE__ */ React.createElement(Navbar, null), user && /* @__PURE__ */ React.createElement(Sidebar, null), /* @__PURE__ */ React.createElement("main", { className: `pt-24 pb-12 px-4 container mx-auto min-h-[calc(100vh-4rem)] ${user ? "ml-70" : ""}` }, children), /* @__PURE__ */ React.createElement(Toaster, null), /* @__PURE__ */ React.createElement(SonnerToaster, null));
}
