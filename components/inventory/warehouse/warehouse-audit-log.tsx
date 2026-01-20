"use client";

import AuditLog, { type AuditLogEntry } from "@/components/shared/audit-log";
import type { WarehouseAuditEntry } from "@/lib/api/server-warehouse";

interface WarehouseAuditLogProps {
  auditData: WarehouseAuditEntry[];
}

// Map warehouse action types to audit log types
function mapActionToType(action: string): AuditLogEntry["type"] {
  switch (action) {
    case "create":
      return "created";
    case "edit":
      return "updated";
    case "note":
      return "status_change";
    case "activity":
      return "sent";
    default:
      return "updated";
  }
}

// Extract initials from user name
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function WarehouseAuditLog({ auditData }: WarehouseAuditLogProps) {
  // Transform warehouse audit data to generic audit log format
  const auditEntries: AuditLogEntry[] = auditData.map((entry) => ({
    id: entry._id,
    timestamp: new Date(entry.createdAt),
    user: {
      name: entry.userName,
      initials: getInitials(entry.userName),
      avatar: undefined,
    },
    action: entry.title,
    type: mapActionToType(entry.action),
    message: entry.desc,
    expandable: false,
  }));

  return (
    <AuditLog
      entries={auditEntries}
      title="WAREHOUSE ACTIVITY"
      className="h-full"
    />
  );
}
