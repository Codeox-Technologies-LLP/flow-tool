import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Check for auth token in cookies
  const hasAuthToken = req.cookies.has("auth_token");

  // Protected routes
  const protectedRoutes = ["/app", "/dashboard"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Company setup route - requires token
  const isCompanySetup = pathname.startsWith("/company-setup");

  // Auth routes
  const authRoutes = ["/auth/login", "/auth/register", "/auth/otp-verify"];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Allow company-setup with auth token
  if (isCompanySetup) {
    if (!hasAuthToken) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    return NextResponse.next();
  }

  // Protect app routes
  if (isProtectedRoute && !hasAuthToken) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Redirect to app if already logged in and trying to access auth pages
  if (isAuthRoute && hasAuthToken) {
    return NextResponse.redirect(new URL("/app", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
