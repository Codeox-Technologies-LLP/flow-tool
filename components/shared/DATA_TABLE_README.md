# Generic Data Table Component

A reusable data table component that works with the standardized API response format across all list endpoints.

## Features

- ✅ Dynamic table headers and columns
- ✅ Built-in search functionality
- ✅ Pagination with controls
- ✅ Sortable columns
- ✅ Action buttons (edit, delete, view)
- ✅ Custom tool buttons
- ✅ Loading states with skeletons
- ✅ Error handling
- ✅ Empty state display
- ✅ Responsive design

## API Response Format

The component expects responses in this format:

```json
{
  "status": true,
  "message": "Success",
  "tools": [
    {
      "name": "create",
      "displayName": "Add Item",
      "icon": "create",
      "bgColor": "#223458",
      "txtColor": "#fff",
      "width": "130px"
    }
  ],
  "filter": [],
  "result": {
    "tableHeader": [
      {
        "name": "name",
        "displayName": "Name",
        "sort": true,
        "sortOrder": 1
      }
    ],
    "search": true,
    "pagination": true,
    "components": [
      {
        "name": "name",
        "displayName": "Name",
        "component": "text"
      },
      {
        "name": "edit",
        "displayName": "Edit",
        "component": "action"
      }
    ],
    "data": [
      {
        "id": "123",
        "name": "Example",
        "edit": {
          "name": "edit",
          "icon": "edit.svg",
          "displayName": "Edit",
          "id": "123"
        }
      }
    ],
    "totalPages": 1,
    "currentPage": 1,
    "totalRecords": 10
  }
}
```

## Usage Example

```tsx
import { DataTable } from "@/components/shared/data-table";
import { yourApi } from "@/lib/api/your-api";

export default function YourPage() {
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await yourApi.list({ page: 1, limit: 10 });
      if (response.status) {
        setApiResponse(response);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DataTable
      title="Your Title"
      description="Your description"
      tools={apiResponse?.tools || []}
      tableHeaders={apiResponse?.result?.tableHeader || []}
      components={apiResponse?.result?.components || []}
      data={apiResponse?.result?.data || []}
      loading={loading}
      error={error}
      searchable={apiResponse?.result?.search ?? true}
      pageable={apiResponse?.result?.pagination ?? true}
      totalPages={apiResponse?.result?.totalPages || 1}
      currentPage={apiResponse?.result?.currentPage || 1}
      totalRecords={apiResponse?.result?.totalRecords || 0}
      onSearch={handleSearch}
      onPageChange={handlePageChange}
      onSort={handleSort}
      onAction={handleAction}
      onToolClick={handleToolClick}
    />
  );
}
```

## Component Types

### Text Component
Default display for text data:
```json
{
  "name": "fieldName",
  "displayName": "Field Name",
  "component": "text"
}
```

### Action Component
Displays action buttons (edit, delete, view):
```json
{
  "name": "edit",
  "displayName": "Edit",
  "component": "action"
}
```

Data format:
```json
{
  "edit": {
    "name": "edit",
    "icon": "edit.svg",
    "displayName": "Edit",
    "id": "itemId"
  }
}
```

### Custom Component
For custom rendering, use the `renderCustomCell` prop:
```tsx
<DataTable
  {...props}
  renderCustomCell={(item, component) => {
    if (component.name === "status") {
      return <Badge>{item.status}</Badge>;
    }
    return null;
  }}
/>
```

## Event Handlers

### onSearch
Called when search input changes:
```tsx
const handleSearch = (query: string) => {
  setSearchQuery(query);
  setPage(1);
};
```

### onPageChange
Called when page changes:
```tsx
const handlePageChange = (newPage: number) => {
  setPage(newPage);
};
```

### onSort
Called when column header is clicked:
```tsx
const handleSort = (field: string, order: number) => {
  setSortBy(field);
  setSortOrder(order); // 1 for ascending, -1 for descending
};
```

### onAction
Called when action button is clicked:
```tsx
const handleAction = (action: string, id: string) => {
  if (action === "delete") {
    // Handle delete
  } else if (action === "edit") {
    // Handle edit
  }
};
```

### onToolClick
Called when tool button is clicked:
```tsx
const handleToolClick = (toolName: string) => {
  if (toolName === "create") {
    // Navigate to create page
  }
};
```

## Styling

The component uses Tailwind CSS and shadcn/ui components. Customize by:
- Modifying the component's className props
- Using shadcn/ui theming
- Overriding with custom CSS

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| title | string | Yes | Table title |
| description | string | No | Table description |
| tools | Tool[] | No | Action buttons in header |
| tableHeaders | TableHeader[] | Yes | Column headers |
| components | TableComponent[] | Yes | Column definitions |
| data | any[] | Yes | Table data |
| loading | boolean | No | Loading state |
| error | string \| null | No | Error message |
| searchable | boolean | No | Enable search |
| pageable | boolean | No | Enable pagination |
| totalPages | number | No | Total pages |
| currentPage | number | No | Current page |
| totalRecords | number | No | Total records |
| onSearch | (query: string) => void | No | Search handler |
| onPageChange | (page: number) => void | No | Page change handler |
| onSort | (field: string, order: number) => void | No | Sort handler |
| onAction | (action: string, id: string) => void | No | Action handler |
| onToolClick | (toolName: string) => void | No | Tool click handler |
| renderCustomCell | (item: any, component: TableComponent) => ReactNode | No | Custom cell renderer |
