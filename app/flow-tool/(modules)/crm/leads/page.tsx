"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { debounce, get } from "lodash";
import { DataTable } from "@/components/shared/data-table";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { leadApi, LeadListResponse, Tool } from "@/api/lead/lead";
import { LeadAnalyticsCards } from "@/components/crm/lead/lead-analytics-card";

export default function LeadPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<LeadListResponse | null>(
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
  const [selectedLead, setSelectedLead] = useState<string | null>(
    null,
  );
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchLeads = useCallback(async () => {
    try {
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setSearching(true);
      }
      setError(null);
      const response = await leadApi.list({
        page,
        limit,
        search: searchQuery || undefined,
        sortBy,
        sortOrder,
      });

      if (response && response.result) {
        setLeads(response);
      } else {
        setError("Invalid response format");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch Leads";
      setError(errorMessage);
      console.error("Error fetching Leads:", err);
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
      fetchLeads();
    }, 300);

    debouncedFetch();

    return () => {
      debouncedFetch.cancel();
    };
  }, [page, searchQuery, sortBy, sortOrder, fetchLeads]);

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
      setSelectedLead(id);
      setDeleteDialog(true);
    } else if (action === "edit") {
      router.push(`/flow-tool/crm/leads/${id}`);
    } else if (action === "view") {
      toast.info("View functionality coming soon");
    }
  };

  const handleToolClick = (toolName: string) => {
    const tool = get(leads, "tools", []).find(
      (t: Tool) => t.name === toolName,
    );

    if (tool?.route) {
      router.push(`/flow-tool${tool.route}`);
    } else if (toolName === "create") {
      toast.info("Create Lead functionality coming soon");
    }
  };

  const confirmDelete = async () => {
    if (!selectedLead) return;

    try {
      const response = await leadApi.delete(selectedLead);
      if (response.status) {
        toast.success("Lead deleted successfully");
        fetchLeads(); 
      } else {
        toast.error(response.message || "Failed to delete Lead");
      }
    } catch (err) {
      toast.error("Failed to delete Lead");
      console.error("Error deleting Lead:", err);
    } finally {
      setDeleteDialog(false);
      setSelectedLead(null);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <LeadAnalyticsCards analytics={leads?.analytics} loading={loading} />

      <DataTable
        title="Leads"
        description="Manage your Leads"
        tools={get(leads, "tools", [])}
        tableHeaders={get(leads, "result.tableHeader", [])} 
        components={get(leads, "result.components", [])}
        data={get(leads, "result.data", [])}
        loading={loading}
        searching={searching}
        error={error}
        searchable={get(leads, "result.search", true)}
        pageable={get(leads, "result.pagination", true)}
        totalPages={get(leads, "result.totalPages", 1)}
        currentPage={get(leads, "result.currentPage", 1)}
        totalRecords={get(leads, "result.totalRecords", 0)}
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
        title="Delete Lead?"
        description="This action cannot be undone. This will permanently delete the Lead and remove all associated data from our servers."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
