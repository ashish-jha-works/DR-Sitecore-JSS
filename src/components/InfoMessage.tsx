type MessageStatus = 'normal' | 'warning' | 'error' | 'success';
interface InfoMessageProps {
  IconComponent: React.ElementType;
  status?: MessageStatus;
  children: React.ReactNode;
  className?: string;
}

export default function InfoMessage({
  IconComponent,
  status = 'normal',
  children,
  className = '',
}: InfoMessageProps) {
  const statusClasses = {
    normal: 'info-message-normal',
    warning: 'info-message-warning',
    error: 'info-message-error',
    success: 'info-message-success',
  };
  const customClassName = statusClasses[status];
  return (
    <div className={`${customClassName} flex flex-col md:flex-row ${className}`}>
      {IconComponent && <IconComponent />}
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}
