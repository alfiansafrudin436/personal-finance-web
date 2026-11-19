'use client';

import { IconRefresh, IconSend, IconSparkles } from '@tabler/icons-react';

import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

import { useHooks } from './hooks';

const AssistantPage = () => {
  const { data, methods } = useHooks();

  return (
    // Fills the viewport below the 3.5rem header, minus the main padding, so
    // the conversation scrolls while the input stays in place.
    <div className='flex h-[calc(100svh-5.5rem)] flex-col md:h-[calc(100svh-6.5rem)]'>
      <PageHeader
        title='Asisten AI'
        description='Tanyakan apa saja tentang saldo, transaksi, anggaran, dan laporanmu.'
        action={
          data.messages.length > 0 && (
            <Button
              variant='outline'
              onClick={methods.reset}
              disabled={data.isSending}
            >
              <IconRefresh />
              Percakapan baru
            </Button>
          )
        }
      />

      {/* column-reverse anchors the scroll position to the bottom, so new
          messages stay in view without scrolling from JS. */}
      <div className='flex min-h-0 flex-1 flex-col-reverse overflow-y-auto rounded-xl border border-border bg-card p-4'>
        {data.messages.length === 0 ? (
          <div className='flex flex-1 flex-col items-center justify-center gap-4 text-center'>
            <span className='flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary'>
              <IconSparkles className='h-6 w-6' />
            </span>
            <div>
              <p className='font-medium'>Mulai dengan pertanyaan</p>
              <p className='mt-1 max-w-sm text-sm text-muted-foreground'>
                Asisten membaca data keuanganmu untuk menjawab. Ia tidak bisa
                mengubah atau menghapus data.
              </p>
            </div>
            <div className='flex max-w-xl flex-wrap justify-center gap-2'>
              {data.suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type='button'
                  onClick={() => void methods.send(suggestion)}
                  className='rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground'
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <ul className='space-y-4' aria-live='polite'>
            {data.messages.map((message, index) => (
              <li
                key={index}
                className={cn(
                  'flex',
                  message.role === 'user' ? 'justify-end' : 'justify-start',
                )}
              >
                <div
                  className={cn(
                    'max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground',
                  )}
                >
                  {message.content}
                </div>
              </li>
            ))}
            {data.isSending && (
              <li className='flex justify-start'>
                <div className='rounded-2xl bg-muted px-4 py-2.5 text-sm text-muted-foreground'>
                  Sedang menganalisis data...
                </div>
              </li>
            )}
          </ul>
        )}
      </div>

      {data.error && (
        <div
          role='alert'
          className='mt-3 flex items-start justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive'
        >
          <span>{data.error}</span>
          <button
            type='button'
            onClick={methods.dismissError}
            className='shrink-0 font-medium underline'
          >
            Tutup
          </button>
        </div>
      )}

      <form
        className='mt-3 flex items-end gap-2'
        onSubmit={(event) => {
          event.preventDefault();
          void methods.send();
        }}
      >
        <Textarea
          aria-label='Pertanyaan untuk asisten'
          value={data.input}
          onChange={(event) => methods.setInput(event.target.value)}
          onKeyDown={methods.handleKeyDown}
          placeholder='Contoh: berapa total pengeluaran makan bulan ini?'
          maxLength={4000}
          rows={2}
          className='min-h-[52px] resize-none'
        />
        <Button
          type='submit'
          size='icon'
          aria-label='Kirim'
          disabled={data.isSending || !data.input.trim()}
        >
          <IconSend />
        </Button>
      </form>
    </div>
  );
};

export default AssistantPage;
