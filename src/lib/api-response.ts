import { ApiError, Response } from '@/types';

/**
 * The Go API answers `{ status, data }` on success and `{ errors: [{ msg }] }`
 * on failure. These helpers are the single place that knows that, so every
 * service in src/api stays a thin call plus a type.
 */

type AxiosLikeError = {
  response?: {
    status?: number;
    data?: { errors?: ApiError[]; message?: string };
  };
  message?: string;
};

const DEFAULT_ERROR = 'Terjadi kesalahan, silakan coba lagi';

/** Pulls the first readable message out of an API error response. */
export const extractErrorMessage = (error: unknown): string => {
  const err = error as AxiosLikeError;
  const errors = err.response?.data?.errors;

  if (errors?.length) {
    return errors.map((e) => e.msg).join(', ');
  }

  return err.response?.data?.message ?? err.message ?? DEFAULT_ERROR;
};

/** Field-level errors, keyed by the `path` the API reported them against. */
export const extractFieldErrors = (error: unknown): Record<string, string> => {
  const err = error as AxiosLikeError;
  const fieldErrors: Record<string, string> = {};

  for (const e of err.response?.data?.errors ?? []) {
    if (e.path && !fieldErrors[e.path]) {
      fieldErrors[e.path] = e.msg;
    }
  }

  return fieldErrors;
};

/**
 * Unwraps the envelope around a successful response. `data` is read defensively
 * because a handful of endpoints answer with a bare value rather than an object.
 */
export const toSuccess = <T>(raw: unknown, code = 200): Response<T> => {
  const envelope = raw as { data?: T } | undefined;
  return {
    data: (envelope && 'data' in envelope ? envelope.data : raw) as T,
    isError: false,
    code,
    errorMessage: '',
  };
};

export const toFailure = <T>(error: unknown): Response<T> => {
  const err = error as AxiosLikeError;
  return {
    data: null as never,
    isError: true,
    code: err.response?.status ?? 500,
    errorMessage: extractErrorMessage(error),
  };
};

/**
 * Runs a request and normalizes both outcomes into `Response<T>`, so callers
 * branch on `isError` instead of writing try-catch in every service.
 */
export const request = async <T>(
  call: () => Promise<{ data: unknown; status: number }>,
): Promise<Response<T>> => {
  try {
    const response = await call();
    return toSuccess<T>(response.data, response.status);
  } catch (error: unknown) {
    return toFailure<T>(error);
  }
};
