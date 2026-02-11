"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { debounce, get } from "lodash";
import { DataTable } from "@/components/shared/data-table";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { Tool, vendorApi, VendorListResponse } from "@/api/vendor/vendor";

export default function VendorsPage() {
  const router = useRouter();
  const [vendors, setVendors] = useState<VendorListResponse | null>(
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
  const [selectedVendor, setSelectedVendor] = useState<string | null>(
    null,
  );
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchVendors = useCallback(async () => {
    try {
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setSearching(true);
      }
      setError(null);
      const response = await vendorApi.list({
        page,
        limit,
        search: searchQuery || undefined,
        sortBy,
        sortOrder,
      });

      // API returns data directly without a status wrapper
      if (response && response.result) {
        setVendors(response);
      } else {
        setError("Invalid response format");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch Vendors";
      setError(errorMessage);
      console.error("Error fetching Vendors:", err);
    } finally {
      if (isInitialLoad) {
        setLoading(false);
        setIsInitialLoad(false);
      } else {
        setSearching(false);
      }
    }
  }, [page, limit, searchQuery, sortBy, sortOrder, isInitialLoad]);

  // Fetch Vendors on component mount and when filters change
  useEffect(() => {
    const debouncedFetch = debounce(() => {
      fetchVendors();
    }, 300);

    debouncedFetch();

    return () => {
      debouncedFetch.cancel();
    };
  }, [page, searchQuery, sortBy, sortOrder, fetchVendors]);

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
      setSelectedVendor(id);
      setDeleteDialog(true);
    } else if (action === "edit") {
      router.push(`/flow-tool/purchase/vendors/${id}`);
    } else if (action === "view") {
      toast.info("View functionality coming soon");
      // Navigate to view page or open view dialog
    }
  };

  const handleToolClick = (toolName: string) => {
    const tool = get(vendors, "tools", []).find(
      (t: Tool) => t.name === toolName,
    );

    if (tool?.route) {
      router.push(`/flow-tool${tool.route}`);
    } else if (toolName === "create") {
      router.push("/flow-tool/purchase/vendors/add");
    }
  };

  const confirmDelete = async () => {
    if (!selectedVendor) return;

    try {
      const response = await vendorApi.delete(selectedVendor);
      if (response.status) {
        toast.success("Vendor deleted successfully");
        fetchVendors(); // Refresh the list
      } else {
        toast.error(response.message || "Failed to delete Vendor");
      }
    } catch (err) {
      toast.error("Failed to delete Vendor");
      console.error("Error deleting Vendor:", err);
    } finally {
      setDeleteDialog(false);
      setSelectedVendor(null);
    }
  };

  return (
    <div className="space-y-6 p-6">

      <DataTable
        title="Vendors"
        description="Manage your warehouse Vendors and storage areas"
        tools={get(vendors, "tools", [])}
        tableHeaders={get(vendors, "result.tableHeader", [])}
        components={get(vendors, "result.components", [])}
        data={get(vendors, "result.data", [])}
        loading={loading}
        searching={searching}
        error={error}
        searchable={get(vendors, "result.search", true)}
        pageable={get(vendors, "result.pagination", true)}
        totalPages={get(vendors, "result.totalPages", 1)}
        currentPage={get(vendors, "result.currentPage", 1)}
        totalRecords={get(vendors, "result.totalRecords", 0)}
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
        title="Delete Vendor?"
        description="This action cannot be undone. This will permanently delete the Vendor and remove all associated data from our servers."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
