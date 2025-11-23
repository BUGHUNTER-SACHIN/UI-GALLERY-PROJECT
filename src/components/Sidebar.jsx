import React from "react";
import {
  HomeIcon,
  MagnifyingGlassIcon,
  FolderIcon,
  ArrowUpOnSquareIcon,
  PhotoIcon,
  WrenchScrewdriverIcon,
  CubeIcon,
  AdjustmentsHorizontalIcon,
  SparklesIcon,
  RectangleGroupIcon,
  Cog6ToothIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar() {
  const Item = ({ icon: Icon, label }) => (
    <div className="
      flex items-center gap-3 p-3 
      rounded-xl cursor-pointer 
      hover:bg-white/10 transition
    ">
      <Icon className="w-5 h-5 text-cyan-300" />
      <span className="text-gray-200 text-sm">{label}</span>
    </div>
  );

  return (
    <aside
      className="
        w-64 h-screen 
        bg-black/30 backdrop-blur-xl 
        border-r border-white/10 
        p-6 flex flex-col gap-4
        overflow-y-auto
      "
    >

      {/* MENU */}
      <div className="flex flex-col gap-2">
        <Item icon={HomeIcon} label="Home" />
        <Item icon={MagnifyingGlassIcon} label="Search" />
        <Item icon={FolderIcon} label="Categories" />
        <Item icon={ArrowUpOnSquareIcon} label="Upload" />
      </div>

      <div className="border-b border-white/10 my-2"></div>

      {/* TOOL SECTION */}
      <div className="flex flex-col gap-2">
        <Item icon={PhotoIcon} label="Preview Image" />
        <Item icon={WrenchScrewdriverIcon} label="Editing Tools" />
        <Item icon={CubeIcon} label="View Image in 3D" />
        <Item icon={AdjustmentsHorizontalIcon} label="Color Grading" />
        <Item icon={SparklesIcon} label="Basic Filters" />
        <Item icon={SparklesIcon} label="Convert Image (AI)" />
        <Item icon={RectangleGroupIcon} label="Collage Feature" />
      </div>

      <div className="border-b border-white/10 my-2"></div>

      {/* LIGHT MODE TOGGLE */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10">
        <div className="flex items-center gap-2">
          <MoonIcon className="w-5 h-5 text-cyan-300" />
          <span className="text-gray-200 text-sm">Light Mode</span>
        </div>
        <div className="w-10 h-5 bg-gray-600 rounded-full relative">
          <div className="w-5 h-5 bg-cyan-400 rounded-full absolute left-0 top-0"></div>
        </div>
      </div>

      <div className="border-b border-white/10 my-2"></div>

      {/* SETTINGS */}
      <div className="flex flex-col gap-2">
        <Item icon={Cog6ToothIcon} label="Settings" />
      </div>

    </aside>
  );
}
