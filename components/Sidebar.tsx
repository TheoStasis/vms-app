"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { LayoutDashboard, Users, ShieldCheck, ClipboardList, Settings } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["Admin", "Receptionist", "Security", "Host", "Auditor"] },
    { name: "Reception", href: "/dashboard/reception", icon: Users, roles: ["Admin", "Receptionist"] },
    { name: "Gate Check", href: "/dashboard/security", icon: ShieldCheck, roles: ["Admin", "Security"] },
    { name: "Reports", href: "/dashboard/reports", icon: ClipboardList, roles: ["Admin", "Auditor"] },
    { name: "Admin Settings", href: "/dashboard/admin", icon: Settings, roles: ["Admin"] },
  ];

  const allowedLinks = navLinks.filter((link) => link.roles.includes(role));

  return (
    <aside className="h-[calc(100vh-4rem)] w-64 border-r bg-gray-50 p-4">
      <nav className="flex flex-col gap-2">
        {allowedLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link key={link.name} href={link.href} className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium ${isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"}`}>
              <Icon className="h-5 w-5" /> {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}