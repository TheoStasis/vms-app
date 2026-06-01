"use client";

import { useSession, signOut } from "next-auth/react";
import { LogOut, User } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 shadow-sm backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-sm font-semibold text-white shadow-sm">V</div>
        <div>
          <div className="text-base font-semibold tracking-tight text-slate-900">VMS Portal</div>
          <div className="text-xs text-slate-500">Visitor management suite</div>
        </div>
      </div>
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700 sm:flex">
          <User className="h-4 w-4 text-slate-500" />
          <span className="font-medium">{session?.user?.name || "User"}</span>
          <span className="badge badge-approved">
            {(session?.user as any)?.role || "Loading..."}
          </span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="button-secondary flex items-center gap-2 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>
    </nav>
  );
}