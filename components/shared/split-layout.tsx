import { ReactNode } from "react";
import AuditLog, { type AuditLogEntry } from "@/components/shared/audit-log";

interface SplitLayoutProps {
  children: ReactNode;
  sidePanel?: ReactNode;
  sidePanelWidth?: string;
  sidePanelClassName?: string;
  gap?: string;
}

export function SplitLayout({ 
  children, 
  sidePanel,
  sidePanelWidth = "w-[480px]",
  sidePanelClassName = "border-l border-gray-200 overflow-y-auto bg-gray-50",
  gap = "gap-4"
}: SplitLayoutProps) {
  return (
    <div className={`flex-1 overflow-hidden flex ${gap} p-4`}>
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>

      {/* Side Panel */}
      {sidePanel && (
        <div className={`${sidePanelWidth} ${sidePanelClassName}`}>
          {sidePanel}
        </div>
      )}
    </div>
  );
}

// Convenience wrapper for layouts with audit log
interface SplitLayoutWithAuditProps {
  children: ReactNode;
  auditEntries?: AuditLogEntry[];
  sidePanelWidth?: string;
}

export function SplitLayoutWithAudit({ 
  children, 
  auditEntries = [],
  sidePanelWidth = "w-[480px]"
}: SplitLayoutWithAuditProps) {
  return (
    <SplitLayout
      sidePanel={<AuditLog entries={auditEntries} />}
      sidePanelWidth={sidePanelWidth}
    >
      {children}
    </SplitLayout>
  );
}
