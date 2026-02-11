import { get } from "lodash";
import {
  Package,
  CheckCircle,
  XCircle,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Box,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductAnalyticsCardsProps } from "@/types/product";

export function ProductAnalyticsCards({
  analytics,
  loading,
}: ProductAnalyticsCardsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Card key={i} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!analytics?.summary) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Products */}
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Total Products
          </CardTitle>
          <Package className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {get(analytics, "summary.totalProducts", 0)}
          </div>
          <p className="text-xs text-gray-500 mt-1">All products</p>
        </CardContent>
      </Card>

      {/* Active Products */}
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Active Products
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {get(analytics, "summary.activeProducts", 0)}
          </div>
          <p className="text-xs text-green-600 mt-1">Currently active</p>
        </CardContent>
      </Card>

      {/* Inactive Products */}
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Inactive Products
          </CardTitle>
          <XCircle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {get(analytics, "summary.inactiveProducts", 0)}
          </div>
          <p className="text-xs text-red-600 mt-1">Disabled / archived</p>
        </CardContent>
      </Card>

      {/* Unused Products */}
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Unused Products
          </CardTitle>
          <Box className="h-4 w-4 text-slate-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {get(analytics, "summary.unusedProducts", 0)}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Never stocked
          </p>
        </CardContent>
      </Card>

      {/* Total Stock */}
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Total Stock
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {get(analytics, "summary.totalStock", 0).toLocaleString()}
          </div>
          <p className="text-xs text-gray-500 mt-1">Units available</p>
        </CardContent>
      </Card>

      {/* Total Stock Value */}
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Stock Value
          </CardTitle>
          <DollarSign className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ₹{get(analytics, "summary.totalStockValue", 0).toLocaleString()}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Inventory worth
          </p>
        </CardContent>
      </Card>

      {/* Low Stock Alerts */}
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Low Stock Alerts
          </CardTitle>
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {get(analytics, "summary.lowStockAlerts", 0)}
          </div>
          <p className="text-xs text-yellow-600 mt-1">
            Need attention
          </p>
        </CardContent>
      </Card>

      {/* Out of Stock */}
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Out of Stock
          </CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {get(analytics, "summary.outOfStockAlerts", 0)}
          </div>
          <p className="text-xs text-red-600 mt-1">
            Immediate action
          </p>
        </CardContent>
      </Card>
    </div>
  );
}