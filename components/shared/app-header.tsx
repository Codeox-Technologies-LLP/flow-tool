import { CompanySwitch } from "./header/company-switch";
import { Notification } from "./header/notification";
import { NavProfile } from "./header/nav-profile";
import { SidebarToggle } from "./header/sidebar-toggle";
import { DigitalClock } from "./header/digital-clock";
import FlowtoolLogo from "./FlowtoolLogo";
import type { AppHeaderProps, Company } from "@/types/user-info";

export async function AppHeader({ userInfo }: AppHeaderProps) {
  // Extract data from userInfo response (API data only)
  const companies: Company[] = userInfo?.companies || [];
  const activeCompanyId = userInfo?.userInfo?.activeCompany || "1";
  const activeCompanyName =
    companies.find((c) => c.companyId === activeCompanyId)?.companyName ||
    "My Company";
  const userName = userInfo?.userInfo?.basicDetails?.fullName || "User";
   console.log("Rendering AppHeader with userInfo:", userInfo);
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 w-full">
      <div className="flex items-center justify-between h-14 px-3 sm:px-4 lg:px-6 gap-3">
        {/* Left Section - Page Title & Breadcrumbs */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <SidebarToggle />
          <FlowtoolLogo variant="default" width={120} height={40} />
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Digital Clock */}
          <DigitalClock />

          {/* Company Switch */}
          <CompanySwitch
            activeCompany={activeCompanyId}
            companies={
              companies.length > 0
                ? companies
                : [
                    {
                      companyId: activeCompanyId || "1",
                      companyName: activeCompanyName || "My Company",
                    },
                  ]
            }
          />

          {/* Notification */}
          <Notification />

          {/* Profile */}
          <NavProfile
            userName={userName}
            userInitial={userName?.charAt(0) || "U"}
          />
        </div>
      </div>
    </header>
  );
}
