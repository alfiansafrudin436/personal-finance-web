'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { Budget, budgetService } from '@/api/budgets';
import { Category, categoryService } from '@/api/categories';
import { toMonthInput, toNumber } from '@/lib/format';

export interface BudgetFormValues {
  categoryId: string;
  amount: string;
}

const emptyForm: BudgetFormValues = { categoryId: '', amount: '' };

export const useHooks = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [period, setPeriod] = useState(toMonthInput());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<Budget | null>(null);
  const [form, setForm] = useState<BudgetFormValues>(emptyForm);
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [deleting, setDeleting] = useState<Budget | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // isLoading is raised by the handlers that trigger a refetch, never inside
  // the loader itself: a synchronous setState in an effect body costs an extra
  // render pass on every mount (react-hooks/set-state-in-effect).
  const loadBudgets = useCallback(async () => {
    const response = await budgetService.getAll(period);

    if (response.isError) {
      setError(response.errorMessage);
    } else {
      setError('');
      setBudgets(response.data.budgets);
    }

    setIsLoading(false);
  }, [period]);

  const loadCategories = useCallback(async () => {
    // Only expenses can be budgeted; budgeting income is a target, not a cap.
    const response = await categoryService.getAll('expense');
    if (!response.isError) setCategories(response.data);
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    void loadBudgets();
  }, [loadBudgets]);

  const totals = useMemo(() => {
    const planned = budgets.reduce((sum, b) => sum + toNumber(b.amount), 0);
    const spent = budgets.reduce((sum, b) => sum + toNumber(b.spent), 0);
    return { planned, spent, remaining: planned - spent };
  }, [budgets]);

  // A category already budgeted this month would be replaced by the upsert,
  // so it is hidden from the create form to avoid a surprising overwrite.
  const availableCategories = useMemo(() => {
    if (editing) return categories;
    const taken = new Set(budgets.map((b) => b.categoryId));
    return categories.filter((category) => !taken.has(category.id));
  }, [categories, budgets, editing]);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    await loadBudgets();
  }, [loadBudgets]);

  const openCreate = useCallback(() => {
    setEditing(null);
    setForm(emptyForm);
    setFormError('');
    setIsFormOpen(true);
  }, []);

  const openEdit = useCallback((budget: Budget) => {
    setEditing(budget);
    setForm({ categoryId: budget.categoryId, amount: budget.amount });
    setFormError('');
    setIsFormOpen(true);
  }, []);

  const setField = useCallback(
    <K extends keyof BudgetFormValues>(key: K, value: BudgetFormValues[K]) => {
      setForm((current) => ({ ...current, [key]: value }));
    },
    [],
  );

  const submit = useCallback(async () => {
    if (!form.categoryId) {
      setFormError('Kategori harus dipilih');
      return;
    }
    if (!form.amount || Number(form.amount) <= 0) {
      setFormError('Jumlah anggaran harus lebih besar dari 0');
      return;
    }

    setIsSaving(true);
    setFormError('');

    const response = editing
      ? await budgetService.update(editing.id, form.amount)
      : await budgetService.save({
          categoryId: form.categoryId,
          amount: form.amount,
          period,
        });

    setIsSaving(false);

    if (response.isError) {
      setFormError(response.errorMessage);
      return;
    }

    setIsFormOpen(false);
    await loadBudgets();
  }, [form, editing, period, loadBudgets]);

  const confirmDelete = useCallback(async () => {
    if (!deleting) return;

    setIsDeleting(true);
    const response = await budgetService.remove(deleting.id);
    setIsDeleting(false);
    setDeleting(null);

    if (response.isError) {
      setError(response.errorMessage);
      return;
    }

    await loadBudgets();
  }, [deleting, loadBudgets]);

  return {
    data: {
      budgets,
      categories: availableCategories,
      period,
      totals,
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
      setPeriod: (value: string) => {
        setIsLoading(true);
        setPeriod(value);
      },
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
