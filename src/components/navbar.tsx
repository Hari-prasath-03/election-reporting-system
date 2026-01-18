"use client";

import { redirect } from "next/navigation";
import { toast } from "sonner";
import logoutAction from "@/actions/auth/logout-action";

import UserAvatar from "./ui/user-avatar";
import { Button } from "./ui/button";
import { LogOut, Menu } from "lucide-react";
import { User } from "@/types";
import Link from "next/link";
import hasPermission from "@/permissions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function Navbar({ user }: { user: User }) {
  const handleLogout = async () => {
    toast.success("Logged out successfully");
    await logoutAction();
    redirect("/login");
  };

  return (
    <nav className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/">
            <h1 className="text-xl font-bold truncate">TN Mandate Live</h1>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {hasPermission(user, "access:dashboard") && (
            <Link
              href="/dashboard"
              className="hover:text-primary transition-all duration-200"
            >
              Dashboard
            </Link>
          )}
          <UserAvatar user={user} size="md" />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="hover:bg-destructive/10 hover:text-destructive"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex md:hidden items-center gap-2">
          <UserAvatar user={user} size="sm" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {hasPermission(user, "access:dashboard") && (
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="w-full cursor-pointer">
                    Dashboard
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
