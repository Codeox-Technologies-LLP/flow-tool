export interface TableHeader {
  name: string;
  displayName: string;
  sort?: boolean;
  sortOrder?: number;
}

export interface TableComponent {
  name: string;
  displayName: string;
  component: "text" | "action" | "badge" | "custom" | "number" | "currency" | "status";
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


export interface DeliveryStatus {
  name: string;
  displayName: string;
  color: string;
}


export interface DeliveryAction {
  name: string;
  displayName: string;
  icon?: string;
  id: string;
}


export interface RelatedEntity {
  id: string;
  name: string;
}


export interface DeliveryData extends Record<string, unknown> {
  id: string;
  deliveryId: string;

  clientName: string;
  relatedTo: RelatedEntity;

  contactId: string;
  contactData: RelatedEntity;

  totalProducts: number;
  amount: number;
  expiryDate: string;

  quotationId?: string;
  locationId?: string;

  billingAddress?: unknown;
  deliveryAddress?: unknown;

  assignedTo: RelatedEntity;

  products?: unknown[];

  status: DeliveryStatus;

  edit?: DeliveryAction;
  delete?: DeliveryAction;
  view?: DeliveryAction;
}


export interface DeliveryFilterOption {
  name: string;
  displayName: string;
  data: string[];
  type: "radio" | "checkbox";
}

export interface DeliveryFilter {
  name: string;
  displayName: string;
  icon: string;
  diffFilter: DeliveryFilterOption[];
}


export interface DeliveryListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: number;
  search?: string;
  status?: string | string[];
  closeDate?: string;
}


export interface DeliveryListResponse {
  result: {
    tableHeader: TableHeader[];
    components: TableComponent[];
    search: boolean;
    pagination: boolean;
    data: DeliveryData[];
    totalPages: number;
    currentPage: number;
    totalRecords: number;
  };
  tools: Tool[];
  filter?: DeliveryFilter[];
}
