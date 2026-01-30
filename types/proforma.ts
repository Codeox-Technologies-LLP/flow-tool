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


export interface ProformaStatus {
  name: string;
  displayName: string;
  color: string;
}


export interface ProformaAction {
  name: string;
  displayName: string;
  icon?: string;
  id: string;
}


export interface RelatedEntity {
  id: string;
  name: string;
}


export interface ProformaData extends Record<string, unknown> {
  id: string;
  proformaId: string;

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

  status: ProformaStatus;

  edit?: ProformaAction;
  delete?: ProformaAction;
  view?: ProformaAction;
}


export interface ProformaFilterOption {
  name: string;
  displayName: string;
  data: string[];
  type: "radio" | "checkbox";
}

export interface ProformaFilter {
  name: string;
  displayName: string;
  icon: string;
  diffFilter: ProformaFilterOption[];
}


export interface ProformaListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: number;
  search?: string;
  status?: string | string[];
  closeDate?: string;
}


export interface ProformaListResponse {
  result: {
    tableHeader: TableHeader[];
    components: TableComponent[];
    search: boolean;
    pagination: boolean;
    data: ProformaData[];
    totalPages: number;
    currentPage: number;
    totalRecords: number;
  };
  tools: Tool[];
  filter?: ProformaFilter[];
}
