'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { Category, categoryService } from '@/api/categories';
import { CategoryType } from '@/types';

export interface CategoryFormValues {
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
}

const emptyForm: CategoryFormValues = {
  name: '',
  type: 'expense',
  icon: '',
  color: '',
};

export const useHooks = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [typeFilter, setTypeFilter] = useState<CategoryType | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<CategoryFormValues>(emptyForm);
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [deleting, setDeleting] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // isLoading is raised by the handlers that trigger a refetch, never inside
  // the loader itself: a synchronous setState in an effect body costs an extra
  // render pass on every mount (react-hooks/set-state-in-effect).
  const loadCategories = useCallback(async () => {
    const response = await categoryService.getAll();

    if (response.isError) {
      setError(response.errorMessage);
    } else {
      setError('');
      setCategories(response.data);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  // Filtering happens here rather than through the API so switching tabs does
  // not cost a request; the whole list is small and already loaded.
  const visibleCategories = useMemo(
    () =>
      typeFilter === 'all'
        ? categories
        : categories.filter((category) => category.type === typeFilter),
    [categories, typeFilter],
  );

  const refresh = useCallback(async () => {
    setIsLoading(true);
    await loadCategories();
  }, [loadCategories]);

  const openCreate = useCallback(() => {
    setEditing(null);
    setForm(emptyForm);
    setFormError('');
    setIsFormOpen(true);
  }, []);

  const openEdit = useCallback((category: Category) => {
    setEditing(category);
    setForm({
      name: category.name,
      type: category.type,
      icon: category.icon ?? '',
      color: category.color ?? '',
    });
    setFormError('');
    setIsFormOpen(true);
  }, []);

  const setField = useCallback(
    <K extends keyof CategoryFormValues>(
      key: K,
      value: CategoryFormValues[K],
    ) => {
      setForm((current) => ({ ...current, [key]: value }));
    },
    [],
  );

  const submit = useCallback(async () => {
    if (!form.name.trim()) {
      setFormError('Nama kategori harus diisi');
      return;
    }

    setIsSaving(true);
    setFormError('');

    const payload = {
      name: form.name.trim(),
      type: form.type,
      icon: form.icon.trim() || undefined,
      color: form.color.trim() || undefined,
    };

    const response = editing
      ? await categoryService.update(editing.id, payload)
      : await categoryService.create(payload);

    setIsSaving(false);

    if (response.isError) {
      setFormError(response.errorMessage);
      return;
    }

    setIsFormOpen(false);
    await loadCategories();
  }, [form, editing, loadCategories]);

  const confirmDelete = useCallback(async () => {
    if (!deleting) return;

    setIsDeleting(true);
    const response = await categoryService.remove(deleting.id);
    setIsDeleting(false);
    setDeleting(null);

    if (response.isError) {
      setError(response.errorMessage);
      return;
    }

    await loadCategories();
  }, [deleting, loadCategories]);

  return {
    data: {
      categories: visibleCategories,
      typeFilter,
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
      setTypeFilter,
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
