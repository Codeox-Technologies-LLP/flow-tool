import { AppHeader } from "@/components/shared/app-header";
import { getUserInfo } from "@/lib/api/server-auth";

export default async function FlowToolLayout({
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
