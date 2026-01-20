"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  ChevronRight,
  ChevronDown,
  FileText,
  CheckCircle2,
  Edit,
  Trash2,
  Plus,
  Send,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Types
export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  user: {
    name: string;
    avatar?: string;
    initials: string;
  };
  action: string;
  type:
    | "created"
    | "updated"
    | "deleted"
    | "status_change"
    | "exception"
    | "sent"
    | "confirmed";
  details?: AuditLogDetail[];
  message?: string;
  expandable?: boolean;
}

export interface AuditLogDetail {
  field: string;
  oldValue: string | number;
  newValue: string | number;
  type?: "text" | "number" | "currency" | "status";
}

interface AuditLogProps {
  entries: AuditLogEntry[];
  title?: string;
  className?: string;
}

// Dummy Data
const DUMMY_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "1",
    timestamp: new Date("2026-01-20T12:23:00"),
    user: {
      name: "Mitchell Admin",
      initials: "MA",
      avatar: undefined,
    },
    action: "Exception",
    type: "exception",
    message:
      "Exception for Mitchell Admin. Exception reason: WH/OUT/00034. Manual actions may be needed.",
    details: [
      {
        field: "Units Processed",
        oldValue: "10.0 Units",
        newValue: "8.0 Units",
        type: "text",
      },
    ],
    expandable: false,
  },
  {
    id: "2",
    timestamp: new Date("2026-01-20T12:23:00"),
    user: {
      name: "Mitchell Admin",
      initials: "MA",
    },
    action: "Quotation confirmed",
    type: "confirmed",
    message: "Quotation → Sales Order (Status)",
    expandable: false,
  },
  {
    id: "3",
    timestamp: new Date("2026-01-20T12:23:00"),
    user: {
      name: "Mitchell Admin",
      initials: "MA",
    },
    action: "Price updated",
    type: "updated",
    details: [
      {
        field: "Total Amount",
        oldValue: 132.48,
        newValue: 110.4,
        type: "currency",
      },
    ],
    expandable: true,
  },
  {
    id: "4",
    timestamp: new Date("2026-01-20T12:23:00"),
    user: {
      name: "Mitchell Admin",
      initials: "MA",
    },
    action: "Amount adjusted",
    type: "updated",
    details: [
      {
        field: "Subtotal",
        oldValue: 115.2,
        newValue: 96.0,
        type: "currency",
      },
      {
        field: "Untaxed Amount",
        oldValue: 115.2,
        newValue: 96.0,
        type: "currency",
      },
    ],
    expandable: true,
  },
  {
    id: "5",
    timestamp: new Date("2026-01-20T12:23:00"),
    user: {
      name: "Mitchell Admin",
      initials: "MA",
    },
    action: "Total price updated",
    type: "updated",
    details: [
      {
        field: "Total",
        oldValue: 0.0,
        newValue: 132.48,
        type: "currency",
      },
      {
        field: "Untaxed Amount",
        oldValue: 0.0,
        newValue: 115.2,
        type: "currency",
      },
    ],
    expandable: true,
  },
  {
    id: "6",
    timestamp: new Date("2026-01-20T12:23:00"),
    user: {
      name: "Mitchell Admin",
      initials: "MA",
    },
    action: "Sales Order created",
    type: "created",
    expandable: false,
  },
];

// Helper function to get icon based on type
const getActionIcon = (type: AuditLogEntry["type"]) => {
  switch (type) {
    case "created":
      return <Plus className="w-2.5 h-2.5" />;
    case "updated":
      return <Edit className="w-2.5 h-2.5" />;
    case "deleted":
      return <Trash2 className="w-2.5 h-2.5" />;
    case "status_change":
      return <CheckCircle2 className="w-2.5 h-2.5" />;
    case "exception":
      return <AlertTriangle className="w-2.5 h-2.5" />;
    case "sent":
      return <Send className="w-2.5 h-2.5" />;
    case "confirmed":
      return <CheckCircle2 className="w-2.5 h-2.5" />;
    default:
      return <FileText className="w-2.5 h-2.5" />;
  }
};

// Helper function to get color based on type
const getActionColor = (type: AuditLogEntry["type"]) => {
  switch (type) {
    case "created":
      return "bg-green-500 text-white";
    case "updated":
      return "bg-blue-500 text-white";
    case "deleted":
      return "bg-red-500 text-white";
    case "status_change":
      return "bg-purple-500 text-white";
    case "exception":
      return "bg-orange-500 text-white";
    case "sent":
      return "bg-indigo-500 text-white";
    case "confirmed":
      return "bg-emerald-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

// Format value based on type
const formatValue = (
  value: string | number,
  type?: "text" | "number" | "currency" | "status"
) => {
  if (type === "currency") {
    return `$ ${Number(value).toFixed(2)}`;
  }
  return value;
};

// Format timestamp with "Today at" if it's today
const formatTimestamp = (date: Date): string => {
  const today = new Date();
  const isToday = 
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
  
  if (isToday) {
    return format(date, "'Today at' h:mm a");
  }
  return format(date, "MMM d 'at' h:mm a");
};

// Individual audit log entry component
const AuditLogEntryItem = ({ entry }: { entry: AuditLogEntry }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="group relative">
      {/* Timeline line */}
      <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-gray-200 group-last:hidden" />

      <div className="flex gap-3 pb-6">
        {/* Avatar with icon badge */}
        <div className="relative shrink-0 z-10">
          <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
            {entry.user.avatar ? (
              <AvatarImage src={entry.user.avatar} alt={entry.user.name} />
            ) : (
              <AvatarFallback className="bg-blue-600 text-white text-sm font-semibold">
                {entry.user.initials}
              </AvatarFallback>
            )}
          </Avatar>
          {/* Action type icon badge */}
          <div
            className={cn(
              "absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center shadow-md border-2 border-white",
              getActionColor(entry.type)
            )}
          >
            {getActionIcon(entry.type)}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pt-0.5">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="font-semibold text-gray-900 text-[15px]">
                  {entry.user.name}
                </span>
                <span className="text-gray-500 text-xs">
                  {formatTimestamp(entry.timestamp)}
                </span>
              </div>
              <div className="text-[15px] text-gray-900 font-medium mt-1">
                {entry.action}
              </div>
            </div>

            {/* Expand button for entries with details */}
            {entry.expandable && entry.details && entry.details.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-gray-100 rounded-md"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </Button>
            )}
          </div>

          {/* Message */}
          {entry.message && (
            <div className="text-[14px] text-gray-600 mt-2 leading-relaxed">
              {entry.message}
            </div>
          )}

          {/* Details - shown when non-expandable or when expanded */}
          {entry.details &&
            entry.details.length > 0 &&
            (!entry.expandable || expanded) && (
              <div className="mt-3 space-y-2">
                {entry.details.map((detail, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-sm bg-gray-50/80 rounded-lg px-3 py-2.5 border border-gray-100"
                  >
                    <span className="text-gray-600 font-medium min-w-0 shrink-0">
                      {detail.field}:
                    </span>
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="text-gray-500 line-through text-[13px]">
                        {formatValue(detail.oldValue, detail.type)}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="text-gray-900 font-semibold text-[13px]">
                        {formatValue(detail.newValue, detail.type)}
                      </span>
                      {detail.type === "currency" && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-white ml-auto shrink-0 font-medium"
                        >
                          {detail.oldValue < detail.newValue ? "+" : ""}
                          {formatValue(
                            Number(detail.newValue) - Number(detail.oldValue),
                            "currency"
                          )}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

// Main Audit Log Component
export default function AuditLog({
  entries = DUMMY_AUDIT_LOGS,
  title = "Activities",
  className,
}: AuditLogProps) {
  const [filter, setFilter] = useState<"all" | "updates" | "exceptions">("all");

  const filteredEntries = entries.filter((entry) => {
    if (filter === "all") return true;
    if (filter === "exceptions") return entry.type === "exception";
    if (filter === "updates") return entry.type === "updated";
    return true;
  });

  return (
    <div className={cn("h-full flex flex-col bg-white", className)}>
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-200 shrink-0 sticky top-0 bg-white z-10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
            {title}
          </h3>
          <Badge 
            variant="secondary" 
            className="text-xs font-semibold bg-gray-100 text-gray-700 px-2 py-0.5"
          >
            {entries.length}
          </Badge>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 bg-gray-50 rounded-lg p-1 border border-gray-200">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
              filter === "all"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:bg-white hover:text-gray-900"
            )}
          >
            All
          </button>
          <button
            onClick={() => setFilter("updates")}
            className={cn(
              "flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
              filter === "updates"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:bg-white hover:text-gray-900"
            )}
          >
            Updates
          </button>
          <button
            onClick={() => setFilter("exceptions")}
            className={cn(
              "flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
              filter === "exceptions"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:bg-white hover:text-gray-900"
            )}
          >
            Exceptions
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5 py-5">
        {filteredEntries.length > 0 ? (
          <div className="space-y-0">
            {filteredEntries.map((entry) => (
              <AuditLogEntryItem key={entry.id} entry={entry} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600 font-semibold mb-1">
              No {filter !== "all" ? filter : ""} activities yet
            </p>
            <p className="text-xs text-gray-500">
              Activity logs will appear here as changes are made
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
