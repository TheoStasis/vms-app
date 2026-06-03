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
    <aside className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-3 py-2 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur md:px-4 lg:bottom-0 lg:left-0 lg:top-16 lg:h-[calc(100vh-4rem)] lg:w-72 lg:border-r lg:border-t-0 lg:bg-slate-50/80 lg:p-4 lg:shadow-none">
      <div className="mb-4 hidden rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm lg:block">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Current Role</p>
        <p className="mt-1 text-sm font-semibold text-slate-900">{role || "Member"}</p>
      </div>
      <nav className="flex flex-nowrap items-stretch gap-6 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden lg:flex-col lg:gap-2 lg:overflow-visible">
        {allowedLinks.map((link) => {
          const Icon = link.icon;
          // Exact match for dashboard, or starts with for sub-pages
          const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
          
          return (
            <Link 
              key={link.name} 
              href={link.href} 
              className={`flex w-auto flex-none items-center justify-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-[11px] font-semibold transition-all duration-200 sm:text-sm lg:flex-none lg:justify-start lg:gap-3 lg:px-3.5 lg:py-3 ${isActive ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 lg:hover:-translate-y-0.5 lg:hover:bg-white lg:hover:shadow-sm"}`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="whitespace-nowrap">{link.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}