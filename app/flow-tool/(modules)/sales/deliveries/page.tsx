"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { debounce, get } from "lodash";
import { DataTable } from "@/components/shared/data-table";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { DeliveryListResponse, Tool } from "@/types/delivery";
import { deliveryApi } from "@/api/delivery/delivery";

export default function DeliverysPage() {
  const router = useRouter();
  const [deliveries, setDeliveries] = useState<DeliveryListResponse | null>(
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
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(
    null,
  );
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchDeliveries = useCallback(async () => {
    try {
      // Only show loading spinner on initial load, not on search/pagination
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setSearching(true);
      }
      setError(null);
      const response = await deliveryApi.list({
        page,
        limit,
        search: searchQuery || undefined,
        sortBy,
        sortOrder,
      });

      // API returns data directly without a status wrapper
      if (response && response.result) {
        setDeliveries(response);
      } else {
        setError("Invalid response format");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch Deliveries";
      setError(errorMessage);
      console.error("Error fetching Deliveries:", err);
    } finally {
      if (isInitialLoad) {
        setLoading(false);
        setIsInitialLoad(false);
      } else {
        setSearching(false);
      }
    }
  }, [page, limit, searchQuery, sortBy, sortOrder, isInitialLoad]);

  // FetchDeliveries on component mount and when filters change
  useEffect(() => {
    const debouncedFetch = debounce(() => {
      fetchDeliveries();
    }, 300);

    debouncedFetch();

    return () => {
      debouncedFetch.cancel();
    };
  }, [page, searchQuery, sortBy, sortOrder, fetchDeliveries]);

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
      setSelectedDelivery(id);
      setDeleteDialog(true);
    } else if (action === "edit") {
      router.push(`/flow-tool/sales/deliveries/${id}`);
    } else if (action === "view") {
      toast.info("View functionality coming soon");
      // Navigate to view page or open view dialog
    }
  };

  const handleToolClick = (toolName: string) => {
    const tool = get(deliveries, "tools", []).find(
      (t: Tool) => t.name === toolName,
    );

    if (tool?.route) {
      router.push(`/flow-tool${tool.route}`);
    } else if (toolName === "create") {
      router.push("/flow-tool/sales/deliveries/add");
    }
  };

  const confirmDelete = async () => {
    if (!selectedDelivery) return;

    try {
      const response = await deliveryApi.delete(selectedDelivery);
      if (response.status) {
        toast.success("Delivery deleted successfully");
        fetchDeliveries(); // Refresh the list
      } else {
        toast.error(response.message || "Failed to delete Delivery");
      }
    } catch (err) {
      toast.error("Failed to delete Delivery");
      console.error("Error deleting Delivery:", err);
    } finally {
      setDeleteDialog(false);
      setSelectedDelivery(null);
    }
  };

  return (
    <div className="space-y-6 p-6">

      <DataTable
        title="Deliveries"
        description="Manage your Deliveries"
        tools={get(deliveries, "tools", [])}
        tableHeaders={get(deliveries, "result.tableHeader", [])}
        components={get(deliveries, "result.components", [])}
        data={get(deliveries, "result.data", [])}
        loading={loading}
        searching={searching}
        error={error}
        searchable={get(deliveries, "result.search", true)}
        pageable={get(deliveries, "result.pagination", true)}
        totalPages={get(deliveries, "result.totalPages", 1)}
        currentPage={get(deliveries, "result.currentPage", 1)}
        totalRecords={get(deliveries, "result.totalRecords", 0)}
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
        title="Delete Delivery?"
        description="This action cannot be undone. This will permanently delete the Delivery and remove all associated data from our servers."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
