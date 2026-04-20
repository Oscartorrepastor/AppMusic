"use client";

import { SessionProvider } from "next-auth/react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { PlayerBar } from "@/components/layout/PlayerBar";
import { PlayerProvider } from "@/lib/contexts/PlayerContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <PlayerProvider>
        <div className="relative h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(217,70,239,0.16),_transparent_24%),linear-gradient(to_bottom,_#0b1020,_#050814)]">
          <Sidebar />
          <div className="ml-64 flex h-full flex-col">
            <TopBar />
            <main className="flex-1 overflow-y-auto px-8 pb-24 pt-20">
              {children}
            </main>
          </div>
          <PlayerBar />
        </div>
      </PlayerProvider>
    </SessionProvider>
  );
}
