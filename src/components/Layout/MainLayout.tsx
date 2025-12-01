import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";

interface MainLayoutProps {
    children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-purple-500/30">
            <Navbar />
            {user && <Sidebar />}
            <main className={`pt-24 pb-12 px-4 container mx-auto min-h-[calc(100vh-4rem)] ${user ? 'ml-70' : ''}`}>
                {children}
            </main>
            <Toaster />
            <SonnerToaster />
        </div>
    );
}
