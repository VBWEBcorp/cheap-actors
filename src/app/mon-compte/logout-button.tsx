"use client";

import { LogOut } from "lucide-react";
import { logoutAction } from "./actions";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="inline-flex items-center gap-2 border border-ink/20 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition hover:border-flame hover:text-flame"
      >
        <LogOut className="h-3.5 w-3.5" />
        Déconnexion
      </button>
    </form>
  );
}
