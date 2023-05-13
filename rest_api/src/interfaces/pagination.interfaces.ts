export interface IPagination {
  page: number;
  pageSize: number;
}

export interface IPaginationResponse<T> {
  page: number;
  pageSize: number;
  records: T[];
  numRecords: number;
}