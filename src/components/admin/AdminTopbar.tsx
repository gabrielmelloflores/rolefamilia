"use client";

import { signOut, useSession } from "next-auth/react";
import { Menu, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminTopbarProps {
  onMenuClick: () => void;
  title: string;
}

export function AdminTopbar({ onMenuClick, title }: AdminTopbarProps) {
  const { data: session } = useSession();

  return (
    <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold text-stone-900">{title}</h1>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-stone-100 transition-colors">
          <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
            <User className="h-4 w-4 text-amber-600" />
          </div>
          <span className="hidden sm:block text-sm text-stone-700">
            {session?.user?.name ?? "Admin"}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() => signOut({ callbackUrl: "/entrar" })}
            className="text-red-600 cursor-pointer"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
