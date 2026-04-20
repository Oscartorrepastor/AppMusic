"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Search, User } from "lucide-react";

export function TopBar() {
  const router = useRouter();
  const { data: session } = useSession();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="fixed left-64 right-0 top-0 z-10 px-6 py-4">
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-black/35 px-4 py-3 shadow-[0_18px_45px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <form onSubmit={handleSearch} className="max-w-md flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder={t("topbar.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-white/10 bg-white/5 pl-10 text-white placeholder:text-gray-400 focus-visible:ring-cyan-300"
            />
          </div>
        </form>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center space-x-2 rounded-full border border-white/10 bg-black/40 hover:bg-black/60"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-br from-cyan-300 to-fuchsia-400 text-xs font-semibold text-slate-950">
                    {session?.user?.name
                      ? getUserInitials(session.user.name)
                      : "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-white">
                  {session?.user?.name || t("topbar.userFallback")}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 rounded-xl border border-white/10 bg-gray-900/95 backdrop-blur-xl"
            >
              <DropdownMenuLabel className="text-gray-200">
                {session?.user?.email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-800" />
              <DropdownMenuItem className="text-gray-300 focus:bg-gray-800 focus:text-white">
                <User className="mr-2 h-4 w-4" />
                <span>{t("topbar.profile")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-gray-300 focus:bg-gray-800 focus:text-white"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t("topbar.logout")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
