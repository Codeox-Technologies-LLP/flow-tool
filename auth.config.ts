import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnCompanySetup = nextUrl.pathname.startsWith("/company-setup");
      const isOnAuth = nextUrl.pathname.startsWith("/auth");

      if (isOnDashboard || isOnCompanySetup) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isOnAuth) {
        if (isLoggedIn) return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.userId = user.userId;
        token.orgId = user.orgId;
        token.fullName = user.fullName;
        token.email = user.email;
        token.appRole = user.appRole;
        token.orgRole = user.orgRole;
        token.activeCompany = user.activeCompany;
        token.accessToken = user.accessToken;
      }

      // Handle session updates
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.userId = token.userId as string;
        session.user.orgId = token.orgId as string;
        session.user.fullName = token.fullName as string;
        session.user.email = token.email as string;
        session.user.appRole = token.appRole as string;
        session.user.orgRole = token.orgRole as string;
        session.user.activeCompany = token.activeCompany as string | undefined;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  providers: [], // Add providers in auth.ts
} satisfies NextAuthConfig;
