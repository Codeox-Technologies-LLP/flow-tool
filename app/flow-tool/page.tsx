import * as LucideIcons from "lucide-react";
import { getUserInfo } from "@/lib/api/server-auth";
import { get } from "lodash";
import type { LucideIcon } from "lucide-react";
import AppCard from "@/components/flow-tool/app-card";
import Greeting from "@/components/flow-tool/greeting";

export default async function AppPage() {
  const userInfo = await getUserInfo();
  const moduleItems = get(userInfo, "apps.modules.items", []);
  const firstName = get(userInfo, "userInfo.basicDetails.fullName", "").split(
    " "
  )[0];

  return (
    <div className="min-h-screen bg-secondary">
      <div className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <Greeting firstName={firstName} />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5  gap-3">
          {moduleItems.map((module) => {
            const lucideIconsMap = LucideIcons as unknown as Record<
              string,
              LucideIcon
            >;
            const IconComponent: LucideIcon =
              lucideIconsMap[module.icon] || LucideIcons.Box;

            const route = module.route || get(module, "subItems[0].route", "#");

            return (
              <AppCard
                key={module.displayName}
                module={module}
                route={route}
                IconComponent={IconComponent}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
