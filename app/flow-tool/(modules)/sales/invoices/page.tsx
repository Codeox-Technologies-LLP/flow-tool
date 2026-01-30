"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { debounce, get } from "lodash";
import { DataTable } from "@/components/shared/data-table";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { invoiceApi } from "@/api/invoice/invoice";
import { InvoiceListResponse, Tool } from "@/types/invoice";

export default function InvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<InvoiceListResponse | null>(
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
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(
    null,
  );
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Fetch Invoices from API
  const fetchInvoices = useCallback(async () => {
    try {
      // Only show loading spinner on initial load, not on search/pagination
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setSearching(true);
      }
      setError(null);
      const response = await invoiceApi.list({
        page,
        limit,
        search: searchQuery || undefined,
        sortBy,
        sortOrder,
      });

      // API returns data directly without a status wrapper
      if (response && response.result) {
        setInvoices(response);
      } else {
        setError("Invalid response format");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch Invoices";
      setError(errorMessage);
      console.error("Error fetching Invoices:", err);
    } finally {
      if (isInitialLoad) {
        setLoading(false);
        setIsInitialLoad(false);
      } else {
        setSearching(false);
      }
    }
  }, [page, limit, searchQuery, sortBy, sortOrder, isInitialLoad]);

  // Fetch Invoices on component mount and when filters change
  useEffect(() => {
    const debouncedFetch = debounce(() => {
      fetchInvoices();
    }, 300);

    debouncedFetch();

    return () => {
      debouncedFetch.cancel();
    };
  }, [page, searchQuery, sortBy, sortOrder, fetchInvoices]);

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
      setSelectedInvoice(id);
      setDeleteDialog(true);
    } else if (action === "edit") {
      router.push(`/flow-tool/sales/invoices/${id}`);
    } else if (action === "view") {
      toast.info("View functionality coming soon");
      // Navigate to view page or open view dialog
    }
  };

  const handleToolClick = (toolName: string) => {
    const tool = get(invoices, "tools", []).find(
      (t: Tool) => t.name === toolName,
    );

    if (tool?.route) {
      router.push(`/flow-tool${tool.route}`);
    } else if (toolName === "create") {
      router.push("/flow-tool/sales/invoices/add");
    }
  };

  const confirmDelete = async () => {
    if (!selectedInvoice) return;

    try {
      const response = await invoiceApi.delete(selectedInvoice);
      if (response.status) {
        toast.success("Invoice deleted successfully");
        fetchInvoices(); // Refresh the list
      } else {
        toast.error(response.message || "Failed to delete Invoice");
      }
    } catch (err) {
      toast.error("Failed to delete Invoice");
      console.error("Error deleting Invoice:", err);
    } finally {
      setDeleteDialog(false);
      setSelectedInvoice(null);
    }
  };

  return (
    <div className="space-y-6 p-6">

      <DataTable
        title="Invoices"
        description="Manage your Invoices"
        tools={get(invoices, "tools", [])}
        tableHeaders={get(invoices, "result.tableHeader", [])}
        components={get(invoices, "result.components", [])}
        data={get(invoices, "result.data", [])}
        loading={loading}
        searching={searching}
        error={error}
        searchable={get(invoices, "result.search", true)}
        pageable={get(invoices, "result.pagination", true)}
        totalPages={get(invoices, "result.totalPages", 1)}
        currentPage={get(invoices, "result.currentPage", 1)}
        totalRecords={get(invoices, "result.totalRecords", 0)}
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
        title="Delete Invoice?"
        description="This action cannot be undone. This will permanently delete the Invoice and remove all associated data from our servers."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
