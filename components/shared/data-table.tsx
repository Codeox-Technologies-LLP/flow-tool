"use client";

import { useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  AlertCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { DataTableProps, TableComponent } from "@/types/data-table";

export function DataTable({
  title,
  description,
  tools = [],
  tableHeaders,
  components,
  data,
  loading = false,
  searching = false,
  error = null,
  searchable = true,
  pageable = true,
  totalPages = 1,
  currentPage = 1,
  totalRecords = 0,
  onSearch,
  onPageChange,
  onSort,
  onAction,
  onToolClick,
  renderCustomCell,
}: DataTableProps) {
  const [searchInput, setSearchInput] = useState("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<number>(1);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleSort = (field: string) => {
    const newOrder = sortField === field && sortOrder === 1 ? -1 : 1;
    setSortField(field);
    setSortOrder(newOrder);
    if (onSort) {
      onSort(field, newOrder);
    }
  };

  const handleAction = (actionName: string, id: string) => {
    if (onAction) {
      onAction(actionName, id);
    }
  };

  const renderCell = (item: Record<string, unknown>, component: TableComponent) => {
    const value = item[component.name];

    if (component.component === "action") {
      // Type guard for action items
      const isActionItem = (val: unknown): val is { name: string; id: string; displayName: string; icon: string } => {
        return (
          typeof val === "object" &&
          val !== null &&
          "name" in val &&
          "id" in val &&
          typeof (val as Record<string, unknown>).name === "string" &&
          typeof (val as Record<string, unknown>).id === "string"
        );
      };

      if (isActionItem(value)) {
        // Render action button based on action type
        if (value.name === "edit") {
          return (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAction(value.name, value.id)}
              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              title={value.displayName}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
              </svg>
            </Button>
          );
        } else if (value.name === "delete") {
          return (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAction(value.name, value.id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              title={value.displayName}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </Button>
          );
        } else if (value.name === "view") {
          return (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAction(value.name, value.id)}
              className="h-8 w-8 p-0 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
              title={value.displayName}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </Button>
          );
        }
      }
      return null;
    }

    if (component.component === "badge") {
      return (
        <Badge variant="secondary" className="font-normal">
          {String(value ?? 0)}
        </Badge>
      );
    }

    if (component.component === "number") {
      return (
        <span className="text-sm font-medium text-gray-900">
          {typeof value === "number" ? value.toLocaleString() : String(value ?? 0)}
        </span>
      );
    }

    if (component.component === "currency") {
      const numValue = typeof value === "number" ? value : 0;
      return (
        <span className="text-sm font-semibold text-gray-900">
          ${numValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      );
    }

    if (component.component === "status") {
      const statusColors: Record<string, string> = {
        active: "bg-green-100 text-green-700 border-green-200",
        inactive: "bg-gray-100 text-gray-700 border-gray-200",
        pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
        archived: "bg-red-100 text-red-700 border-red-200",
      };
      const statusValue = String(value || "inactive").toLowerCase();
      return (
        <Badge
          variant="outline"
          className={`${statusColors[statusValue] || statusColors.inactive} capitalize`}
        >
          {statusValue}
        </Badge>
      );
    }

    if (component.component === "custom" && renderCustomCell) {
      return renderCustomCell(item, component);
    }

    // Default text rendering
    return <span className="text-sm text-gray-700">{value != null ? String(value) : "-"}</span>;
  };

  const getSortIcon = (headerName: string) => {
    if (sortField !== headerName) {
      return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />;
    }
    return sortOrder === 1 ? (
      <ArrowUp className="ml-2 h-4 w-4 text-primary" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4 text-primary" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Tools */}
      <Card className="shadow-sm relative overflow-hidden">
        {/* Smooth animated loading bar for search/pagination */}
        {searching && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-blue-100 overflow-hidden z-10">
            <div 
              className="h-full bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400 animate-shimmer"
              style={{
                width: '50%',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s ease-in-out infinite'
              }}
            />
          </div>
        )}
        <style jsx>{`
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
              background-position: -200% 0;
            }
            100% {
              transform: translateX(400%);
              background-position: 200% 0;
            }
          }
        `}</style>
        <CardHeader className="border-b bg-white">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {title}
              </CardTitle>
              {description && (
                <CardDescription className="text-gray-600 mt-1">
                  {description}
                </CardDescription>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {tools.map((tool) => (
                <Button
                  key={tool.name}
                  onClick={() => onToolClick?.(tool.name)}
                  style={{
                    backgroundColor: tool.bgColor,
                    color: tool.txtColor,
                    width: tool.width,
                  }}
                  className="font-medium shadow-sm hover:opacity-90 transition-opacity"
                >
                  {tool.displayName}
                </Button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          {searchable && (
            <div className="mt-6">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search..."
                  value={searchInput}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-9 h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent>
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4">
                  <Skeleton className="h-5 w-full" />
                </div>
              ))}
            </div>
          ) : data.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-gray-100 p-4 mb-4">
                <AlertCircle className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                No data found
              </h3>
              <p className="text-sm text-gray-600">
                {searchInput
                  ? "Try adjusting your search query"
                  : "Get started by adding your first item"}
              </p>
            </div>
          ) : (
            /* Table */
            <div className="rounded-md border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50/50">
                      {tableHeaders.map((header) => (
                        <th
                          key={header.name}
                          className="h-12 px-4 text-left align-middle font-semibold text-sm text-gray-700"
                        >
                          {header.sort ? (
                            <button
                              onClick={() => handleSort(header.name)}
                              className="flex items-center hover:text-gray-900 transition-colors"
                            >
                              {header.displayName}
                              {getSortIcon(header.name)}
                            </button>
                          ) : (
                            header.displayName
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {data.map((item, index) => (
                      <tr
                        key={typeof item.id === "string" || typeof item.id === "number" ? item.id : index}
                        className="border-b border-gray-100 transition-colors hover:bg-gray-50/50 last:border-0"
                      >
                        {components.map((component) => (
                          <td
                            key={component.name}
                            className="p-4 align-middle"
                          >
                            {renderCell(item, component)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination */}
          {pageable && !loading && data.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t">
              <div className="text-sm text-gray-600">
                Showing page <span className="font-medium">{currentPage}</span> of{" "}
                <span className="font-medium">{totalPages}</span> (
                <span className="font-medium">{totalRecords}</span> total records)
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange?.(1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                  title="First page"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange?.(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                  title="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1 px-3 py-1 bg-gray-50 rounded border">
                  <span className="text-sm font-medium text-gray-700">
                    {currentPage}
                  </span>
                  <span className="text-sm text-gray-500">/</span>
                  <span className="text-sm text-gray-500">{totalPages}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange?.(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0"
                  title="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange?.(totalPages)}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0"
                  title="Last page"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


// Usage Example

// <DataTable
//   title="Warehouses"
//   description="Manage your warehouse locations and inventory centers"
//   tools={get(warehouses, 'tools', [])}
//   tableHeaders={get(warehouses, 'result.tableHeader', [])}
//   components={get(warehouses, 'result.components', [])}
//   data={get(warehouses, 'result.data', [])}
//   loading={loading}
//   error={error}
//   searchable={get(warehouses, 'result.search', true)}
//   pageable={get(warehouses, 'result.pagination', true)}
//   totalPages={get(warehouses, 'result.totalPages', 1)}
//   currentPage={get(warehouses, 'result.currentPage', 1)}
//   totalRecords={get(warehouses, 'result.totalRecords', 0)}
//   onSearch={handleSearch}
//   onPageChange={handlePageChange}
//   onSort={handleSort}
//   onAction={handleAction}
//
