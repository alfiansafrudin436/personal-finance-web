'use client';

import { useCallback, useState } from 'react';

import { assistantService, ChatMessage } from '@/api/assistant';
import { toDateInput } from '@/lib/format';

export const SUGGESTIONS = [
  'Bagaimana kondisi keuanganku bulan ini?',
  'Kategori apa yang paling banyak menghabiskan uang bulan ini?',
  'Anggaran mana yang hampir habis?',
  'Bandingkan pengeluaranku 3 bulan terakhir.',
];

export const useHooks = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  const send = useCallback(
    async (text?: string) => {
      const content = (text ?? input).trim();
      if (!content || isSending) return;

      const next: ChatMessage[] = [...messages, { role: 'user', content }];
      setMessages(next);
      setInput('');
      setError('');
      setIsSending(true);

      const response = await assistantService.chat({
        messages: next,
        today: toDateInput(),
      });

      setIsSending(false);

      if (response.isError) {
        // The unanswered question is taken back out and returned to the input,
        // so a retry does not send it twice in a row.
        setMessages(messages);
        setInput(content);
        setError(response.errorMessage);
        return;
      }

      setMessages([
        ...next,
        { role: 'assistant', content: response.data.reply },
      ]);
    },
    [input, isSending, messages],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Enter sends, Shift+Enter starts a new line.
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        void send();
      }
    },
    [send],
  );

  const reset = useCallback(() => {
    setMessages([]);
    setInput('');
    setError('');
  }, []);

  return {
    data: {
      messages,
      input,
      isSending,
      error,
      suggestions: SUGGESTIONS,
    },
    methods: {
      setInput,
      send,
      handleKeyDown,
      reset,
      dismissError: () => setError(''),
    },
  };
};
