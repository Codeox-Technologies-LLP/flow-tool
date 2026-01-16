import { AppHeader } from "@/components/shared/app-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getUserInfo } from "@/lib/api/server-auth";

export default async function FlowToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userInfo = await getUserInfo();
  
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-secondary w-full">
        <AppHeader userInfo={userInfo} />
        <main className="w-full">{children}</main>
      </div>
    </SidebarProvider>
  );
}
