"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { warehouseApi, type WarehouseListResponse } from "@/lib/api/warehouse";
import { DataTable } from "@/components/shared/data-table";
import {
  Building2,
  MapPin,
  Package,
  TrendingUp,
  AlertTriangle,
  AlertCircle as AlertCircleIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function WarehousePage() {
  const [apiResponse, setApiResponse] = useState<WarehouseListResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string | null>(
    null
  );

  // Fetch warehouses from API
  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await warehouseApi.list({
        page,
        limit,
        search: searchQuery || undefined,
        sortBy,
        sortOrder,
      });

      // API returns data directly without a status wrapper
      if (response && response.result) {
        setApiResponse(response);
      } else {
        setError("Invalid response format");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to fetch warehouses");
      console.error("Error fetching warehouses:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch warehouses on component mount and when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchWarehouses();
    }, 300);

    return () => clearTimeout(timer);
  }, [page, searchQuery, sortBy, sortOrder]);

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
      setSelectedWarehouse(id);
      setDeleteDialog(true);
    } else if (action === "edit") {
      toast.info("Edit functionality coming soon");
      // Navigate to edit page or open edit dialog
    } else if (action === "view") {
      toast.info("View functionality coming soon");
      // Navigate to view page or open view dialog
    }
  };

  const handleToolClick = (toolName: string) => {
    if (toolName === "create") {
      toast.info("Create warehouse functionality coming soon");
      // Navigate to create page or open create dialog
    }
  };

  const confirmDelete = async () => {
    if (!selectedWarehouse) return;

    try {
      const response = await warehouseApi.delete(selectedWarehouse);
      if (response.status) {
        toast.success("Warehouse deleted successfully");
        fetchWarehouses(); // Refresh the list
      } else {
        toast.error(response.message || "Failed to delete warehouse");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete warehouse");
      console.error("Error deleting warehouse:", err);
    } finally {
      setDeleteDialog(false);
      setSelectedWarehouse(null);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Analytics Summary Cards - Compact */}
      {apiResponse?.analytics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Warehouses
              </CardTitle>
              <Building2 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {apiResponse.analytics.summary.totalWarehouses}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {apiResponse.analytics.summary.totalLocations} locations
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Stock Items
              </CardTitle>
              <Package className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {apiResponse.analytics.summary.totalStockItems.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {apiResponse.analytics.summary.totalUniqueProducts} unique products
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Stock Value
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                ${apiResponse.analytics.summary.totalStockValue.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Across all warehouses
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Alerts & Warnings
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {apiResponse.analytics.summary.lowStockAlerts + 
                 apiResponse.analytics.summary.outOfStockAlerts}
              </div>
              <p className="text-xs text-orange-600 mt-1">
                {apiResponse.analytics.summary.lowStockAlerts} low stock, {apiResponse.analytics.summary.outOfStockAlerts} out of stock
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <DataTable
        title="Warehouses"
        description="Manage your warehouse locations and inventory centers"
        tools={apiResponse?.tools || []}
        tableHeaders={apiResponse?.result?.tableHeader || []}
        components={apiResponse?.result?.components || []}
        data={apiResponse?.result?.data || []}
        loading={loading}
        error={error}
        searchable={apiResponse?.result?.search ?? true}
        pageable={apiResponse?.result?.pagination ?? true}
        totalPages={apiResponse?.result?.totalPages || 1}
        currentPage={apiResponse?.result?.currentPage || 1}
        totalRecords={apiResponse?.result?.totalRecords || 0}
        onSearch={handleSearch}
        onPageChange={handlePageChange}
        onSort={handleSort}
        onAction={handleAction}
        onToolClick={handleToolClick}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              warehouse and remove all associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
