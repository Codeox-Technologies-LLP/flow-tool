import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin,
  Package,
  DollarSign,
  AlertTriangle,
  Warehouse,
  Building2,
  ShoppingCart,
} from "lucide-react";
import type { LocationAnalyticsCardsProps } from "@/types/location";

export function LocationAnalyticsCards({
  analytics,
  loading,
}: LocationAnalyticsCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Card key={i} className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="h-12 w-12 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!analytics?.summary) return null;

  const { summary } = analytics;

  const cards = [
    {
      title: "Total Locations",
      value: summary.totalLocations,
      icon: MapPin,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Internal Locations",
      value: summary.internalLocations,
      icon: Warehouse,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "External Locations",
      value: summary.externalLocations,
      icon: Building2,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Total Stock Items",
      value: summary.totalStockItems.toLocaleString(),
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Unique Products",
      value: summary.totalUniqueProducts,
      icon: ShoppingCart,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Total Stock Value",
      value: `$${summary.totalStockValue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Low Stock Alerts",
      value: summary.lowStockAlerts,
      icon: AlertTriangle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Out of Stock",
      value: summary.outOfStockAlerts,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold">{card.value}</p>
                </div>
                <div className={`rounded-full p-3 ${card.bgColor}`}>
                  <Icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
