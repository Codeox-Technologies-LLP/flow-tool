import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export default auth(async (req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Check for auth token in cookies (for company-setup flow)
  const cookieStore = await cookies();
  const hasAuthToken = cookieStore.has("auth_token");

  // Protected routes
  const protectedRoutes = ["/dashboard"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Company setup route - requires token but not session
  const isCompanySetup = pathname.startsWith("/company-setup");

  // Auth routes
  const authRoutes = ["/auth/login", "/auth/register", "/auth/otp-verify"];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Allow company-setup with auth token (no session required yet)
  if (isCompanySetup) {
    if (!hasAuthToken && !isLoggedIn) {
      return Response.redirect(new URL("/auth/login", req.url));
    }
    return;
  }

  if (isProtectedRoute && !isLoggedIn) {
    return Response.redirect(new URL("/auth/login", req.url));
  }

  if (isAuthRoute && isLoggedIn) {
    return Response.redirect(new URL("/dashboard", req.url));
  }

  return;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
