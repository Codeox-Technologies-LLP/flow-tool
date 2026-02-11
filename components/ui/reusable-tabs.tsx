"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, usePathname } from "next/navigation";
import { ReactNode } from "react";

export interface TabConfig {
  value: string;
  label: string;
  content: ReactNode;
}

interface ReusableTabsProps {
  tabs: TabConfig[];
  activeTab: string;
  className?: string;
  tabsListClassName?: string;
  tabsContentClassName?: string;
  updateUrl?: boolean;
}

export function ReusableTabs({
  tabs,
  activeTab,
  className = "w-full",
  tabsListClassName,
  tabsContentClassName = "mt-2",
  updateUrl = true,
}: ReusableTabsProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleTabChange = (value: string) => {
    if (updateUrl) {
      router.push(`${pathname}?tab=${value}`);
    }
  };

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={handleTabChange} 
      className={className}
    >
      <TabsList className={tabsListClassName}>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent 
          key={tab.value} 
          value={tab.value} 
          className={tabsContentClassName}
        >
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}