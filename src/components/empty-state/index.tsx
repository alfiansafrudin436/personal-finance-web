interface IEmptyState {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const EmptyState = ({ title, description, action }: IEmptyState) => (
  <div className='flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border px-6 py-12 text-center'>
    <p className='font-medium'>{title}</p>
    {description && (
      <p className='max-w-sm text-sm text-muted-foreground'>{description}</p>
    )}
    {action && <div className='mt-2'>{action}</div>}
  </div>
);

export default EmptyState;
