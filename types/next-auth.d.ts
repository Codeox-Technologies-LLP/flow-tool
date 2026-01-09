import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    userId: string;
    orgId: string;
    fullName: string;
    email: string;
    appRole: string;
    orgRole: string;
    activeCompany?: string;
    accessToken: string;
  }

  interface Session {
    user: {
      userId: string;
      orgId: string;
      fullName: string;
      email: string;
      appRole: string;
      orgRole: string;
      activeCompany?: string;
    } & DefaultSession["user"];
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
    orgId: string;
    fullName: string;
    email: string;
    appRole: string;
    orgRole: string;
    activeCompany?: string;
    accessToken: string;
  }
}
