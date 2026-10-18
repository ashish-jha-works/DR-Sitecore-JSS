type StatusPillProps = {
  label: string;
};

function normalize(label: string) {
  const key = label.toLowerCase();
  if (['open', 'closed', 'awaiting', 'cancelled'].includes(key)) {
    return key;
  }
  return 'open';
}

export function StatusPill({ label }: StatusPillProps) {
  const status = normalize(label);

  return <span className={`status-pill status-${status}`}>{label}</span>;
}
