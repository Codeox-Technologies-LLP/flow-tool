export interface LeadAuditEntry {
  _id: string;
  enquiryId: string;
  action: "create" | "edit" | "status_change" | "note" | "activity";
  title: string;
  desc: string;
  userName: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadAuditResponse {
  status: boolean;
  message: string;
  data: LeadAuditEntry[];
}


export interface LeadAnalyticsSummary {
  totalLeads: number;
  new: number;
  contacted: number;
  working: number;
  won: number;
  loss: number;
}

export interface LeadAnalyticsCardsProps {
  analytics:
    | {
        summary: LeadAnalyticsSummary;
      }
    | null
    | undefined;
  loading?: boolean;
}


export interface LeadEditFormProps {
  lead: import("@/api/lead/lead").LeadData;
  enquiryId: string;
}
