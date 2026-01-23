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

export interface OperationTypeData extends Record<string, unknown> {
  _id: string;
  operationTypeId: string;
  vendorId: string;
  name: string;
  sourceLocation: string;
  destinationLocation: string;
  type: number;
  edit?: unknown;
  delete?: unknown;
  view?: unknown;
}


export interface OperationTypeListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: number;
  search?: string;
}

export interface OperationTypeListResponse {
  tools: Tool[];
  filter?: unknown[];
  result: {
    tableHeader: TableHeader[];
    components: TableComponent[];
    search: boolean;
    pagination: boolean;
    data: OperationTypeData[];
    totalPages: number;
    currentPage: number;
    totalRecords: number;
  };
}
