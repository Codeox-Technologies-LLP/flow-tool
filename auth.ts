import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { authApi } from "./lib/api/auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        token: { label: "Token", type: "text" },
        userId: { label: "User ID", type: "text" },
      },
      async authorize(credentials) {
        // Handle token-based auth (from company setup)
        if (credentials?.token && credentials?.userId) {
          // Token is already verified, just create session
          return {
            id: credentials.userId as string,
            userId: credentials.userId as string,
            orgId: "", // Will be populated from token
            fullName: "", // Will be populated from token
            email: "", // Will be populated from token
            appRole: "",
            orgRole: "",
            activeCompany: undefined,
            accessToken: credentials.token as string,
          };
        }

        // Handle email/password auth (from login)
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await authApi.login({
            email: credentials.email as string,
            password: credentials.password as string,
          });

          if (response.status && "user" in response) {
            return {
              id: response.user.userId,
              userId: response.user.userId,
              orgId: response.user.orgId,
              fullName: response.user.fullName,
              email: response.user.email,
              appRole: response.user.appRole,
              orgRole: response.user.orgRole,
              activeCompany: response.user.activeCompany,
              accessToken: response.token,
            };
          }

          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
});
