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
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <AppHeader userInfo={userInfo} />
      <main>
          <div className="container mx-auto px-6 py-12">{children}</div>

      </main>
    </div>
  );
}
