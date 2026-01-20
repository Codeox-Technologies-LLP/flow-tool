"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  ChevronRight,
  ChevronDown,
  FileText,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  Plus,
  Send,
  Clock,
  User,
  DollarSign,
  Package,
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
      return <Plus className="w-4 h-4" />;
    case "updated":
      return <Edit className="w-4 h-4" />;
    case "deleted":
      return <Trash2 className="w-4 h-4" />;
    case "status_change":
      return <CheckCircle2 className="w-4 h-4" />;
    case "exception":
      return <AlertTriangle className="w-4 h-4" />;
    case "sent":
      return <Send className="w-4 h-4" />;
    case "confirmed":
      return <CheckCircle2 className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
};

// Helper function to get color based on type
const getActionColor = (type: AuditLogEntry["type"]) => {
  switch (type) {
    case "created":
      return "text-green-600 bg-green-50";
    case "updated":
      return "text-blue-600 bg-blue-50";
    case "deleted":
      return "text-red-600 bg-red-50";
    case "status_change":
      return "text-purple-600 bg-purple-50";
    case "exception":
      return "text-orange-600 bg-orange-50";
    case "sent":
      return "text-indigo-600 bg-indigo-50";
    case "confirmed":
      return "text-emerald-600 bg-emerald-50";
    default:
      return "text-gray-600 bg-gray-50";
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

// Individual audit log entry component
const AuditLogEntryItem = ({ entry }: { entry: AuditLogEntry }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="group relative">
      {/* Timeline line */}
      <div className="absolute left-5 top-10 bottom-0 w-px bg-gray-200 group-last:hidden" />

      <div className="flex gap-3 pb-4">
        {/* Avatar with icon */}
        <div className="relative flex-shrink-0">
          <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
            {entry.user.avatar ? (
              <AvatarImage src={entry.user.avatar} alt={entry.user.name} />
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold">
                {entry.user.initials}
              </AvatarFallback>
            )}
          </Avatar>
          {/* Action type icon badge */}
          <div
            className={cn(
              "absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center shadow-sm border-2 border-white",
              getActionColor(entry.type)
            )}
          >
            {getActionIcon(entry.type)}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-gray-900 text-sm">
                  {entry.user.name}
                </span>
                <span className="text-gray-500 text-xs">
                  {format(entry.timestamp, "'Today at' h:mm a")}
                </span>
              </div>
              <div className="text-sm text-gray-700 font-medium mt-0.5">
                {entry.action}
              </div>
            </div>

            {/* Expand button for entries with details */}
            {entry.expandable && entry.details && entry.details.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-gray-100"
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
            <div className="text-sm text-gray-600 mt-1 leading-relaxed">
              {entry.message}
            </div>
          )}

          {/* Details - shown when non-expandable or when expanded */}
          {entry.details &&
            entry.details.length > 0 &&
            (!entry.expandable || expanded) && (
              <div className="mt-2 space-y-1.5">
                {entry.details.map((detail, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-sm bg-gray-50 rounded-md px-3 py-2 border border-gray-100"
                  >
                    <span className="text-gray-600 font-medium min-w-0 flex-shrink-0">
                      {detail.field}:
                    </span>
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="text-gray-500 line-through">
                        {formatValue(detail.oldValue, detail.type)}
                      </span>
                      <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      <span className="text-green-600 font-semibold">
                        {formatValue(detail.newValue, detail.type)}
                      </span>
                      {detail.type === "currency" && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-white ml-auto flex-shrink-0"
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

          {/* Exception highlighting */}
          {entry.type === "exception" && entry.details && (
            <div className="mt-2">
              {entry.details.map((detail, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-sm bg-orange-50 border border-orange-200 rounded-md px-3 py-2"
                >
                  <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0" />
                  <span className="text-orange-800">
                    <span className="font-semibold">{detail.field}:</span>{" "}
                    {detail.oldValue} instead of {detail.newValue}
                  </span>
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
      <div className="px-4 py-3 border-b bg-gray-50/50 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
            {title}
          </h3>
          <Badge variant="secondary" className="text-xs">
            {entries.length}
          </Badge>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 bg-white rounded-lg p-1 border border-gray-200">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
              filter === "all"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            All
          </button>
          <button
            onClick={() => setFilter("updates")}
            className={cn(
              "flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
              filter === "updates"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            Updates
          </button>
          <button
            onClick={() => setFilter("exceptions")}
            className={cn(
              "flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
              filter === "exceptions"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            Exceptions
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {filteredEntries.length > 0 ? (
          <div className="space-y-0">
            {filteredEntries.map((entry) => (
              <AuditLogEntryItem key={entry.id} entry={entry} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Clock className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-sm text-gray-500 font-medium">
              No {filter} activities yet
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Activity logs will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
