export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  rowCount: number;
  totalPages: number;
}
