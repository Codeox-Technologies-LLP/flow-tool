"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { debounce, get } from "lodash";
import { toast } from "sonner";



import { DataTable } from "@/components/shared/data-table";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import {  quotationApi, QuotationListResponse, Tool } from "@/api/quotations/quotation";

export default function QuotationPage() {
  const router = useRouter();

  const [quotations, setQuotations] =
    useState<QuotationListResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("expiryDate");
  const [sortOrder, setSortOrder] = useState<number>(-1);

  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedQuotation, setSelectedQuotation] =
    useState<string | null>(null);

  const [isInitialLoad, setIsInitialLoad] = useState(true);


  const fetchQuotations = useCallback(async () => {
    try {
      isInitialLoad ? setLoading(true) : setSearching(true);
      setError(null);

      const response = await quotationApi.list({
        page,
        limit,
        search: searchQuery || undefined,
        sortBy,
        sortOrder,
      });

      setQuotations(response);
    } catch (err) {
      setError("Failed to fetch quotations");
      console.error(err);
    } finally {
      setLoading(false);
      setSearching(false);
      setIsInitialLoad(false);
    }
  }, [page, limit, searchQuery, sortBy, sortOrder, isInitialLoad]);

  useEffect(() => {
    const debounced = debounce(fetchQuotations, 300);
    debounced();
    return () => debounced.cancel();
  }, [fetchQuotations]);

  /* ------------------ Handlers ------------------ */

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
      setSelectedQuotation(id);
      setDeleteDialog(true);
    } else if (action === "edit") {
      router.push(`/flow-tool/sales/quotations/${id}`);
    } else if (action === "view") {
      toast.info("View quotation coming soon");
    }
  };

  const handleToolClick = (toolName: string) => {
    const tool = get(quotations, "tools", []).find(
      (t: Tool) => t.name === toolName,
    );

    if (toolName === "create") {
      router.push("/flow-tool/sales/quotations/add");
    } else if (tool?.route) {
      router.push(`/flow-tool${tool.route}`);
    }
  };

  const confirmDelete = async () => {
    if (!selectedQuotation) return;

    try {
      const res = await quotationApi.delete(selectedQuotation);
      if (res.status) {
        toast.success("Quotation deleted successfully");
        fetchQuotations();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleteDialog(false);
      setSelectedQuotation(null);
    }
  };


  return (
    <div className="space-y-6 p-6">
      <DataTable
        title="Quotations"
        description="Manage and track all quotations"
        tools={get(quotations, "tools", [])}
        tableHeaders={get(quotations, "result.tableHeader", [])}
        components={get(quotations, "result.components", [])}
        data={get(quotations, "result.data", [])}
        loading={loading}
        searching={searching}
        error={error}
        searchable={get(quotations, "result.search", true)}
        pageable={get(quotations, "result.pagination", true)}
        totalPages={get(quotations, "result.totalPages", 1)}
        currentPage={get(quotations, "result.currentPage", 1)}
        totalRecords={get(quotations, "result.totalRecords", 0)}
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
        title="Delete Quotation?"
        description="This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
