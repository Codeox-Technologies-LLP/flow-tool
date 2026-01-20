"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { debounce, get } from "lodash";
import { locationApi } from "@/api/location/location";
import type { LocationListResponse, Tool } from "@/types/location";
import { DataTable } from "@/components/shared/data-table";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { LocationAnalyticsCards } from "@/components/inventory/location/location-analytics-cards";

export default function LocationsPage() {
  const router = useRouter();
  const [locations, setLocations] = useState<LocationListResponse | null>(
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
  const [selectedLocation, setSelectedLocation] = useState<string | null>(
    null,
  );
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Fetch locations from API
  const fetchLocations = useCallback(async () => {
    try {
      // Only show loading spinner on initial load, not on search/pagination
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setSearching(true);
      }
      setError(null);
      const response = await locationApi.list({
        page,
        limit,
        search: searchQuery || undefined,
        sortBy,
        sortOrder,
      });

      // API returns data directly without a status wrapper
      if (response && response.result) {
        setLocations(response);
      } else {
        setError("Invalid response format");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch locations";
      setError(errorMessage);
      console.error("Error fetching locations:", err);
    } finally {
      if (isInitialLoad) {
        setLoading(false);
        setIsInitialLoad(false);
      } else {
        setSearching(false);
      }
    }
  }, [page, limit, searchQuery, sortBy, sortOrder, isInitialLoad]);

  // Fetch locations on component mount and when filters change
  useEffect(() => {
    const debouncedFetch = debounce(() => {
      fetchLocations();
    }, 300);

    debouncedFetch();

    return () => {
      debouncedFetch.cancel();
    };
  }, [page, searchQuery, sortBy, sortOrder, fetchLocations]);

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
      setSelectedLocation(id);
      setDeleteDialog(true);
    } else if (action === "edit") {
      router.push(`/flow-tool/inventory/locations/${id}`);
    } else if (action === "view") {
      toast.info("View functionality coming soon");
      // Navigate to view page or open view dialog
    }
  };

  const handleToolClick = (toolName: string) => {
    const tool = get(locations, "tools", []).find(
      (t: Tool) => t.name === toolName,
    );

    if (tool?.route) {
      router.push(`/flow-tool${tool.route}`);
    } else if (toolName === "create") {
      router.push("/flow-tool/inventory/locations/add");
    }
  };

  const confirmDelete = async () => {
    if (!selectedLocation) return;

    try {
      const response = await locationApi.delete(selectedLocation);
      if (response.status) {
        toast.success("Location deleted successfully");
        fetchLocations(); // Refresh the list
      } else {
        toast.error(response.message || "Failed to delete location");
      }
    } catch (err) {
      toast.error("Failed to delete location");
      console.error("Error deleting location:", err);
    } finally {
      setDeleteDialog(false);
      setSelectedLocation(null);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <LocationAnalyticsCards analytics={locations?.analytics} loading={loading} />

      <DataTable
        title="Locations"
        description="Manage your warehouse locations and storage areas"
        tools={get(locations, "tools", [])}
        tableHeaders={get(locations, "result.tableHeader", [])}
        components={get(locations, "result.components", [])}
        data={get(locations, "result.data", [])}
        loading={loading}
        searching={searching}
        error={error}
        searchable={get(locations, "result.search", true)}
        pageable={get(locations, "result.pagination", true)}
        totalPages={get(locations, "result.totalPages", 1)}
        currentPage={get(locations, "result.currentPage", 1)}
        totalRecords={get(locations, "result.totalRecords", 0)}
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
        title="Delete Location?"
        description="This action cannot be undone. This will permanently delete the location and remove all associated data from our servers."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
