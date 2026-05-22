import { useState, useRef, useEffect } from 'react';
import { cn } from '@swap-web/common/lib/utils';

const SORTS = [
  { id: 'newest', label: 'Newest' },
  { id: 'low', label: 'Price: low to high' },
  { id: 'high', label: 'Price: high to low' },
] as const;

interface SortDropdownProps {
  value: string;
  onChange: (sort: 'newest' | 'low' | 'high') => void;
}

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = SORTS.find((s) => s.id === value) ?? SORTS[0];

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 items-center gap-1.5 rounded-full border border-border bg-white px-3.5 text-sm font-medium transition-colors hover:bg-muted"
      >
        <span className="text-muted-foreground">Sort:</span>
        <span>{current.label}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          style={{ transition: 'transform 120ms ease', transform: open ? 'rotate(180deg)' : 'none' }}
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 z-40 mt-2 min-w-[200px] rounded-[10px] border border-border bg-white py-1"
          style={{ boxShadow: 'var(--od-shadow-popover)' }}
        >
          {SORTS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                onChange(s.id);
                setOpen(false);
              }}
              className={cn(
                'flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm transition-colors',
                s.id === value ? 'bg-accent font-semibold text-primary' : 'font-medium text-foreground hover:bg-muted',
              )}
            >
              {s.label}
              {s.id === value && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12.5l4.5 4.5L19 7"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
