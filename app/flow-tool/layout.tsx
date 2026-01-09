import { AppHeader } from "@/components/shared/app-header";
import { getUserInfo } from "@/lib/api/server-auth";
import { UserInfoProvider } from "@/lib/context/user-info-context";
import { User } from "lucide-react";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userInfo = await getUserInfo();

  return (
    <div className="min-h-screen bg-secondary">
      <AppHeader userInfo={userInfo} />
      <main>{children}</main>
    </div>
  );
}
