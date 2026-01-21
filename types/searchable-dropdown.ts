export interface DropdownOption {
  _id: string;
  name: string;
  disabled?: boolean;
}

export interface SearchableDropdownProps {
  options?: DropdownOption[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  className?: string;
  allowClear?: boolean;
  loading?: boolean;
  error?: boolean;
  helperText?: string;
}
