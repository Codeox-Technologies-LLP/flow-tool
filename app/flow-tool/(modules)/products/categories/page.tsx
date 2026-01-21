"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { debounce, get } from "lodash";
import { DataTable } from "@/components/shared/data-table";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { categoryApi, CategoryListResponse, Tool } from "@/api/category/category";

export default function CategoryPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryListResponse | null>(
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    null,
  );
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setSearching(true);
      }
      setError(null);
      const response = await categoryApi.list({
        page,
        limit,
        search: searchQuery || undefined,
        // sortBy,
        // sortOrder,
      });

      if (response && response.result) {
        setCategories(response);
      } else {
        setError("Invalid response format");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch category";
      setError(errorMessage);
      console.error("Error fetching category:", err);
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
      fetchCategories();
    }, 300);

    debouncedFetch();

    return () => {
      debouncedFetch.cancel();
    };
  }, [page, searchQuery, sortBy, sortOrder, fetchCategories]);

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
      setSelectedCategory(id);
      setDeleteDialog(true);
    } else if (action === "edit") {
      router.push(`/flow-tool/products/categories/${id}`);
    } else if (action === "view") {
      toast.info("View functionality coming soon");
   
    }
  };

  const handleToolClick = (toolName: string) => {
    const tool = get(categories, "tools", []).find(
      (t: Tool) => t.name === toolName,
    );

    if (tool?.route) {
      router.push(`/flow-tool${tool.route}`);
    } else if (toolName === "create") {
      toast.info("Create category functionality coming soon");
    }
  };

  const confirmDelete = async () => {
    if (!selectedCategory) return;

    try {
      const response = await categoryApi.delete(selectedCategory);
      if (response.status) {
        toast.success("category deleted successfully");
        fetchCategories(); 
      } else {
        toast.error(response.message || "Failed to delete category");
      }
    } catch (err) {
      toast.error("Failed to delete category");
      console.error("Error deleting category:", err);
    } finally {
      setDeleteDialog(false);
      setSelectedCategory(null);
    }
  };

  return (
    <div className="space-y-6 p-6">

      <DataTable
        title="Categories"
        description="Manage your product category"
        tools={get(categories, "tools", [])}
        tableHeaders={get(categories, "result.tableHeader", [])}
        components={get(categories, "result.components", [])}
        data={get(categories, "result.data", [])}
        loading={loading}
        searching={searching}
        error={error}
        searchable={get(categories, "result.search", true)}
        pageable={get(categories, "result.pagination", true)}
        totalPages={get(categories, "result.totalPages", 1)}
        currentPage={get(categories, "result.currentPage", 1)}
        totalRecords={get(categories, "result.totalRecords", 0)}
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
        title="Delete Category?"
        description="This action cannot be undone. This will permanently delete the category and remove all associated data from our servers."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
