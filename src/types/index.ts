export type Response<T> = {
  data: T;
  isError: boolean;
  code: number;
  errorMessage: string;
};

/** Shape the Go API wraps every successful payload in. */
export type ApiEnvelope<T> = {
  status: number;
  data: T;
};

/** Shape the Go API returns on a validation or business error. */
export type ApiError = {
  location?: string;
  msg: string;
  path?: string;
  type?: string;
  value?: string;
};

export type ApiErrorEnvelope = {
  errors: ApiError[];
};

export type AccountType =
  | 'cash'
  | 'bank'
  | 'e_wallet'
  | 'credit_card'
  | 'investment';

export type CategoryType = 'income' | 'expense' | 'transfer';

export type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type Paginated<T> = {
  items: T[];
  pagination: Pagination;
};
