'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface IConfirmDialog {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
}

const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Hapus',
  isLoading = false,
  onConfirm,
}: IConfirmDialog) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className='max-w-sm'>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        {description && <DialogDescription>{description}</DialogDescription>}
      </DialogHeader>
      <DialogFooter>
        <Button
          type='button'
          variant='outline'
          onClick={() => onOpenChange(false)}
          disabled={isLoading}
        >
          Batal
        </Button>
        <Button
          type='button'
          variant='destructive'
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? 'Memproses...' : confirmLabel}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default ConfirmDialog;
