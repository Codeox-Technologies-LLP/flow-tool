"use client";

import { createContext, useContext } from "react";
import type { UserInfoResponse } from "@/types/user-info";

interface UserInfoContextType {
  userInfo: UserInfoResponse | null;
}

const UserInfoContext = createContext<UserInfoContextType | undefined>(undefined);

// Client-side provider - only wrap client components that need the data
export function UserInfoProvider({
  children,
  userInfo,
}: {
  children: React.ReactNode;
  userInfo: UserInfoResponse | null;
}) {
  return (
    <UserInfoContext.Provider value={{ userInfo }}>
      {children}
    </UserInfoContext.Provider>
  );
}

// Hook for client components
export function useUserInfo() {
  const context = useContext(UserInfoContext);
  if (context === undefined) {
    throw new Error("useUserInfo must be used within a UserInfoProvider");
  }
  return context;
}

// For server components - direct access via cache
import { cache } from "react";

export const getCachedUserInfo = cache(async () => {
  const { getUserInfo } = await import("@/api/auth/server-auth");
  return getUserInfo();
});

