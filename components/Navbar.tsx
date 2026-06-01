"use client";

import { useSession, signOut } from "next-auth/react";
import { LogOut, User } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="flex h-16 w-full items-center justify-between border-b bg-white px-6 shadow-sm">
      <div className="text-xl font-bold text-gray-900">VMS Portal</div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <User className="h-5 w-5 text-gray-500" />
          <span className="font-medium">{session?.user?.name || "User"}</span>
          <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
            {(session?.user as any)?.role || "Loading..."}
          </span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2 rounded-md bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>
    </nav>
  );
}