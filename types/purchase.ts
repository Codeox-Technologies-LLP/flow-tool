
export interface PurchaseAnalyticsSummary {
  totalPurchases: number;
  totalAmount: number;
  confirmedPurchases: number;
  highestPurchaseValue: number;
}

export interface PurchaseAnalyticsCardsProps {
  analytics: {
    summary: PurchaseAnalyticsSummary;
  } | null | undefined;
  loading?: boolean;
}

export interface PurchaseEditFormProps {
  purchase: import("@/api/purchase/purchase").PurchaseData;
  purchaseId: string;
}
