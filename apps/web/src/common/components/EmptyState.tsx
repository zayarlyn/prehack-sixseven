interface EmptyStateProps {
  title: string;
  description: string;
  onClear?: () => void;
}

export default function EmptyState({ title, description, onClear }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 px-6 py-20 text-center">
      <div
        className="flex items-center justify-center rounded-full"
        style={{ width: 120, height: 120, background: 'var(--od-primary-tint)' }}
      >
        <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
          <rect x="10" y="14" width="36" height="44" rx="3" fill="#fff" stroke="#fa4617" strokeWidth="2.5" />
          <path d="M16 24h24M16 32h24M16 40h16" stroke="#fa4617" strokeWidth="2" strokeLinecap="round" opacity="0.45" />
          <circle cx="48" cy="48" r="10" fill="#fff" stroke="#fa4617" strokeWidth="2.5" />
          <path d="M52 52l5 5" stroke="#fa4617" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>

      <div className="flex max-w-xs flex-col gap-1.5">
        <h2 className="text-[19px] font-bold tracking-tight">{title}</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>

      {onClear && (
        <button
          onClick={onClear}
          className="h-11 rounded-md border border-primary bg-white px-6 text-sm font-semibold text-primary transition-colors hover:bg-accent"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
