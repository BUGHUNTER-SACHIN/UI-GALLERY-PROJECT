import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function Layout({ children }) {
  return (
    <div className="w-full min-h-screen bg-[#0b0f17] text-white flex flex-col">

      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <div className="flex w-full flex-1 relative">

        {/* Sidebar LEFT */}
        <div className="hidden md:block relative z-10 flex-shrink-0">
          <Sidebar />
        </div>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto relative z-0">
          {children}
        </main>

      </div>
    </div>
  );
}
