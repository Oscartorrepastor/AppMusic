"use client";

import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, User } from "lucide-react";

export function TopBar() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/login");
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
    <header className="fixed left-64 right-0 top-0 z-10 bg-gradient-to-b from-gray-900 to-transparent px-8 py-4">
      <div className="flex items-center justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 rounded-full bg-black/40 hover:bg-black/60"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-green-600 text-xs text-white">
                  {session?.user?.name
                    ? getUserInitials(session.user.name)
                    : "U"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-white">
                {session?.user?.name || "User"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-gray-800">
            <DropdownMenuLabel className="text-gray-200">
              {session?.user?.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-800" />
            <DropdownMenuItem className="text-gray-300 focus:bg-gray-800 focus:text-white">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-gray-300 focus:bg-gray-800 focus:text-white"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
