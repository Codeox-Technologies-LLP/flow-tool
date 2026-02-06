"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { debounce, get } from "lodash";
import {
  billApi,
  type BillListResponse,
  type Tool,
} from "@/api/bill/bill";
import { DataTable } from "@/components/shared/data-table";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
// import { WarehouseAnalyticsCards } from "@/components/inventory/warehouse/warehouse-analytics-cards";

export default function BillPage() {
  const router = useRouter();
  const [bill, setBill] = useState<BillListResponse | null>(
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
  const [selectedBill, setSelectedBill] = useState<string | null>(
    null,
  );
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Fetch warehouses from API
  const fetchBills = useCallback(async () => {
    try {
      // Only show loading spinner on initial load, not on search/pagination
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setSearching(true);
      }
      setError(null);
      const response = await billApi.list({
        page,
        limit,
        search: searchQuery || undefined,
        sortBy,
        sortOrder,
      });

      // API returns data directly without a status wrapper
      if (response && response.result) {
        setBill(response);
      } else {
        setError("Invalid response format");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch bills";
      setError(errorMessage);
      console.error("Error fetching bills:", err);
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
      fetchBills();
    }, 300);

    debouncedFetch();

    return () => {
      debouncedFetch.cancel();
    };
  }, [page, searchQuery, sortBy, sortOrder, fetchBills]);

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
      setSelectedBill(id);
      setDeleteDialog(true);
    } else if (action === "edit") {
      router.push(`/flow-tool/purchase/bill/${id}`);
    } else if (action === "view") {
       router.push(`/flow-tool/purchase/bill/${id}`);
      // toast.info("View functionality coming soon");
      // Navigate to view page or open view dialog
    }
  };

  const handleToolClick = (toolName: string) => {
    const tool = get(bill, "tools", []).find(
      (t: Tool) => t.name === toolName,
    );

    if (tool?.route) {
      router.push(`/flow-tool${tool.route}`);
    } else if (toolName === "create") {
      toast.info("Create bill functionality coming soon");
    }
  };

  const confirmDelete = async () => {
    if (!selectedBill) return;

    try {
      const response = await billApi.delete(selectedBill);
      if (response.status) {
        toast.success("bill deleted successfully");
        fetchBills(); // Refresh the list
      } else {
        toast.error(response.message || "Failed to delete bill");
      }
    } catch (err) {
      toast.error("Failed to delete bill");
      console.error("Error deleting bill:", err);
    } finally {
      setDeleteDialog(false);
      setSelectedBill(null);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* <WarehouseAnalyticsCards analytics={bills?.analytics} loading={loading} /> */}

      <DataTable
        title="Bill"
        description="Manage your bill"
        tools={get(bill, "tools", [])}
        tableHeaders={get(bill, "result.tableHeader", [])}
        components={get(bill, "result.components", [])}
        data={get(bill, "result.data", [])}
        loading={loading}
        searching={searching}
        error={error}
        searchable={get(bill, "result.search", true)}
        pageable={get(bill, "result.pagination", true)}
        totalPages={get(bill, "result.totalPages", 1)}
        currentPage={get(bill, "result.currentPage", 1)}
        totalRecords={get(bill, "result.totalRecords", 0)}
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
        title="Delete bill?"
        description="This action cannot be undone. This will permanently delete the bill and remove all associated data from our servers."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
