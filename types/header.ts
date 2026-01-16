// Header component types

/**
 * Company Switch Types
 */
export interface CompanySwitchProps {
  activeCompany?: string;
  companies?: Company[];
}

/**
 * Nav Profile Types
 */
export interface NavProfileProps {
  userName?: string;
  userInitial?: string;
}

export type DropDownItem = {
  name: string;
  displayName: string;
  navigate: string;
  icon: React.ReactNode;
};

/**
 * Notification Types
 */
export type NotificationModule = "schedule" | "enquiry" | "client";

export type Notification = {
  _id: string;
  content: string;
  userId: string;
  read: boolean;
  module: NotificationModule;
  scheduledDate?: string;
  createdAt: string;
};

// Re-export Company from user-info for convenience
export type { Company } from "./user-info";
