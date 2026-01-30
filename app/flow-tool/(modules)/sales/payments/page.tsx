"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { debounce, get } from "lodash";
import { toast } from "sonner";



import { DataTable } from "@/components/shared/data-table";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import {  paymentApi, PaymentListResponse, Tool } from "@/api/payments/payment";

export default function PaymentPage() {
  const router = useRouter();

  const [payments, setPayments] =
    useState<PaymentListResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("amount");
  const [sortOrder, setSortOrder] = useState<number>(-1);

  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] =
    useState<string | null>(null);

  const [isInitialLoad, setIsInitialLoad] = useState(true);


  const fetchPayments = useCallback(async () => {
    try {
      isInitialLoad ? setLoading(true) : setSearching(true);
      setError(null);

      const response = await paymentApi.list({
        page,
        limit,
        search: searchQuery || undefined,
        sortBy,
        sortOrder,
      });

      setPayments(response);
    } catch (err) {
      setError("Failed to fetch payments");
      console.error(err);
    } finally {
      setLoading(false);
      setSearching(false);
      setIsInitialLoad(false);
    }
  }, [page, limit, searchQuery, sortBy, sortOrder, isInitialLoad]);

  useEffect(() => {
    const debounced = debounce(fetchPayments, 300);
    debounced();
    return () => debounced.cancel();
  }, [fetchPayments]);

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
      setSelectedPayment(id);
      setDeleteDialog(true);
    } else if (action === "edit") {
      router.push(`/flow-tool/sales/payments/${id}`);
    } else if (action === "view") {
      toast.info("View payment coming soon");
    }
  };

  const handleToolClick = (toolName: string) => {
    const tool = get(payments, "tools", []).find(
      (t: Tool) => t.name === toolName,
    );

    if (toolName === "create") {
      router.push("/flow-tool/sales/payments/add");
    } else if (tool?.route) {
      router.push(`/flow-tool${tool.route}`);
    }
  };

  const confirmDelete = async () => {
    if (!selectedPayment) return;

    try {
      const res = await paymentApi.delete(selectedPayment);
      if (res.status) {
        toast.success("Payment deleted successfully");
        fetchPayments();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleteDialog(false);
      setSelectedPayment(null);
    }
  };


  return (
    <div className="space-y-6 p-6">
      <DataTable
        title="Payments"
        description="Manage and track all payments"
        tools={get(payments, "tools", [])}
        tableHeaders={get(payments, "result.tableHeader", [])}
        components={get(payments, "result.components", [])}
        data={get(payments, "result.data", [])}
        loading={loading}
        searching={searching}
        error={error}
        searchable={get(payments, "result.search", true)}
        pageable={get(payments, "result.pagination", true)}
        totalPages={get(payments, "result.totalPages", 1)}
        currentPage={get(payments, "result.currentPage", 1)}
        totalRecords={get(payments, "result.totalRecords", 0)}
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
        title="Delete Payment?"
        description="This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
