import { ModuleSidebar } from "@/components/shared/module-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { getUserInfo } from "@/lib/api/server-auth";
import { get } from "lodash";

export default async function ModuleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userInfo = await getUserInfo();
  const moduleItems = get(userInfo, "apps.modules.items", []);

  return (
    <div className="flex w-full">
      <ModuleSidebar moduleItems={moduleItems} />
      <SidebarInset className="flex-1">
        <main className="w-full min-h-[calc(100vh-3.5rem)] bg-slate-50 p-6">
          {children}
        </main>
      </SidebarInset>
    </div>
  );
}
