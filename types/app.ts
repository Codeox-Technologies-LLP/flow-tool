import type { LucideIcon } from "lucide-react";

export interface SubItem {
  key?: string;
  displayName: string;
  route: string;
  icon?: string;
  matchRoutes?: string[];
}

export interface ModuleItem {
  displayName: string;
  route: string;
  icon?: string;
  subItems?: SubItem[];
}

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

export interface MenuItem {
  displayName: string;
  route: string;
  icon: string;
  matchRoutes?: string[];
  subItems?: MenuSubItem[];
}

export interface MenuSubItem {
  key?: string;
  displayName: string;
  route: string;
  icon: string;
  matchRoutes?: string[];
}
