// User Info Types
export interface UserInfoData {
  userInfo: {
    _id: string;
    userId: string;
    orgId: string;
    basicDetails: {
      fullName: string;
      email: string;
    };
    orgRole: string;
    appRole: string;
    activeCompany: string;
  };
  companies: Company[];
  apps: Apps;
}

export interface Company {
  companyId: string;
  companyName: string;
}

export interface Apps {
  modules: AppSection;
  reports: AppSection;
}

export interface AppSection {
  header: string;
  search: boolean;
  items: AppItem[];
}

export interface AppItem {
  displayName: string;
  route: string;
  icon: string;
  key?: string;
  matchRoutes?: string[];
  subItems?: AppSubItem[];
}

export interface AppSubItem {
  key?: string;
  displayName: string;
  route: string;
  icon: string;
  matchRoutes?: string[];
}

export interface UserInfoResponse {
  status?: boolean;
  message?: string;
  userInfo?: {
    _id: string;
    userId: string;
    orgId: string;
    basicDetails: {
      fullName: string;
      email: string;
    };
    orgRole: string;
    appRole: string;
    activeCompany: string;
  };
  companies?: Company[];
  apps?: Apps;
}
