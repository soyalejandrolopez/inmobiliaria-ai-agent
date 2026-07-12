"use client";

import { Menu } from "lucide-react";
import { useState } from "react";
import { Sidebar } from "./sidebar";

export function Header({ user }: { user: { name?: string | null; email?: string | null } }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-6 md:hidden">
      <span className="text-lg font-bold text-zinc-900">Propiedades AI</span>
      <button onClick={() => setOpen(!open)}>
        <Menu className="h-6 w-6 text-zinc-700" />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="p-4">
            <Sidebar user={user} />
          </div>
        </div>
      )}
    </header>
  );
}
