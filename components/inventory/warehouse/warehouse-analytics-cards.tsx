import { get } from "lodash";
import {
  Building2,
  Package,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WarehouseAnalyticsCardsProps } from "@/types/warehouse";

export function WarehouseAnalyticsCards({ analytics }: WarehouseAnalyticsCardsProps) {
  return (
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
            {get(analytics, 'summary.totalWarehouses', 0)}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {get(analytics, 'summary.totalLocations', 0)} locations
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
            {get(analytics, 'summary.totalStockItems', 0).toLocaleString()}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {get(analytics, 'summary.totalUniqueProducts', 0)} unique products
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
            ${get(analytics, 'summary.totalStockValue', 0).toLocaleString()}
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
            {get(analytics, 'summary.lowStockAlerts', 0) + 
             get(analytics, 'summary.outOfStockAlerts', 0)}
          </div>
          <p className="text-xs text-orange-600 mt-1">
            {get(analytics, 'summary.lowStockAlerts', 0)} low stock, {get(analytics, 'summary.outOfStockAlerts', 0)} out of stock
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
