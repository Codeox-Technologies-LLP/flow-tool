import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { getUserInfo } from "@/lib/api/server-auth";
import { get } from "lodash";
import type { LucideIcon } from "lucide-react";

// Icon color mappings
const iconColorMap: Record<string, { iconBg: string; iconColor: string }> = {
  Items: { iconBg: "bg-purple-50", iconColor: "text-purple-600" },
  CRM: { iconBg: "bg-blue-50", iconColor: "text-blue-600" },
  Sales: { iconBg: "bg-green-50", iconColor: "text-green-600" },
  Inventory: { iconBg: "bg-orange-50", iconColor: "text-orange-600" },
  Purchase: { iconBg: "bg-red-50", iconColor: "text-red-600" },
};

export default async function AppPage() {
  const userInfo = await getUserInfo();

  // Extract module items from apps
  const moduleItems = get(userInfo, "apps.modules.items", []);
  return (
    <>
      {/* Main Content */}
      <div className="">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome, {userInfo?.userInfo?.basicDetails?.fullName}
          </h2>
          <p className="text-slate-600 text-lg">Access your enabled modules</p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {moduleItems.map((module) => {
            // Get the icon component dynamically
            const lucideIconsMap = LucideIcons as unknown as Record<string, LucideIcon>;
            const IconComponent: LucideIcon = lucideIconsMap[module.icon] || LucideIcons.Box;
            
            // Get color scheme or use default
            const colors = iconColorMap[module.displayName] || {
              iconBg: "bg-slate-50",
              iconColor: "text-slate-600",
            };

            // Get first sub-item route or use module route
            const route = module.route || module.subItems?.[0]?.route || "#";

            return (
              <Link
                key={module.displayName}
                href={`/app${route}`}
                className="group relative bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg hover:border-slate-300 transition-all duration-200"
              >
                {/* Icon */}
                <div
                  className={`w-14 h-14 ${colors.iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
                >
                  <IconComponent className={`w-7 h-7 ${colors.iconColor}`} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {module.displayName}
                </h3>

                {/* Arrow Indicator */}
                <div className="mt-4 flex items-center text-sm font-medium text-slate-400 group-hover:text-blue-600 transition-colors">
                  <span>Open</span>
                  <svg
                    className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
