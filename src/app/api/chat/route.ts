import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';

import { request } from '@/lib/api-response';
import { ASSISTANT_SYSTEM_PROMPT } from '@/lib/assistant/prompt';
import {
  createAssistantTools,
  createServerApiClient,
} from '@/lib/assistant/tools';

/**
 * POST /api/chat — the AI assistant. Runs on the server because the Anthropic
 * key must never reach the browser. The browser forwards the user's JWT; it is
 * checked against the Go API first, then handed to the tools so the assistant
 * only ever sees the signed-in user's own data.
 *
 * Answers in the same `{ status, data }` / `{ errors }` envelope as the Go API,
 * so src/lib/api-response.ts unwraps it like any other call.
 */

export const maxDuration = 60;

const MODEL = 'claude-opus-5-5';
/** Older turns are dropped so a long chat does not grow without bound. */
const MAX_HISTORY = 20;
/** Upper bound on tool round-trips for one answer. */
const MAX_ITERATIONS = 8;

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().trim().min(1).max(4000),
      }),
    )
    .min(1)
    .max(100),
  /** The user's local date, so "bulan ini" means their month, not the server's. */
  today: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

// Created on first use rather than at import, so a missing key surfaces as a
// clear error from this route instead of failing the build.
let anthropic: Anthropic | undefined;
const getAnthropic = () => (anthropic ??= new Anthropic());

const fail = (status: number, msg: string) =>
  Response.json({ errors: [{ msg }] }, { status });

const ok = (reply: string) =>
  Response.json({ status: 200, data: { reply } }, { status: 200 });

export async function POST(req: Request) {
  const token = req.headers
    .get('authorization')
    ?.replace(/^Bearer\s+/i, '')
    .trim();
  if (!token) return fail(401, 'Sesi tidak valid, silakan masuk lagi');

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail(400, 'Pesan tidak valid');

  const client = createServerApiClient(token);
  const me = await request<unknown>(() => client.get('/users/me'));
  if (me.isError) {
    return me.code === 401
      ? fail(401, 'Sesi tidak valid, silakan masuk lagi')
      : fail(502, 'Layanan data sedang tidak dapat dihubungi');
  }

  const history = parsed.data.messages.slice(-MAX_HISTORY);
  // The API requires the conversation to open with a user turn.
  const firstUser = history.findIndex((message) => message.role === 'user');
  if (firstUser === -1 || history[history.length - 1].role !== 'user') {
    return fail(400, 'Pesan terakhir harus dari pengguna');
  }

  const today = parsed.data.today ?? new Date().toISOString().slice(0, 10);
  const messages: Anthropic.Beta.BetaMessageParam[] = history
    .slice(firstUser)
    .map((message, index) =>
      // The date rides on the opening turn rather than the system prompt, so
      // the system prompt stays identical across requests and keeps caching.
      index === 0
        ? {
            role: message.role,
            content: [
              { type: 'text', text: `Tanggal hari ini: ${today}` },
              { type: 'text', text: message.content },
            ],
          }
        : { role: message.role, content: message.content },
    );

  try {
    const final = await getAnthropic().beta.messages.toolRunner({
      model: MODEL,
      max_tokens: 16000,
      max_iterations: MAX_ITERATIONS,
      output_config: { effort: 'medium' },
      // On a policy decline the API retries on a fallback model it picks.
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: [
        {
          type: 'text',
          text: ASSISTANT_SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      tools: createAssistantTools(client),
      messages,
    });

    if (final.stop_reason === 'refusal') {
      return ok('Maaf, saya tidak bisa membantu permintaan itu.');
    }

    const reply = final.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n\n')
      .trim();

    // Hitting the iteration cap leaves the last turn as a tool call, not text.
    return ok(
      reply ||
        'Maaf, saya belum bisa menyusun jawaban. Coba ajukan pertanyaan yang lebih spesifik.',
    );
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return fail(429, 'Asisten sedang sibuk, coba lagi sebentar lagi');
    }
    if (error instanceof Anthropic.AuthenticationError) {
      console.error('Anthropic API key missing or invalid', error.message);
      return fail(500, 'Asisten belum dikonfigurasi');
    }
    if (error instanceof Anthropic.APIError) {
      console.error(`Anthropic API error ${error.status}`, error.message);
      return fail(502, 'Asisten sedang tidak tersedia');
    }
    console.error('Assistant request failed', error);
    return fail(500, 'Asisten belum dikonfigurasi atau sedang bermasalah');
  }
}
