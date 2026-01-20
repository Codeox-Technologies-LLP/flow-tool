"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { debounce, get } from "lodash";
import {
  warehouseApi,
  type WarehouseListResponse,
  type Tool,
} from "@/api/warehouse/warehouse";
import { DataTable } from "@/components/shared/data-table";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { WarehouseAnalyticsCards } from "@/components/inventory/warehouse/warehouse-analytics-cards";

export default function WarehousePage() {
  const router = useRouter();
  const [warehouses, setWarehouses] = useState<WarehouseListResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string | null>(
    null,
  );

  // Fetch warehouses from API
  const fetchWarehouses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await warehouseApi.list({
        page,
        limit,
        search: searchQuery || undefined,
        sortBy,
        sortOrder,
      });

      // API returns data directly without a status wrapper
      if (response && response.result) {
        setWarehouses(response);
      } else {
        setError("Invalid response format");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch warehouses";
      setError(errorMessage);
      console.error("Error fetching warehouses:", err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchQuery, sortBy, sortOrder]);

  // Fetch warehouses on component mount and when filters change
  useEffect(() => {
    const debouncedFetch = debounce(() => {
      fetchWarehouses();
    }, 300);

    debouncedFetch();

    return () => {
      debouncedFetch.cancel();
    };
  }, [page, searchQuery, sortBy, sortOrder, fetchWarehouses]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1); // Reset to first page on new search
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSort = (field: string, order: number) => {
    setSortBy(field);
    setSortOrder(order);
  };

  const handleAction = (action: string, id: string) => {
    if (action === "delete") {
      setSelectedWarehouse(id);
      setDeleteDialog(true);
    } else if (action === "edit") {
      router.push(`/flow-tool/inventory/warehouses/${id}`);
    } else if (action === "view") {
      toast.info("View functionality coming soon");
      // Navigate to view page or open view dialog
    }
  };

  const handleToolClick = (toolName: string) => {
    const tool = get(warehouses, "tools", []).find(
      (t: Tool) => t.name === toolName,
    );

    if (tool?.route) {
      router.push(`/flow-tool${tool.route}`);
    } else if (toolName === "create") {
      toast.info("Create warehouse functionality coming soon");
    }
  };

  const confirmDelete = async () => {
    if (!selectedWarehouse) return;

    try {
      const response = await warehouseApi.delete(selectedWarehouse);
      if (response.status) {
        toast.success("Warehouse deleted successfully");
        fetchWarehouses(); // Refresh the list
      } else {
        toast.error(response.message || "Failed to delete warehouse");
      }
    } catch (err) {
      toast.error("Failed to delete warehouse");
      console.error("Error deleting warehouse:", err);
    } finally {
      setDeleteDialog(false);
      setSelectedWarehouse(null);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {warehouses?.analytics && (
        <WarehouseAnalyticsCards analytics={warehouses.analytics} />
      )}

      <DataTable
        title="Warehouses"
        description="Manage your warehouse locations and inventory centers"
        tools={get(warehouses, "tools", [])}
        tableHeaders={get(warehouses, "result.tableHeader", [])}
        components={get(warehouses, "result.components", [])}
        data={get(warehouses, "result.data", [])}
        loading={loading}
        error={error}
        searchable={get(warehouses, "result.search", true)}
        pageable={get(warehouses, "result.pagination", true)}
        totalPages={get(warehouses, "result.totalPages", 1)}
        currentPage={get(warehouses, "result.currentPage", 1)}
        totalRecords={get(warehouses, "result.totalRecords", 0)}
        onSearch={handleSearch}
        onPageChange={handlePageChange}
        onSort={handleSort}
        onAction={handleAction}
        onToolClick={handleToolClick}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        onConfirm={confirmDelete}
        title="Delete Warehouse?"
        description="This action cannot be undone. This will permanently delete the warehouse and remove all associated data from our servers."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
