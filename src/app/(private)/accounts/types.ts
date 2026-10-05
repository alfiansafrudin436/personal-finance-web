import { AccountType } from '@/types';

export interface AccountFormValues {
  name: string;
  type: AccountType;
  balance: string;
  currency: string;
}

export const emptyAccountForm: AccountFormValues = {
  name: '',
  type: 'cash',
  balance: '',
  currency: 'IDR',
};
