"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { debounce, get } from "lodash";
import { DataTable } from "@/components/shared/data-table";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { ClientListResponse, Tool } from "@/types/client";
import { clientApi } from "@/api/client/client";

export default function ClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<ClientListResponse | null>(
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
  const [selectedClient, setSelectedClient] = useState<string | null>(
    null,
  );
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Fetch Clients from API
  const fetchClients = useCallback(async () => {
    try {
      // Only show loading spinner on initial load, not on search/pagination
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setSearching(true);
      }
      setError(null);
      const response = await clientApi.list({
        page,
        limit,
        search: searchQuery || undefined,
        sortBy,
        sortOrder,
      });

      // API returns data directly without a status wrapper
      if (response && response.result) {
        setClients(response);
      } else {
        setError("Invalid response format");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch Clients";
      setError(errorMessage);
      console.error("Error fetching Clients:", err);
    } finally {
      if (isInitialLoad) {
        setLoading(false);
        setIsInitialLoad(false);
      } else {
        setSearching(false);
      }
    }
  }, [page, limit, searchQuery, sortBy, sortOrder, isInitialLoad]);

  // Fetch Clients on component mount and when filters change
  useEffect(() => {
    const debouncedFetch = debounce(() => {
      fetchClients();
    }, 300);

    debouncedFetch();

    return () => {
      debouncedFetch.cancel();
    };
  }, [page, searchQuery, sortBy, sortOrder, fetchClients]);

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
      setSelectedClient(id);
      setDeleteDialog(true);
    } else if (action === "edit") {
      router.push(`/flow-tool/crm/clients/${id}`);
    } else if (action === "view") {
      toast.info("View functionality coming soon");
      // Navigate to view page or open view dialog
    }
  };

  const handleToolClick = (toolName: string) => {
    const tool = get(clients, "tools", []).find(
      (t: Tool) => t.name === toolName,
    );

    if (tool?.route) {
      router.push(`/flow-tool${tool.route}`);
    } else if (toolName === "create") {
      router.push("/flow-tool/crm/clients/add");
    }
  };

  const confirmDelete = async () => {
    if (!selectedClient) return;

    try {
      const response = await clientApi.delete(selectedClient);
      if (response.status) {
        toast.success("Client deleted successfully");
        fetchClients(); // Refresh the list
      } else {
        toast.error(response.message || "Failed to delete Client");
      }
    } catch (err) {
      toast.error("Failed to delete Client");
      console.error("Error deleting Client:", err);
    } finally {
      setDeleteDialog(false);
      setSelectedClient(null);
    }
  };

  return (
    <div className="space-y-6 p-6">

      <DataTable
        title="Clients"
        description="Manage your warehouse Clients and storage areas"
        tools={get(clients, "tools", [])}
        tableHeaders={get(clients, "result.tableHeader", [])}
        components={get(clients, "result.components", [])}
        data={get(clients, "result.data", [])}
        loading={loading}
        searching={searching}
        error={error}
        searchable={get(clients, "result.search", true)}
        pageable={get(clients, "result.pagination", true)}
        totalPages={get(clients, "result.totalPages", 1)}
        currentPage={get(clients, "result.currentPage", 1)}
        totalRecords={get(clients, "result.totalRecords", 0)}
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
        title="Delete Client?"
        description="This action cannot be undone. This will permanently delete the Client and remove all associated data from our servers."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
