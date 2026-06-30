export type Response<T> = {
  data: T;
  isError: boolean;
  code: number;
  errorMessage: string;
};
