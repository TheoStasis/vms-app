"use client";

import { useSession, signOut } from "next-auth/react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const userRole = (session?.user as any)?.role || "Member";

  if (status === "loading") {
    return (
      <div className="grid min-h-[60vh] place-items-center px-6">
        <div className="surface px-6 py-4 text-sm font-medium text-slate-600">
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="surface overflow-hidden p-8 sm:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="eyebrow">Visitor Management System</div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Welcome back, {session?.user?.name || "User"}
            </h1>
            <p className="page-copy">
              Monitor arrivals, approvals, and access control from a calm workspace built for quick decisions and long audit trails.
            </p>
          </div>

          <button onClick={() => signOut({ callbackUrl: "/login" })} className="button-secondary">
            Sign Out
          </button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Current Role</p>
            <p className="mt-3 text-xl font-semibold text-slate-900">{userRole}</p>
            <p className="mt-2 text-sm text-slate-600">Access tailored to your current responsibilities.</p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Access Status</p>
            <p className="mt-3 text-xl font-semibold text-emerald-700">Active Session</p>
            <p className="mt-2 text-sm text-slate-600">Ready to manage visitors without interruption.</p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Ready For</p>
            <p className="mt-3 text-xl font-semibold text-blue-700">Check-In Operations</p>
            <p className="mt-2 text-sm text-slate-600">Fast approvals, clean logs, and smoother front-desk handoffs.</p>
          </article>
        </div>
      </section>
    </div>
  );
}