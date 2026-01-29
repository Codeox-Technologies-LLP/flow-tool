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


export interface ContactClientData {
  _id: string | null;
  name: string;
}

export interface ContactAction {
  name: string;
  icon: string;
  displayName: string;
  id: string;
}

export interface ContactData extends Record<string, unknown> {
  id: string;
  name: string;
  phone: string;
  email: string;

  clientData?: ContactClientData;

  edit?: ContactAction;
  delete?: ContactAction;
  view?: ContactAction;
}


export interface ContactListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: number;
  search?: string;
  clientId?: string;
}


export interface ContactListResponse {
  tools: Tool[];
  filter?: unknown[];
  result: {
    tableHeader: TableHeader[];
    components: TableComponent[];
    search: boolean;
    pagination: boolean;
    data: ContactData[];
    totalPages: number;
    currentPage: number;
    totalRecords: number;
  };
}
