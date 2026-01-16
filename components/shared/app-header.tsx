import { CompanySwitch } from "./header/company-switch";
import { Notification } from "./header/notification";
import { NavProfile } from "./header/nav-profile";
import type { UserInfoResponse, Company } from "@/types/user-info";

interface AppHeaderProps {
  userInfo?: UserInfoResponse | null;
}

export async function AppHeader({ userInfo }: AppHeaderProps) {
  // Extract data from userInfo response (API data only)
  const companies: Company[] = userInfo?.companies || [];
  const activeCompanyId = userInfo?.userInfo?.activeCompany || "1";
  const activeCompanyName =
    companies.find((c) => c.companyId === activeCompanyId)?.companyName ||
    "My Company";
  const userName =
    userInfo?.userInfo?.basicDetails?.fullName ||
    "User";

  console.log("AppHeader - Companies:", companies);
  console.log("AppHeader - Active Company ID:", activeCompanyId);
  console.log("AppHeader - Active Company Name:", activeCompanyName);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="flex items-center justify-between h-14 px-3 sm:px-4 lg:px-6 gap-3">
        {/* Left Section - Page Title & Breadcrumbs */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="flex flex-col min-w-0 flex-1">
            <h1 className="text-sm sm:text-base font-semibold text-gray-900 truncate leading-tight">
              Dashboard
            </h1>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
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
