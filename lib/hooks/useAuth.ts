import { useSession, signOut } from "next-auth/react";

export interface User {
  userId: string;
  orgId: string;
  fullName: string;
  email: string;
  appRole: string;
  orgRole: string;
  activeCompany?: string;
}

export const useAuth = () => {
  const { data: session, status } = useSession();

  const user = session?.user
    ? {
        userId: session.user.userId,
        orgId: session.user.orgId,
        fullName: session.user.fullName,
        email: session.user.email,
        appRole: session.user.appRole,
        orgRole: session.user.orgRole,
        activeCompany: session.user.activeCompany,
      }
    : null;

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  const logout = async () => {
    await signOut({ callbackUrl: "/auth/login" });
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    logout,
    session,
  };
};
