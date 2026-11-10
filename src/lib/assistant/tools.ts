import axios, { AxiosInstance } from 'axios';
import { betaZodTool } from '@anthropic-ai/sdk/helpers/beta/zod';
import { z } from 'zod';

import { request } from '@/lib/api-response';

/**
 * Tools the assistant uses to read the signed-in user's data from the Go API.
 * They run inside the Next.js route handler, where the services in src/api
 * cannot be reused: those read the token from localStorage, which only exists
 * in the browser. So each request builds its own client carrying the token the
 * browser forwarded, and every tool is read-only — the assistant can explain
 * the data but never changes it.
 */

const API_URL =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  'http://localhost:9000/api';

export const createServerApiClient = (token: string): AxiosInstance =>
  axios.create({
    baseURL: API_URL,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .describe('Tanggal dalam format YYYY-MM-DD');

const rangeSchema = {
  startDate: date.optional(),
  endDate: date.optional(),
};

/** Drops empty values so they do not reach the API as blank query params. */
const compact = (params: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== '',
    ),
  );

export const createAssistantTools = (client: AxiosInstance) => {
  // A failed call is thrown so the tool runner hands it back to the model as
  // an error result, which lets it explain the problem instead of guessing.
  const get = async (url: string, params: Record<string, unknown> = {}) => {
    const response = await request<unknown>(() =>
      client.get(url, { params: compact(params) }),
    );
    if (response.isError) throw new Error(response.errorMessage);
    return JSON.stringify(response.data);
  };

  return [
    betaZodTool({
      name: 'get_dashboard',
      description:
        'Ringkasan keuangan saat ini: total saldo, pemasukan/pengeluaran bulan berjalan, saldo per akun, 5 kategori pengeluaran terbesar bulan ini, 5 transaksi terbaru, dan tren 6 bulan. Panggil ini dulu untuk pertanyaan umum.',
      inputSchema: z.object({}),
      run: () => get('/reports/dashboard'),
    }),

    betaZodTool({
      name: 'get_summary',
      description:
        'Total pemasukan, pengeluaran, selisih (net), dan jumlah transaksi untuk rentang tanggal. Tanpa tanggal, API memakai bulan berjalan.',
      inputSchema: z.object(rangeSchema),
      run: (input) => get('/reports/summary', input),
    }),

    betaZodTool({
      name: 'get_category_breakdown',
      description:
        'Total per kategori untuk rentang tanggal, untuk pemasukan atau pengeluaran. Gunakan untuk pertanyaan seperti "paling banyak habis di mana".',
      inputSchema: z.object({
        ...rangeSchema,
        type: z.enum(['income', 'expense']).default('expense'),
      }),
      run: (input) => get('/reports/by-category', input),
    }),

    betaZodTool({
      name: 'get_monthly_trend',
      description:
        'Pemasukan, pengeluaran, dan net per bulan untuk N bulan terakhir.',
      inputSchema: z.object({
        months: z.number().int().min(1).max(24).default(6),
      }),
      run: (input) => get('/reports/trend', input),
    }),

    betaZodTool({
      name: 'list_accounts',
      description:
        'Daftar akun (tunai, bank, e-wallet, kartu kredit, investasi) beserta saldo, mata uang, dan id-nya.',
      inputSchema: z.object({
        includeArchived: z.boolean().default(false),
      }),
      run: (input) => get('/accounts', input),
    }),

    betaZodTool({
      name: 'list_categories',
      description:
        'Daftar kategori milik pengguna dan kategori global, beserta id dan tipenya.',
      inputSchema: z.object({
        type: z.enum(['income', 'expense', 'transfer']).optional(),
      }),
      run: (input) => get('/categories', input),
    }),

    betaZodTool({
      name: 'list_budgets',
      description:
        'Anggaran per kategori untuk satu bulan, dengan jumlah terpakai dan sisa.',
      inputSchema: z.object({
        period: z
          .string()
          .regex(/^\d{4}-\d{2}$/)
          .optional()
          .describe('Bulan dalam format YYYY-MM; kosong berarti bulan ini'),
      }),
      run: (input) => get('/budgets', input),
    }),

    betaZodTool({
      name: 'search_transactions',
      description:
        'Cari transaksi dengan filter tanggal, tipe, akun, kategori, atau kata kunci di deskripsi. Hasil berhalaman; lihat pagination.totalPages untuk mengambil halaman berikutnya. accountId dan categoryId diambil dari list_accounts / list_categories.',
      inputSchema: z.object({
        ...rangeSchema,
        type: z.enum(['income', 'expense', 'transfer']).optional(),
        accountId: z.string().optional(),
        categoryId: z.string().optional(),
        search: z.string().optional(),
        page: z.number().int().min(1).default(1),
        pageSize: z.number().int().min(1).max(50).default(20),
      }),
      run: (input) => get('/transactions', input),
    }),
  ];
};
