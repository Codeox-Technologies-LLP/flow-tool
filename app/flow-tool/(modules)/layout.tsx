import { ModuleLayoutWrapper } from "@/components/shared/module-layout-wrapper";

/**
 * Shared layout for all modules
 * This layout applies to all routes under /flow-tool/(modules)/*
 * No need to create individual layout files for each module
 */
export default async function ModulesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ModuleLayoutWrapper>{children}</ModuleLayoutWrapper>;
}
