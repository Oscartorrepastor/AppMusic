"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Library, ListMusic, Heart, Plus, Upload, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreatePlaylistDialog } from "@/components/playlist/CreatePlaylistDialog";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Search", href: "/search", icon: Search },
  { name: "Library", href: "/library", icon: Library },
  { name: "Playlists", href: "/playlists", icon: ListMusic },
  { name: "Liked Songs", href: "/library/songs", icon: Heart },
  { name: "Upload", href: "/upload", icon: Upload },
  { name: "Statistics", href: "/stats", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <>
      <aside className="fixed left-0 top-0 h-screen w-64 bg-black p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">AppMusic</h1>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 rounded-lg px-4 py-3 transition-colors ${
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-6">
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Playlist
          </Button>
        </div>
      </aside>
      <CreatePlaylistDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </>
  );
}
