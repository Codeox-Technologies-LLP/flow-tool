import * as LucideIcons from "lucide-react";
import { getUserInfo } from "@/api/auth/server-auth";
import { get } from "lodash";
import type { LucideIcon } from "lucide-react";
import AppCard from "@/components/app-drawer/app-card";
import BackgroundGrid from "@/components/shared/background-grid";

export default async function AppPage() {
  const userInfo = await getUserInfo();
  const moduleItems = get(userInfo, "apps.modules.items", []);
  const firstName = get(userInfo, "userInfo.basicDetails.fullName", "").split(
    " "
  )[0];
  console.log("Module Items:", moduleItems);
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      <BackgroundGrid />

      <div className="container mx-auto px-8 py-12 relative z-10 max-w-7xl">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back, {firstName}
          </h1>
          <p className="text-sm text-slate-600">
            Select a module to get started
          </p>
        </div>

        {/* Apps Grid - Professional ERP Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
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
