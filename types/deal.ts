export interface DealAuditEntry {
  _id: string;
  dealId: string;
  action: string;
  title: string;
  desc: string;
  userName: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export interface DealAuditResponse {
  status: boolean;
  message: string;
  data: DealAuditEntry[];
}

export interface TableHeader {
    name: string;
    displayName: string;
    sort?: boolean;
    sortOrder?: number;
}

export interface TableComponent {
    name: string;
    displayName: string;
    component:
    | "text"
    | "action"
    | "badge"
    | "custom"
    | "number"
    | "currency"
    | "status";
}

export interface Tool {
    name: string;
    displayName: string;
    icon: string;
    bgColor?: string;
    txtColor?: string;
    width?: string;
    route?: string;
}

export interface FilterOption {
    name: string;
    displayName: string;
    data: string[];
    type: "radio" | "checkbox";
}

export interface Filter {
    name: string;
    displayName: string;
    icon: string;
    diffFilter: FilterOption[];
}

export interface KanbanTab {
    name: string;
    displayName: string;
    color: string;
}

export interface DealData extends Record<string, unknown> {
    id: string;
    dealId: string;
    title: string;
    relatedTo: string;

    clientData: {
        id: string;
        name: string;
    };

    contactId: {
        id: string;
        name: string;
    };

    assignedTo: {
        id: string;
        name: string;
    };

    value: number;
    closeDate: string;
    probability?: number;
    note?: string;

    status: {
        name: string;
        displayName: string;
        color: string;
    };

    edit?: {
        name: string;
        displayName: string;
        icon: string;
        id: string;
    };

    delete?: {
        name: string;
        displayName: string;
        icon: string;
        id: string;
    };

    view?: {
        name: string;
        displayName: string;
        id: string;
    };
}

export interface DealAnalytics {
    summary: {
        totalDeals: number;
        totalValue: number;
        active: number,
        activeValue: number,
        won: number,
        wonValue: number,
        loss: number,
        lossValue: number
        [key: string]: number;
    };
}

export interface DealAnalyticsCardsProps {
    analytics: DealAnalytics | null | undefined;
    loading?: boolean;
}

export interface DealListParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: number;
    search?: string;
    status?: string[];
    closeDate?: string;
    viewType?: "list" | "kanban";
}

export interface DealListResponse {
    viewType: "list" | "kanban";
    tools: Tool[];
    filter: Filter[];
    analytics: DealAnalytics;

    result: {
        tableHeader?: TableHeader[];
        tabs?: KanbanTab[];
        components: TableComponent[];
        search: boolean;
        list: boolean;
        kanban: boolean;
        pagination: boolean;
        data: DealData[];
        totalPages: number;
        currentPage: number;
        totalRecords: number;
    };
}