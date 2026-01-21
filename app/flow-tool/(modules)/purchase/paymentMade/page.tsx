"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { debounce, get } from "lodash";
import {
  paymentMadeApi,
  type PaymentMadeListResponse,
  type Tool,
} from "@/api/paymentMade/paymentMade";
import { DataTable } from "@/components/shared/data-table";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
// import { WarehouseAnalyticsCards } from "@/components/inventory/warehouse/warehouse-analytics-cards";

export default function PaymentMadePage() {
  const router = useRouter();
  const [paymentMade, setPaymentMade] = useState<PaymentMadeListResponse | null>(
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
  const [selectedPaymentMade, setSelectedPaymentMade] = useState<string | null>(
    null,
  );
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Fetch warehouses from API
  const fetchPayments = useCallback(async () => {
    try {
      // Only show loading spinner on initial load, not on search/pagination
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setSearching(true);
      }
      setError(null);
      const response = await paymentMadeApi.list({
        page,
        limit,
        search: searchQuery || undefined,
        sortBy,
        sortOrder,
      });

      // API returns data directly without a status wrapper
      if (response && response.result) {
        setPaymentMade(response);
      } else {
        setError("Invalid response format");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch payments";
      setError(errorMessage);
      console.error("Error fetching payments:", err);
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
      fetchPayments();
    }, 300);

    debouncedFetch();

    return () => {
      debouncedFetch.cancel();
    };
  }, [page, searchQuery, sortBy, sortOrder, fetchPayments]);

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
      setSelectedPaymentMade(id);
      setDeleteDialog(true);
    } else if (action === "edit") {
      router.push(`/flow-tool/purchase/paymentMade/${id}`);
    } else if (action === "view") {
      toast.info("View functionality coming soon");
      // Navigate to view page or open view dialog
    }
  };

  const handleToolClick = (toolName: string) => {
    const tool = get(paymentMade, "tools", []).find(
      (t: Tool) => t.name === toolName,
    );

    if (tool?.route) {
      router.push(`/flow-tool${tool.route}`);
    } else if (toolName === "create") {
      toast.info("Create payment functionality coming soon");
    }
  };

  const confirmDelete = async () => {
    if (!selectedPaymentMade) return;

    try {
      const response = await paymentMadeApi.delete(selectedPaymentMade);
      if (response.status) {
        toast.success("payment deleted successfully");
        fetchPayments(); // Refresh the list
      } else {
        toast.error(response.message || "Failed to delete payment");
      }
    } catch (err) {
      toast.error("Failed to delete payment");
      console.error("Error deleting payment:", err);
    } finally {
      setDeleteDialog(false);
      setSelectedPaymentMade(null);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* <WarehouseAnalyticsCards analytics={payments?.analytics} loading={loading} /> */}

      <DataTable
        title="Payment"
        description="Manage your payment"
        tools={get(paymentMade, "tools", [])}
        tableHeaders={get(paymentMade, "result.tableHeader", [])}
        components={get(paymentMade, "result.components", [])}
        data={get(paymentMade, "result.data", [])}
        loading={loading}
        searching={searching}
        error={error}
        searchable={get(paymentMade, "result.search", true)}
        pageable={get(paymentMade, "result.pagination", true)}
        totalPages={get(paymentMade, "result.totalPages", 1)}
        currentPage={get(paymentMade, "result.currentPage", 1)}
        totalRecords={get(paymentMade, "result.totalRecords", 0)}
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
        title="Delete payment?"
        description="This action cannot be undone. This will permanently delete the payment and remove all associated data from our servers."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
