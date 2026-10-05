'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { Account, accountService } from '@/api/accounts';
import { Category, categoryService } from '@/api/categories';
import {
  Transaction,
  TransactionPayload,
  transactionService,
} from '@/api/transactions';
import { toDateInput } from '@/lib/format';
import { Pagination } from '@/types';

import {
  TransactionFilterValues,
  TransactionFormValues,
  emptyFilters,
} from './types';

const emptyForm = (): TransactionFormValues => ({
  accountId: '',
  categoryId: '',
  toAccountId: '',
  amount: '',
  transactionDate: toDateInput(),
  description: '',
});

export const useHooks = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
  });
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState<TransactionFilterValues>(emptyFilters);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [form, setForm] = useState<TransactionFormValues>(emptyForm);
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [deleting, setDeleting] = useState<Transaction | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // The chosen category decides whether this is income, expense or a transfer,
  // which in turn decides whether a destination account is required.
  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === form.categoryId),
    [categories, form.categoryId],
  );
  const isTransfer = selectedCategory?.type === 'transfer';

  const loadReferences = useCallback(async () => {
    const [accountsResponse, categoriesResponse] = await Promise.all([
      accountService.getAll(),
      categoryService.getAll(),
    ]);

    if (!accountsResponse.isError) setAccounts(accountsResponse.data.accounts);
    if (!categoriesResponse.isError) setCategories(categoriesResponse.data);
  }, []);

  // isLoading is raised by the handlers that trigger a refetch, never inside
  // the loader itself: a synchronous setState in an effect body costs an extra
  // render pass on every mount (react-hooks/set-state-in-effect).
  const loadTransactions = useCallback(async () => {
    const response = await transactionService.getAll({
      page,
      pageSize: 20,
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
      accountId: filters.accountId || undefined,
      categoryId: filters.categoryId || undefined,
      type: filters.type === 'all' ? undefined : filters.type,
      search: filters.search || undefined,
    });

    if (response.isError) {
      setError(response.errorMessage);
    } else {
      setError('');
      setTransactions(response.data.items);
      setPagination(response.data.pagination);
    }

    setIsLoading(false);
  }, [page, filters]);

  useEffect(() => {
    void loadReferences();
  }, [loadReferences]);

  useEffect(() => {
    void loadTransactions();
  }, [loadTransactions]);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    await loadTransactions();
  }, [loadTransactions]);

  const setFilter = useCallback(
    <K extends keyof TransactionFilterValues>(
      key: K,
      value: TransactionFilterValues[K],
    ) => {
      setIsLoading(true);
      // A changed filter invalidates the page number, so go back to the first
      // page rather than landing on one that no longer exists.
      setPage(1);
      setFilters((current) => ({ ...current, [key]: value }));
    },
    [],
  );

  const resetFilters = useCallback(() => {
    setIsLoading(true);
    setPage(1);
    setFilters(emptyFilters);
  }, []);

  const openCreate = useCallback(() => {
    setEditing(null);
    setForm(emptyForm());
    setFormError('');
    setIsFormOpen(true);
  }, []);

  const openEdit = useCallback((transaction: Transaction) => {
    setEditing(transaction);
    setForm({
      accountId: transaction.accountId,
      categoryId: transaction.categoryId,
      toAccountId: transaction.toAccountId ?? '',
      amount: transaction.amount,
      transactionDate: transaction.transactionDate,
      description: transaction.description ?? '',
    });
    setFormError('');
    setIsFormOpen(true);
  }, []);

  const setField = useCallback(
    <K extends keyof TransactionFormValues>(
      key: K,
      value: TransactionFormValues[K],
    ) => {
      setForm((current) => {
        const next = { ...current, [key]: value };
        // Switching away from a transfer category must drop the destination
        // account: the API rejects it on income and expense.
        if (key === 'categoryId') {
          const category = categories.find((item) => item.id === value);
          if (category?.type !== 'transfer') next.toAccountId = '';
        }
        return next;
      });
    },
    [categories],
  );

  const submit = useCallback(async () => {
    if (!form.accountId) {
      setFormError('Akun harus dipilih');
      return;
    }
    if (!form.categoryId) {
      setFormError('Kategori harus dipilih');
      return;
    }
    if (!form.amount || Number(form.amount) <= 0) {
      setFormError('Jumlah harus lebih besar dari 0');
      return;
    }
    if (isTransfer && !form.toAccountId) {
      setFormError('Akun tujuan harus dipilih untuk transaksi transfer');
      return;
    }
    if (isTransfer && form.toAccountId === form.accountId) {
      setFormError('Akun tujuan harus berbeda dengan akun sumber');
      return;
    }

    setIsSaving(true);
    setFormError('');

    const payload: TransactionPayload = {
      accountId: form.accountId,
      categoryId: form.categoryId,
      amount: form.amount,
      transactionDate: form.transactionDate,
      description: form.description.trim() || undefined,
      ...(isTransfer ? { toAccountId: form.toAccountId } : {}),
    };

    const response = editing
      ? await transactionService.update(editing.id, payload)
      : await transactionService.create(payload);

    setIsSaving(false);

    if (response.isError) {
      setFormError(response.errorMessage);
      return;
    }

    setIsFormOpen(false);
    // Balances moved, so the account list shown in the form is stale too.
    await Promise.all([loadTransactions(), loadReferences()]);
  }, [form, isTransfer, editing, loadTransactions, loadReferences]);

  const confirmDelete = useCallback(async () => {
    if (!deleting) return;

    setIsDeleting(true);
    const response = await transactionService.remove(deleting.id);
    setIsDeleting(false);
    setDeleting(null);

    if (response.isError) {
      setError(response.errorMessage);
      return;
    }

    await Promise.all([loadTransactions(), loadReferences()]);
  }, [deleting, loadTransactions, loadReferences]);

  const categoryOptions = useMemo(
    () =>
      filters.type === 'all'
        ? categories
        : categories.filter((category) => category.type === filters.type),
    [categories, filters.type],
  );

  return {
    data: {
      transactions,
      pagination,
      accounts,
      categories,
      categoryOptions,
      filters,
      page,
      isLoading,
      error,
      isFormOpen,
      editing,
      form,
      formError,
      isSaving,
      deleting,
      isDeleting,
      isTransfer,
      hasFilters:
        filters.type !== 'all' ||
        Boolean(
          filters.startDate ||
          filters.endDate ||
          filters.accountId ||
          filters.categoryId ||
          filters.search,
        ),
    },
    methods: {
      reload: refresh,
      setPage: (value: number) => {
        setIsLoading(true);
        setPage(value);
      },
      setFilter,
      resetFilters,
      openCreate,
      openEdit,
      setIsFormOpen,
      setField,
      submit,
      setDeleting,
      confirmDelete,
      dismissError: () => setError(''),
    },
  };
};
