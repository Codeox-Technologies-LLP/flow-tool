import DynamicSidebar from "@/components/flow-tool/dynamic-sidebar";
import { getUserInfo } from "@/lib/api/server-auth";
import { get } from "lodash";

export default async function ModulesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userInfo = await getUserInfo();
  const moduleItems = get(userInfo, "apps.modules.items", []);

  return (
    <div className="flex h-screen overflow-hidden">
      <DynamicSidebar moduleItems={moduleItems} />
      <main className="flex-1 overflow-y-auto bg-slate-50">{children}</main>
    </div>
  );
}
