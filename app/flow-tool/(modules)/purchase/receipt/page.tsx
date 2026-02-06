"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { debounce, get } from "lodash";
import {
  receiptApi,
  type ReceiptListResponse,
  type Tool,
} from "@/api/receipt/receipt";
import { DataTable } from "@/components/shared/data-table";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
// import { WarehouseAnalyticsCards } from "@/components/inventory/warehouse/warehouse-analytics-cards";

export default function ReceiptPage() {
  const router = useRouter();
  const [receipts, setReceipts] = useState<ReceiptListResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedReceipts, setSelectedReceipts] = useState<string | null>(
    null,
  );
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Fetch warehouses from API
  const fetchReceipts = useCallback(async () => {
    try {
      // Only show loading spinner on initial load, not on search/pagination
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setSearching(true);
      }
      setError(null);
      const response = await receiptApi.list({
        page,
        limit,
        search: searchQuery || undefined,
        sortBy,
        sortOrder,
      });

      // API returns data directly without a status wrapper
      if (response && response.result) {
        setReceipts(response);
      } else {
        setError("Invalid response format");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch receipts";
      setError(errorMessage);
      console.error("Error fetching receipts:", err);
    } finally {
      if (isInitialLoad) {
        setLoading(false);
        setIsInitialLoad(false);
      } else {
        setSearching(false);
      }
    }
  }, [page, limit, searchQuery, sortBy, sortOrder, isInitialLoad]);

  // Fetch warehouses on component mount and when filters change
  useEffect(() => {
    const debouncedFetch = debounce(() => {
      fetchReceipts();
    }, 300);

    debouncedFetch();

    return () => {
      debouncedFetch.cancel();
    };
  }, [page, searchQuery, sortBy, sortOrder, fetchReceipts]);

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
      setSelectedReceipts(id);
      setDeleteDialog(true);
    } else if (action === "edit") {
      router.push(`/flow-tool/purchase/receipt/${id}`);
    } else if (action === "view") {
      router.push(`/flow-tool/purchase/receipt/${id}`);
      // toast.info("View functionality coming soon");
      // Navigate to view page or open view dialog
    }
  };

  const handleToolClick = (toolName: string) => {
    const tool = get(receipts, "tools", []).find(
      (t: Tool) => t.name === toolName,
    );

    if (tool?.route) {
      router.push(`/flow-tool${tool.route}`);
    } else if (toolName === "create") {
      toast.info("Create receipt functionality coming soon");
    }
  };

  const confirmDelete = async () => {
    if (!selectedReceipts) return;

    try {
      const response = await receiptApi.delete(selectedReceipts);
      if (response.status) {
        toast.success("receipt deleted successfully");
        fetchReceipts(); // Refresh the list
      } else {
        toast.error(response.message || "Failed to delete receipt");
      }
    } catch (err) {
      toast.error("Failed to delete receipt");
      console.error("Error deleting receipt:", err);
    } finally {
      setDeleteDialog(false);
      setSelectedReceipts(null);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* <WarehouseAnalyticsCards analytics={receipts?.analytics} loading={loading} /> */}

      <DataTable
        title="Receipts"
        description="Manage your receipts"
        tools={get(receipts, "tools", [])}
        tableHeaders={get(receipts, "result.tableHeader", [])}
        components={get(receipts, "result.components", [])}
        data={get(receipts, "result.data", [])}
        loading={loading}
        searching={searching}
        error={error}
        searchable={get(receipts, "result.search", true)}
        pageable={get(receipts, "result.pagination", true)}
        totalPages={get(receipts, "result.totalPages", 1)}
        currentPage={get(receipts, "result.currentPage", 1)}
        totalRecords={get(receipts, "result.totalRecords", 0)}
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
        title="Delete receipt?"
        description="This action cannot be undone. This will permanently delete the receipt and remove all associated data from our servers."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
