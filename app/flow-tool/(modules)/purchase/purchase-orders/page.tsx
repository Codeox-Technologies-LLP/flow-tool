"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { debounce, get } from "lodash";
import {
  purchaseApi,
  type PurchaseListResponse,
  type Tool,
} from "@/api/purchase/purchase";
import { DataTable } from "@/components/shared/data-table";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { PurchaseAnalyticsCards } from "@/components/purchase/purchase/purchase-analytics-cards";

export default function PurchasePage() {
  const router = useRouter();
  const [purchases, setPurchases] = useState<PurchaseListResponse | null>(
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
  const [selectedPurchase, setSelectedPurchase] = useState<string | null>(
    null,
  );
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Fetch warehouses from API
  const fetchPurchases = useCallback(async () => {
    try {
      // Only show loading spinner on initial load, not on search/pagination
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setSearching(true);
      }
      setError(null);
      const response = await purchaseApi.list({
        page,
        limit,
        search: searchQuery || undefined,
        sortBy,
        sortOrder,
      });

      // API returns data directly without a status wrapper
      if (response && response.result) {
        setPurchases(response);
      } else {
        setError("Invalid response format");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch purchases";
      setError(errorMessage);
      console.error("Error fetching purchases:", err);
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
      fetchPurchases();
    }, 300);

    debouncedFetch();

    return () => {
      debouncedFetch.cancel();
    };
  }, [page, searchQuery, sortBy, sortOrder, fetchPurchases]);

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
      setSelectedPurchase(id);
      setDeleteDialog(true);
    } else if (action === "edit") {
      router.push(`/flow-tool/purchase/purchase-orders/${id}`);
    } else if (action === "view") {
      toast.info("View functionality coming soon");
      // Navigate to view page or open view dialog
    }
  };

  const handleToolClick = (toolName: string) => {
    const tool = get(purchases, "tools", []).find(
      (t: Tool) => t.name === toolName,
    );

    if (tool?.route) {
      router.push(`/flow-tool${tool.route}`);
    } else if (toolName === "create") {
      toast.info("Create purchase functionality coming soon");
    }
  };

  const confirmDelete = async () => {
    if (!selectedPurchase) return;

    try {
      const response = await purchaseApi.delete(selectedPurchase);
      if (response.status) {
        toast.success("Purchase deleted successfully");
        fetchPurchases(); // Refresh the list
      } else {
        toast.error(response.message || "Failed to delete purchase");
      }
    } catch (err) {
      toast.error("Failed to delete purchase");
      console.error("Error deleting purchase:", err);
    } finally {
      setDeleteDialog(false);
      setSelectedPurchase(null);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <PurchaseAnalyticsCards analytics={purchases?.analytics} loading={loading} />

      <DataTable
        title="Purchases"
        description="Manage your purchase"
        tools={get(purchases, "tools", [])}
        tableHeaders={get(purchases, "result.tableHeader", [])}
        components={get(purchases, "result.components", [])}
        data={get(purchases, "result.data", [])}
        loading={loading}
        searching={searching}
        error={error}
        searchable={get(purchases, "result.search", true)}
        pageable={get(purchases, "result.pagination", true)}
        totalPages={get(purchases, "result.totalPages", 1)}
        currentPage={get(purchases, "result.currentPage", 1)}
        totalRecords={get(purchases, "result.totalRecords", 0)}
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
        title="Delete Purchase?"
        description="This action cannot be undone. This will permanently delete the purchase and remove all associated data from our servers."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
