import type { ApiResponse } from "./mock";

export type PaginatedResponse<T> = ApiResponse<{
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}>;

// Form Types
export type ComboboxItem = {
  id: string;
  name: string;
  value: string;
};

export enum SortOrder {
  Asc = "asc",
  Desc = "desc",
}
