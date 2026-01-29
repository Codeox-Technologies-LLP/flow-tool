"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { debounce, get } from "lodash";
import { DataTable } from "@/components/shared/data-table";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { DealListResponse, Tool } from "@/types/deal";
import { dealApi } from "@/api/deal/deal";
import { DealAnalyticsCards } from "@/components/crm/deal/deal-analytics-card";

export default function DealsPage() {
  const router = useRouter();
  const [deals, setDeals] = useState<DealListResponse | null>(
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
  const [selectedDeal, setSelectedDeal] = useState<string | null>(
    null,
  );
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Fetch Deals from API
  const fetchDeals = useCallback(async () => {
    try {
      // Only show loading spinner on initial load, not on search/pagination
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setSearching(true);
      }
      setError(null);
      const response = await dealApi.list({
        page,
        limit,
        search: searchQuery || undefined,
        sortBy,
        sortOrder,
      });

      // API returns data directly without a status wrapper
      if (response && response.result) {
        setDeals(response);
      } else {
        setError("Invalid response format");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch Deals";
      setError(errorMessage);
      console.error("Error fetching Deals:", err);
    } finally {
      if (isInitialLoad) {
        setLoading(false);
        setIsInitialLoad(false);
      } else {
        setSearching(false);
      }
    }
  }, [page, limit, searchQuery, sortBy, sortOrder, isInitialLoad]);

  // Fetch Deals on component mount and when filters change
  useEffect(() => {
    const debouncedFetch = debounce(() => {
      fetchDeals();
    }, 300);

    debouncedFetch();

    return () => {
      debouncedFetch.cancel();
    };
  }, [page, searchQuery, sortBy, sortOrder, fetchDeals]);

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
      setSelectedDeal(id);
      setDeleteDialog(true);
    } else if (action === "edit") {
      router.push(`/flow-tool/crm/deals/${id}`);
    } else if (action === "view") {
      toast.info("View functionality coming soon");
      // Navigate to view page or open view dialog
    }
  };

  const handleToolClick = (toolName: string) => {
    const tool = get(deals, "tools", []).find(
      (t: Tool) => t.name === toolName,
    );

    if (tool?.route) {
      router.push(`/flow-tool${tool.route}`);
    } else if (toolName === "create") {
      router.push("/flow-tool/crm/deals/add");
    }
  };

  const confirmDelete = async () => {
    if (!selectedDeal) return;

    try {
      const response = await dealApi.delete(selectedDeal);
      if (response.status) {
        toast.success("Deal deleted successfully");
        fetchDeals(); // Refresh the list
      } else {
        toast.error(response.message || "Failed to delete Deal");
      }
    } catch (err) {
      toast.error("Failed to delete Deal");
      console.error("Error deleting Deal:", err);
    } finally {
      setDeleteDialog(false);
      setSelectedDeal(null);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <DealAnalyticsCards analytics={deals?.analytics} loading={loading} />

      <DataTable
        title="Deals"
        description="Manage your warehouse Deals and storage areas"
        tools={get(deals, "tools", [])}
        tableHeaders={get(deals, "result.tableHeader", [])}
        components={get(deals, "result.components", [])}
        data={get(deals, "result.data", [])}
        loading={loading}
        searching={searching}
        error={error}
        searchable={get(deals, "result.search", true)}
        pageable={get(deals, "result.pagination", true)}
        totalPages={get(deals, "result.totalPages", 1)}
        currentPage={get(deals, "result.currentPage", 1)}
        totalRecords={get(deals, "result.totalRecords", 0)}
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
        title="Delete Deal?"
        description="This action cannot be undone. This will permanently delete the Deal and remove all associated data from our servers."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
