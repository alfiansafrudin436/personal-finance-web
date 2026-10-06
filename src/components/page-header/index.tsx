interface IPageHeader {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const PageHeader = ({ title, description, action }: IPageHeader) => (
  <div className='mb-6 flex flex-wrap items-start justify-between gap-3'>
    <div>
      <h1 className='text-2xl font-semibold tracking-tight'>{title}</h1>
      {description && (
        <p className='mt-1 text-sm text-muted-foreground'>{description}</p>
      )}
    </div>
    {action}
  </div>
);

export default PageHeader;
