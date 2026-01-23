"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { debounce, get } from "lodash";
import { DataTable } from "@/components/shared/data-table";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { manufacturerApi, ManufacturerListResponse, Tool } from "@/api/manufacturer/manufacturer";

export default function ManufacturerPage() {
  const router = useRouter();
  const [manufacturer, setManufacturer] = useState<ManufacturerListResponse | null>(
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
  const [selectedManufacturer, setSelectedManufacturer] = useState<string | null>(
    null,
  );
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchManufacturer = useCallback(async () => {
    try {
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setSearching(true);
      }
      setError(null);
      const response = await manufacturerApi.list({
        page,
        limit,
        search: searchQuery || undefined,
        // sortBy,
        // sortOrder,
      });

      if (response && response.result) {
        setManufacturer(response);
      } else {
        setError("Invalid response format");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch manufacturer";
      setError(errorMessage);
      console.error("Error fetching manufacturer:", err);
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
      fetchManufacturer();
    }, 300);

    debouncedFetch();

    return () => {
      debouncedFetch.cancel();
    };
  }, [page, searchQuery, sortBy, sortOrder, fetchManufacturer]);

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
      setSelectedManufacturer(id);
      setDeleteDialog(true);
    } else if (action === "edit") {
      router.push(`/flow-tool/products/manufacturer/${id}`);
    } else if (action === "view") {
      toast.info("View functionality coming soon");
   
    }
  };

  const handleToolClick = (toolName: string) => {
    const tool = get(manufacturer, "tools", []).find(
      (t: Tool) => t.name === toolName,
    );

    if (tool?.route) {
      router.push(`/flow-tool${tool.route}`);
    } else if (toolName === "create") {
      toast.info("Create manufacturer functionality coming soon");
    }
  };

  const confirmDelete = async () => {
    if (!selectedManufacturer) return;

    try {
      const response = await manufacturerApi.delete(selectedManufacturer);
      if (response.status) {
        toast.success("manufacturer deleted successfully");
        fetchManufacturer(); 
      } else {
        toast.error(response.message || "Failed to delete manufacturer");
      }
    } catch (err) {
      toast.error("Failed to delete manufacturer");
      console.error("Error deleting manufacturer:", err);
    } finally {
      setDeleteDialog(false);
      setSelectedManufacturer(null);
    }
  };

  return (
    <div className="space-y-6 p-6">

      <DataTable
        title="Manufacturer"
        description="Manage your product Manufacturer"
        tools={get(manufacturer, "tools", [])}
        tableHeaders={get(manufacturer, "result.tableHeader", [])}
        components={get(manufacturer, "result.components", [])}
        data={get(manufacturer, "result.data", [])}
        loading={loading}
        searching={searching}
        error={error}
        searchable={get(manufacturer, "result.search", true)}
        pageable={get(manufacturer, "result.pagination", true)}
        totalPages={get(manufacturer, "result.totalPages", 1)}
        currentPage={get(manufacturer, "result.currentPage", 1)}
        totalRecords={get(manufacturer, "result.totalRecords", 0)}
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
        title="Delete Manufacturer?"
        description="This action cannot be undone. This will permanently delete the manufacturer and remove all associated data from our servers."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
