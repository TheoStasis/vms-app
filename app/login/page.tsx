"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid credentials. Please try again.");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-8 text-white shadow-[0_24px_80px_rgba(15,23,42,0.22)] sm:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.22),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.16),transparent_28%)]" />
          <div className="relative max-w-lg">
            <div className="eyebrow border-white/15 bg-white/10 text-white">Visitor Management System</div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
              Modern visitor operations, without the clutter.
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-200 sm:text-lg">
              Sign in to manage arrivals, approvals, and audit trails from a calm, focused workspace designed for daily use.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
                <div className="text-2xl font-semibold">Fast</div>
                <div className="mt-1 text-sm text-slate-300">Clear actions at the front desk</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
                <div className="text-2xl font-semibold">Safe</div>
                <div className="mt-1 text-sm text-slate-300">Role-based access and approvals</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
                <div className="text-2xl font-semibold">Clean</div>
                <div className="mt-1 text-sm text-slate-300">Built for long shifts and long logs</div>
              </div>
            </div>
          </div>
        </section>

        <section className="surface p-8 sm:p-10">
          <div className="flex flex-col items-start gap-2">
            <div className="eyebrow">Sign In</div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Welcome back</h2>
            <p className="text-sm leading-6 text-slate-600">Enter your credentials to continue to the dashboard.</p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="form-label">Email address</label>
              <input
                id="email"
                type="email"
                required
                className="input-field"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="form-label">Password</label>
              <input
                id="password"
                type="password"
                required
                className="input-field"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="button-primary w-full"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
          </form>
        </section>
      </div>
    </div>
  );
}