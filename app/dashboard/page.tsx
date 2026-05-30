"use client";

import { useSession, signOut } from "next-auth/react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const userRole = (session?.user as any)?.role || "Member";

  if (status === "loading") {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-950 px-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-medium text-slate-200 backdrop-blur">
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-6 py-10 sm:px-8 lg:px-10">
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />

      <section className="relative mx-auto max-w-5xl rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-slate-800/90 p-7 text-slate-100 shadow-2xl backdrop-blur xl:p-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="inline-flex items-center rounded-full border border-cyan-300/25 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
              Visitor Management System
            </p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Welcome back, {session?.user?.name || "User"}
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
              Monitor visitor flow, manage entries, and keep your workplace secure with a fast and focused dashboard.
            </p>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="inline-flex items-center justify-center rounded-xl border border-rose-300/30 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:-translate-y-0.5 hover:bg-rose-500/20 hover:shadow-lg hover:shadow-rose-700/20"
          >
            Sign Out
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Current Role</p>
            <p className="mt-2 text-xl font-semibold text-cyan-200">{userRole}</p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Access Status</p>
            <p className="mt-2 text-xl font-semibold text-emerald-300">Active Session</p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:col-span-2 lg:col-span-1">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Ready For</p>
            <p className="mt-2 text-xl font-semibold text-amber-200">Check-In Operations</p>
          </article>
        </div>
      </section>
    </main>
  );
}