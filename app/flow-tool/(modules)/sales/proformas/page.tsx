"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { debounce, get } from "lodash";
import { DataTable } from "@/components/shared/data-table";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { ProformaListResponse, Tool } from "@/types/proforma";
import { proformaApi } from "@/api/proforma/proforma";

export default function ProformasPage() {
  const router = useRouter();
  const [proformas, setProformas] = useState<ProformaListResponse | null>(
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
  const [selectedProforma, setSelectedProforma] = useState<string | null>(
    null,
  );
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Fetch Proformas from API
  const fetchProformas = useCallback(async () => {
    try {
      // Only show loading spinner on initial load, not on search/pagination
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setSearching(true);
      }
      setError(null);
      const response = await proformaApi.list({
        page,
        limit,
        search: searchQuery || undefined,
        sortBy,
        sortOrder,
      });

      // API returns data directly without a status wrapper
      if (response && response.result) {
        setProformas(response);
      } else {
        setError("Invalid response format");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch Proformas";
      setError(errorMessage);
      console.error("Error fetching Proformas:", err);
    } finally {
      if (isInitialLoad) {
        setLoading(false);
        setIsInitialLoad(false);
      } else {
        setSearching(false);
      }
    }
  }, [page, limit, searchQuery, sortBy, sortOrder, isInitialLoad]);

  // Fetch Proformas on component mount and when filters change
  useEffect(() => {
    const debouncedFetch = debounce(() => {
      fetchProformas();
    }, 300);

    debouncedFetch();

    return () => {
      debouncedFetch.cancel();
    };
  }, [page, searchQuery, sortBy, sortOrder, fetchProformas]);

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
      setSelectedProforma(id);
      setDeleteDialog(true);
    } else if (action === "edit") {
      router.push(`/flow-tool/sales/proformas/${id}`);
    } else if (action === "view") {
      toast.info("View functionality coming soon");
      // Navigate to view page or open view dialog
    }
  };

  const handleToolClick = (toolName: string) => {
    const tool = get(proformas, "tools", []).find(
      (t: Tool) => t.name === toolName,
    );

    if (tool?.route) {
      router.push(`/flow-tool${tool.route}`);
    } else if (toolName === "create") {
      router.push("/flow-tool/sales/proformas/add");
    }
  };

  const confirmDelete = async () => {
    if (!selectedProforma) return;

    try {
      const response = await proformaApi.delete(selectedProforma);
      if (response.status) {
        toast.success("Proforma deleted successfully");
        fetchProformas(); // Refresh the list
      } else {
        toast.error(response.message || "Failed to delete Proforma");
      }
    } catch (err) {
      toast.error("Failed to delete Proforma");
      console.error("Error deleting Proforma:", err);
    } finally {
      setDeleteDialog(false);
      setSelectedProforma(null);
    }
  };

  return (
    <div className="space-y-6 p-6">

      <DataTable
        title="Proformas"
        description="Manage your Proformas"
        tools={get(proformas, "tools", [])}
        tableHeaders={get(proformas, "result.tableHeader", [])}
        components={get(proformas, "result.components", [])}
        data={get(proformas, "result.data", [])}
        loading={loading}
        searching={searching}
        error={error}
        searchable={get(proformas, "result.search", true)}
        pageable={get(proformas, "result.pagination", true)}
        totalPages={get(proformas, "result.totalPages", 1)}
        currentPage={get(proformas, "result.currentPage", 1)}
        totalRecords={get(proformas, "result.totalRecords", 0)}
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
        title="Delete Proforma?"
        description="This action cannot be undone. This will permanently delete the Proforma and remove all associated data from our servers."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
