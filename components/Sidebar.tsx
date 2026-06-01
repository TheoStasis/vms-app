"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { LayoutDashboard, Users, ShieldCheck, ClipboardList, Settings, UserCheck } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["Admin", "Receptionist", "Security", "Host", "Auditor"] },
    // We added the Host link right here:
    { name: "My Visitors", href: "/dashboard/host", icon: UserCheck, roles: ["Admin", "Host"] },
    { name: "Reception", href: "/dashboard/reception", icon: Users, roles: ["Admin", "Receptionist"] },
    { name: "Gate Check", href: "/dashboard/security", icon: ShieldCheck, roles: ["Admin", "Security"] },
    { name: "Reports", href: "/dashboard/reports", icon: ClipboardList, roles: ["Admin", "Auditor"] },
    { name: "Admin Settings", href: "/dashboard/admin", icon: Settings, roles: ["Admin"] },
  ];

  const allowedLinks = navLinks.filter((link) => link.roles.includes(role));

  return (
    <aside className="h-[calc(100vh-4rem)] w-72 shrink-0 border-r border-slate-200 bg-slate-50/80 p-4 backdrop-blur">
      <div className="mb-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Current Role</p>
        <p className="mt-1 text-sm font-semibold text-slate-900">{role || "Member"}</p>
      </div>
      <nav className="flex flex-col gap-2">
        {allowedLinks.map((link) => {
          const Icon = link.icon;
          // Exact match for dashboard, or starts with for sub-pages
          const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
          
          return (
            <Link 
              key={link.name} 
              href={link.href} 
              className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200 ${isActive ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20" : "text-slate-600 hover:-translate-y-0.5 hover:bg-white hover:text-slate-900 hover:shadow-sm"}`}
            >
              <Icon className="h-5 w-5" /> {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}