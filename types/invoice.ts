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


export interface InvoiceStatus {
  name: string;
  displayName: string;
  color: string;
}


export interface InvoiceAction {
  name: string;
  displayName: string;
  icon?: string;
  id: string;
}


export interface RelatedEntity {
  id: string;
  name: string;
}


export interface InvoiceData extends Record<string, unknown> {
  id: string;
  invoiceId: string;

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

  status: InvoiceStatus;

  edit?: InvoiceAction;
  delete?: InvoiceAction;
  view?: InvoiceAction;
}


export interface InvoiceFilterOption {
  name: string;
  displayName: string;
  data: string[];
  type: "radio" | "checkbox";
}

export interface InvoiceFilter {
  name: string;
  displayName: string;
  icon: string;
  diffFilter: InvoiceFilterOption[];
}


export interface InvoiceListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: number;
  search?: string;
  status?: string | string[];
  closeDate?: string;
}


export interface InvoiceListResponse {
  result: {
    tableHeader: TableHeader[];
    components: TableComponent[];
    search: boolean;
    pagination: boolean;
    data: InvoiceData[];
    totalPages: number;
    currentPage: number;
    totalRecords: number;
  };
  tools: Tool[];
  filter?: InvoiceFilter[];
}
