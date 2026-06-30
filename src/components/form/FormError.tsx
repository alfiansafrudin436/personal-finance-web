import { cn } from '@/lib/utils';

export interface FormErrorProps {
  message?: string;
  className?: string;
}

const FormError = ({ message, className }: FormErrorProps) => {
  if (!message) return null;

  return <p className={cn('text-sm text-red-600', className)}>{message}</p>;
};

export { FormError };
