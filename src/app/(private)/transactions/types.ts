import { CategoryType } from '@/types';

export interface TransactionFormValues {
  accountId: string;
  categoryId: string;
  toAccountId: string;
  amount: string;
  transactionDate: string;
  description: string;
}

export interface TransactionFilterValues {
  startDate: string;
  endDate: string;
  accountId: string;
  categoryId: string;
  type: CategoryType | 'all';
  search: string;
}

export const emptyFilters: TransactionFilterValues = {
  startDate: '',
  endDate: '',
  accountId: '',
  categoryId: '',
  type: 'all',
  search: '',
};
