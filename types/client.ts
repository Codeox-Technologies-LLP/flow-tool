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

export interface Address {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
}

export interface Contact {
    name?: string;
    email?: string;
    phone?: string;
}

export interface ClientData extends Record<string, unknown> {
    id: string;
    client: string;
    name: string;
    email?: string;
    source?: string;
    type?: string;
    owner?: string;
    billingAddress?: Address;
    deliveryAddresses?: Address[];
    contacts?: Contact[];
    edit?: unknown;
    delete?: unknown;
    view?: unknown;
}


export interface ClientFilter {
    name: string;
    displayName: string;
    icon: string;
    diffFilter: Array<{
        name: string;
        displayName: string;
        data: string[];
        type: "checkbox" | "radio";
    }>;
}

export interface ClientListParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: number;
    source?: string[];
    type?: string[];
}


export interface ClientListResponse {
    tools?: Tool[];
    filter?: ClientFilter[];
    result: {
        tableHeader: TableHeader[];
        search: boolean;
        pagination: boolean;
        components: TableComponent[];
        data: ClientData[];
        totalPages: number;
        currentPage: number;
        totalRecords: number;
    };
}
