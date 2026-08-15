export interface ApiResponse<T> {
  data: T;
  isSuccess: boolean;
  status: string;
  message: string;
  errors: string[];
}
