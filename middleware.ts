import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    const role = token?.role as string;

    // 1. Admin Module: System configs, user management
    if (path.startsWith("/dashboard/admin") && role !== "Admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // 2. Reception Module: Front desk check-ins, visitor logs
    if (path.startsWith("/dashboard/reception") && !["Admin", "Receptionist"].includes(role)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // 3. Security Module: Gate verification, live entry/exit tracking
    if (path.startsWith("/dashboard/security") && !["Admin", "Security"].includes(role)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // 4. Auditor Module: Reports, statistics, compliance logs
    if (path.startsWith("/dashboard/reports") && !["Admin", "Auditor"].includes(role)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*"],
};