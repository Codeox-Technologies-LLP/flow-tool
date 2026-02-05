export interface TableHeader {
  name: string;
  displayName: string;
  sort?: boolean;
  sortOrder?: number;
}

export interface TableComponent {
  name: string;
  displayName: string;
  component: "text" | "action" | "badge" | "custom" | "number" | "currency" | "status" | "date";
}

export interface ActionItem {
  name: string;
  icon: string;
  displayName: string;
  id: string;
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

export interface DataTableProps {
  title: string;
  description?: string;
  tools?: Tool[];
  tableHeaders: TableHeader[];
  components: TableComponent[];
  data: Record<string, unknown>[];
  loading?: boolean;
  searching?: boolean;
  error?: string | null;
  searchable?: boolean;
  pageable?: boolean;
  totalPages?: number;
  currentPage?: number;
  totalRecords?: number;
  onSearch?: (query: string) => void;
  onPageChange?: (page: number) => void;
  onSort?: (field: string, order: number) => void;
  onAction?: (action: string, id: string) => void;
  onToolClick?: (toolName: string) => void;
  renderCustomCell?: (item: Record<string, unknown>, component: TableComponent) => React.ReactNode;
}
