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
        <div className="relative h-screen bg-gradient-to-b from-gray-900 to-black">
          <Sidebar />
          <div className="ml-64 flex h-full flex-col">
            <TopBar />
            <main className="flex-1 overflow-y-auto pt-16 pb-24 px-8">
              {children}
            </main>
          </div>
          <PlayerBar />
        </div>
      </PlayerProvider>
    </SessionProvider>
  );
}
