"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { debounce, get } from "lodash";
import { DataTable } from "@/components/shared/data-table";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { productApi, ProductListResponse, Tool } from "@/api/product/product";
import { ProductAnalyticsCards } from "@/components/products/product/product-analytics-cards";

export default function ProductPage() {
    const router = useRouter();
    const [products, setProducts] = useState<ProductListResponse | null>(
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
    const [selectedProduct, setSelectedProduct] = useState<string | null>(
        null,
    );
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const fetchProducts = useCallback(async () => {
        try {
            if (isInitialLoad) {
                setLoading(true);
            } else {
                setSearching(true);
            }
            setError(null);
            const response = await productApi.list({
                page,
                limit,
                search: searchQuery || undefined,
                sortBy,
                sortOrder,
            });

            if (response && response.result) {
                setProducts(response);
            } else {
                setError("Invalid response format");
            }
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Failed to fetch products";
            setError(errorMessage);
            console.error("Error fetching products:", err);
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
            fetchProducts();
        }, 300);

        debouncedFetch();

        return () => {
            debouncedFetch.cancel();
        };
    }, [page, searchQuery, sortBy, sortOrder, fetchProducts]);

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
            setSelectedProduct(id);
            setDeleteDialog(true);
        } else if (action === "edit") {
            router.push(`/flow-tool/products/items/${id}`);
        } else if (action === "view") {
            toast.info("View functionality coming soon");
        }
    };

    const handleToolClick = (toolName: string) => {
        const tool = get(products, "tools", []).find(
            (t: Tool) => t.name === toolName,
        );

        if (tool?.route) {
            router.push(`/flow-tool${tool.route}`);
        } else if (toolName === "create") {
            toast.info("Create product functionality coming soon");
        }
    };

    const confirmDelete = async () => {
        if (!selectedProduct) return;

        try {
            const response = await productApi.delete(selectedProduct);
            if (response.status) {
                toast.success("product deleted successfully");
                fetchProducts();
            } else {
                toast.error(response.message || "Failed to delete product");
            }
        } catch (err) {
            toast.error("Failed to delete product");
            console.error("Error deleting product:", err);
        } finally {
            setDeleteDialog(false);
            setSelectedProduct(null);
        }
    };

    return (
        <div className="space-y-6 p-6">
            <ProductAnalyticsCards analytics={products?.analytics} loading={loading} />

            <DataTable
                title="Products"
                description="Manage your products"
                tools={get(products, "tools", [])}
                tableHeaders={get(products, "result.tableHeader", [])}
                components={get(products, "result.components", [])}
                data={get(products, "result.data", []) as Record<string, unknown>[]}
                loading={loading}
                searching={searching}
                error={error}
                searchable={get(products, "result.search", true)}
                pageable={get(products, "result.pagination", true)}
                totalPages={get(products, "result.totalPages", 1)}
                currentPage={get(products, "result.currentPage", 1)}
                totalRecords={get(products, "result.totalRecords", 0)}
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
                title="Delete Product?"
                description="This action cannot be undone. This will permanently delete the Product and remove all associated data from our servers."
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
            />
        </div>
    );
}
