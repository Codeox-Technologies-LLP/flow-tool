import type { LucideIcon } from "lucide-react";

export interface AppModule {
  displayName: string;
  route: string;
  icon: string;
  subItems?: AppSubItem[];
}

export interface AppSubItem {
  displayName: string;
  route: string;
  icon: string;
  key?: string;
  matchRoutes?: string[];
}

export interface AppCardProps {
  module: AppModule;
  route: string;
  IconComponent: LucideIcon;
}

export interface GreetingProps {
  firstName: string;
}
