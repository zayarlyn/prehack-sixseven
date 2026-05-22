interface SystemMessageProps {
  label: string;
}

export default function SystemMessage({ label }: SystemMessageProps) {
  return (
    <div className="flex items-center gap-2.5 my-4">
      <div className="flex-1 h-px bg-border" />
      <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}
