'use client';

import { useCallback, useEffect, useState } from 'react';

import { Account, accountService } from '@/api/accounts';
import { AccountType } from '@/types';

import { AccountFormValues, emptyAccountForm } from './types';

export const useHooks = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [totalBalance, setTotalBalance] = useState('0');
  const [includeArchived, setIncludeArchived] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<Account | null>(null);
  const [form, setForm] = useState<AccountFormValues>(emptyAccountForm);
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [deleting, setDeleting] = useState<Account | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // isLoading is raised by the handlers that trigger a refetch, never inside
  // the loader itself: a synchronous setState in an effect body costs an extra
  // render pass on every mount (react-hooks/set-state-in-effect).
  const loadAccounts = useCallback(async () => {
    const response = await accountService.getAll(includeArchived);

    if (response.isError) {
      setError(response.errorMessage);
    } else {
      setError('');
      setAccounts(response.data.accounts);
      setTotalBalance(response.data.totalBalance);
    }

    setIsLoading(false);
  }, [includeArchived]);

  useEffect(() => {
    void loadAccounts();
  }, [loadAccounts]);

  // Used by retry buttons, where the spinner should come back.
  const refresh = useCallback(async () => {
    setIsLoading(true);
    await loadAccounts();
  }, [loadAccounts]);

  const openCreate = useCallback(() => {
    setEditing(null);
    setForm(emptyAccountForm);
    setFormError('');
    setIsFormOpen(true);
  }, []);

  const openEdit = useCallback((account: Account) => {
    setEditing(account);
    setForm({
      name: account.name,
      type: account.type,
      // The balance follows from the transactions, so editing shows it
      // read-only and sends it unchanged.
      balance: account.balance,
      currency: account.currency,
    });
    setFormError('');
    setIsFormOpen(true);
  }, []);

  const setField = useCallback(
    <K extends keyof AccountFormValues>(
      key: K,
      value: AccountFormValues[K],
    ) => {
      setForm((current) => ({ ...current, [key]: value }));
    },
    [],
  );

  const submit = useCallback(async () => {
    if (!form.name.trim()) {
      setFormError('Nama akun harus diisi');
      return;
    }

    setIsSaving(true);
    setFormError('');

    const payload = {
      name: form.name.trim(),
      type: form.type as AccountType,
      currency: form.currency || 'IDR',
      ...(editing ? {} : { balance: form.balance || '0' }),
    };

    const response = editing
      ? await accountService.update(editing.id, payload)
      : await accountService.create(payload);

    setIsSaving(false);

    if (response.isError) {
      setFormError(response.errorMessage);
      return;
    }

    setIsFormOpen(false);
    await loadAccounts();
  }, [form, editing, loadAccounts]);

  const toggleArchive = useCallback(
    async (account: Account) => {
      const response = account.isArchived
        ? await accountService.unarchive(account.id)
        : await accountService.archive(account.id);

      if (response.isError) {
        setError(response.errorMessage);
        return;
      }

      await loadAccounts();
    },
    [loadAccounts],
  );

  const confirmDelete = useCallback(async () => {
    if (!deleting) return;

    setIsDeleting(true);
    const response = await accountService.remove(deleting.id);
    setIsDeleting(false);

    if (response.isError) {
      // An account with transactions cannot be deleted, only archived; the
      // API says so and that message belongs in front of the user.
      setError(response.errorMessage);
      setDeleting(null);
      return;
    }

    setDeleting(null);
    await loadAccounts();
  }, [deleting, loadAccounts]);

  return {
    data: {
      accounts,
      totalBalance,
      includeArchived,
      isLoading,
      error,
      isFormOpen,
      editing,
      form,
      formError,
      isSaving,
      deleting,
      isDeleting,
    },
    methods: {
      reload: refresh,
      setIncludeArchived: (value: boolean) => {
        setIsLoading(true);
        setIncludeArchived(value);
      },
      openCreate,
      openEdit,
      setIsFormOpen,
      setField,
      submit,
      toggleArchive,
      setDeleting,
      confirmDelete,
      dismissError: () => setError(''),
    },
  };
};
