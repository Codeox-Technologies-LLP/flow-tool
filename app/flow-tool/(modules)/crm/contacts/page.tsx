"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { debounce, get } from "lodash";
import { DataTable } from "@/components/shared/data-table";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { ContactListResponse, Tool } from "@/types/contact";
import { contactApi } from "@/api/contact/contact";

export default function ContactsPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<ContactListResponse | null>(
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
  const [selectedContact, setSelectedContact] = useState<string | null>(
    null,
  );
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Fetch Contacts from API
  const fetchContacts = useCallback(async () => {
    try {
      // Only show loading spinner on initial load, not on search/pagination
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setSearching(true);
      }
      setError(null);
      const response = await contactApi.list({
        page,
        limit,
        search: searchQuery || undefined,
        sortBy,
        sortOrder,
      });

      // API returns data directly without a status wrapper
      if (response && response.result) {
        setContacts(response);
      } else {
        setError("Invalid response format");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch Contacts";
      setError(errorMessage);
      console.error("Error fetching Contacts:", err);
    } finally {
      if (isInitialLoad) {
        setLoading(false);
        setIsInitialLoad(false);
      } else {
        setSearching(false);
      }
    }
  }, [page, limit, searchQuery, sortBy, sortOrder, isInitialLoad]);

  // Fetch Contacts on component mount and when filters change
  useEffect(() => {
    const debouncedFetch = debounce(() => {
      fetchContacts();
    }, 300);

    debouncedFetch();

    return () => {
      debouncedFetch.cancel();
    };
  }, [page, searchQuery, sortBy, sortOrder, fetchContacts]);

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
      setSelectedContact(id);
      setDeleteDialog(true);
    } else if (action === "edit") {
      router.push(`/flow-tool/crm/contacts/${id}`);
    } else if (action === "view") {
      toast.info("View functionality coming soon");
      // Navigate to view page or open view dialog
    }
  };

  const handleToolClick = (toolName: string) => {
    const tool = get(contacts, "tools", []).find(
      (t: Tool) => t.name === toolName,
    );

    if (tool?.route) {
      router.push(`/flow-tool${tool.route}`);
    } else if (toolName === "create") {
      router.push("/flow-tool/crm/contacts/add");
    }
  };

  const confirmDelete = async () => {
    if (!selectedContact) return;

    try {
      const response = await contactApi.delete(selectedContact);
      if (response.status) {
        toast.success("Contact deleted successfully");
        fetchContacts(); // Refresh the list
      } else {
        toast.error(response.message || "Failed to delete Contact");
      }
    } catch (err) {
      toast.error("Failed to delete Contact");
      console.error("Error deleting Contact:", err);
    } finally {
      setDeleteDialog(false);
      setSelectedContact(null);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <DataTable
        title="Contacts"
        description="Manage your warehouse Contacts and storage areas"
        tools={get(contacts, "tools", [])}
        tableHeaders={get(contacts, "result.tableHeader", [])}
        components={get(contacts, "result.components", [])}
        data={get(contacts, "result.data", [])}
        loading={loading}
        searching={searching}
        error={error}
        searchable={get(contacts, "result.search", true)}
        pageable={get(contacts, "result.pagination", true)}
        totalPages={get(contacts, "result.totalPages", 1)}
        currentPage={get(contacts, "result.currentPage", 1)}
        totalRecords={get(contacts, "result.totalRecords", 0)}
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
        title="Delete Contact?"
        description="This action cannot be undone. This will permanently delete the Contact and remove all associated data from our servers."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
