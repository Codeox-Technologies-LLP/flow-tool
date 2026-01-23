"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { debounce, get } from "lodash";
import { DataTable } from "@/components/shared/data-table";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { brandApi, BrandListResponse, Tool } from "@/api/brand/brand";

export default function BrandPage() {
  const router = useRouter();
  const [brands, setBrands] = useState<BrandListResponse | null>(
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
  const [selectedBrand, setSelectedBrand] = useState<string | null>(
    null,
  );
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchBrands = useCallback(async () => {
    try {
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setSearching(true);
      }
      setError(null);
      const response = await brandApi.list({
        page,
        limit,
        search: searchQuery || undefined,
        // sortBy,
        // sortOrder,
      });

      if (response && response.result) {
        setBrands(response);
      } else {
        setError("Invalid response format");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch brand";
      setError(errorMessage);
      console.error("Error fetching brand:", err);
    } finally {
      if (isInitialLoad) {
        setLoading(false);
        setIsInitialLoad(false);
      } else {
        setSearching(false);
      }
    }
  }, [page, limit, searchQuery, sortBy, sortOrder, isInitialLoad]);

  useEffect(() => {
    const debouncedFetch = debounce(() => {
      fetchBrands();
    }, 300);

    debouncedFetch();

    return () => {
      debouncedFetch.cancel();
    };
  }, [page, searchQuery, sortBy, sortOrder, fetchBrands]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1); 
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
      setSelectedBrand(id);
      setDeleteDialog(true);
    } else if (action === "edit") {
      router.push(`/flow-tool/products/brand/${id}`);
    } else if (action === "view") {
      toast.info("View functionality coming soon");
   
    }
  };

  const handleToolClick = (toolName: string) => {
    const tool = get(brands, "tools", []).find(
      (t: Tool) => t.name === toolName,
    );

    if (tool?.route) {
      router.push(`/flow-tool${tool.route}`);
    } else if (toolName === "create") {
      toast.info("Create brand functionality coming soon");
    }
  };

  const confirmDelete = async () => {
    if (!selectedBrand) return;

    try {
      const response = await brandApi.delete(selectedBrand);
      if (response.status) {
        toast.success("brand deleted successfully");
        fetchBrands(); 
      } else {
        toast.error(response.message || "Failed to delete brand");
      }
    } catch (err) {
      toast.error("Failed to delete brand");
      console.error("Error deleting brand:", err);
    } finally {
      setDeleteDialog(false);
      setSelectedBrand(null);
    }
  };

  return (
    <div className="space-y-6 p-6">

      <DataTable
        title="Brand"
        description="Manage your product Brand"
        tools={get(brands, "tools", [])}
        tableHeaders={get(brands, "result.tableHeader", [])}
        components={get(brands, "result.components", [])}
        data={get(brands, "result.data", [])}
        loading={loading}
        searching={searching}
        error={error}
        searchable={get(brands, "result.search", true)}
        pageable={get(brands, "result.pagination", true)}
        totalPages={get(brands, "result.totalPages", 1)}
        currentPage={get(brands, "result.currentPage", 1)}
        totalRecords={get(brands, "result.totalRecords", 0)}
        onSearch={handleSearch}
        onPageChange={handlePageChange}
        onSort={handleSort}
        onAction={handleAction}
        onToolClick={handleToolClick}
      />
      
      <ConfirmationDialog
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        onConfirm={confirmDelete}
        title="Delete Brand?"
        description="This action cannot be undone. This will permanently delete the brand and remove all associated data from our servers."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
