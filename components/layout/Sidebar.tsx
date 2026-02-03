"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Library, ListMusic, Heart } from "lucide-react";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Search", href: "/search", icon: Search },
  { name: "Library", href: "/library", icon: Library },
  { name: "Playlists", href: "/playlists", icon: ListMusic },
  { name: "Liked Songs", href: "/liked", icon: Heart },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
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
    </aside>
  );
}
