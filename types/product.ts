export interface ProductAnalyticsSummary {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  totalStock: number;
  totalStockValue: number;
  lowStockAlerts: number;
  outOfStockAlerts: number;
}

export interface ProductAnalytics {
  summary: ProductAnalyticsSummary;
}

export interface ProductAnalyticsCardsProps {
  analytics?: ProductAnalytics;
  loading?: boolean;
}