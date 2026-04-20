"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Home, Search, Library, ListMusic, Heart, Plus, Upload, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreatePlaylistDialog } from "@/components/playlist/CreatePlaylistDialog";

const navItems = [
  { key: "home", href: "/", icon: Home },
  { key: "search", href: "/search", icon: Search },
  { key: "library", href: "/library", icon: Library },
  { key: "playlists", href: "/playlists", icon: ListMusic },
  { key: "likedSongs", href: "/library/songs", icon: Heart },
  { key: "upload", href: "/upload", icon: Upload },
  { key: "statistics", href: "/stats", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <aside className="fixed left-0 top-0 h-screen w-64 border-r border-white/5 bg-slate-950/80 p-6 backdrop-blur-xl">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
            {t("branding.tagline")}
          </p>
          <h1 className="mt-2 text-2xl font-bold text-white">AppMusic</h1>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 rounded-xl px-4 py-3 transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-400/20 via-fuchsia-500/10 to-transparent text-white shadow-inner"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{t(`nav.${item.key}`)}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-6">
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-300 to-fuchsia-400 text-slate-950 hover:opacity-95"
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("nav.createPlaylist")}
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
