import { useState, useRef, useEffect } from 'react';
import { cn } from '@swap-web/common/lib/utils';

const PRESETS: [number, number | null][] = [
  [0, 500],
  [500, 1000],
  [1000, 3000],
  [3000, null],
];

interface PriceFilterProps {
  min: number | null;
  max: number | null;
  onChange: (min: number | null, max: number | null) => void;
}

export default function PriceFilter({ min, max, onChange }: PriceFilterProps) {
  const [open, setOpen] = useState(false);
  const [localMin, setLocalMin] = useState<string>(min != null ? String(min) : '');
  const [localMax, setLocalMax] = useState<string>(max != null ? String(max) : '');
  const [prevMin, setPrevMin] = useState(min);
  const [prevMax, setPrevMax] = useState(max);
  const ref = useRef<HTMLDivElement>(null);

  if (min !== prevMin) {
    setPrevMin(min);
    setLocalMin(min != null ? String(min) : '');
  }
  if (max !== prevMax) {
    setPrevMax(max);
    setLocalMax(max != null ? String(max) : '');
  }

  const active = min != null || max != null;
  const label = active ? `฿${min ?? 0}–${max != null ? max : '∞'}` : 'Price';

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const applyPreset = (lo: number, hi: number | null) => {
    setLocalMin(String(lo));
    setLocalMax(hi != null ? String(hi) : '');
  };

  const handleApply = () => {
    const rawMin = parseFloat(localMin);
    const rawMax = parseFloat(localMax);
    const parsedMin = localMin !== '' && Number.isFinite(rawMin) ? rawMin : null;
    const parsedMax = localMax !== '' && Number.isFinite(rawMax) ? rawMax : null;
    onChange(parsedMin, parsedMax);
    setOpen(false);
  };

  const handleClear = () => {
    setLocalMin('');
    setLocalMax('');
    onChange(null, null);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex h-9 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium transition-all duration-150',
          active
            ? 'border border-transparent bg-accent font-semibold text-primary'
            : 'border border-border bg-white text-foreground hover:bg-muted',
        )}
      >
        {label}
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
          className="absolute right-0 z-40 mt-2 min-w-[240px] rounded-[10px] border border-border bg-white p-4"
          style={{ boxShadow: 'var(--od-shadow-popover)' }}
        >
          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold">Price range</span>

            <div className="flex items-center gap-2">
              <div className="flex h-9 flex-1 items-center rounded-md border border-border bg-white px-2.5">
                <span className="mr-1 text-xs text-muted-foreground">฿</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={localMin}
                  onChange={(e) => setLocalMin(e.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                />
              </div>
              <span className="text-muted-foreground">–</span>
              <div className="flex h-9 flex-1 items-center rounded-md border border-border bg-white px-2.5">
                <span className="mr-1 text-xs text-muted-foreground">฿</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={localMax}
                  onChange={(e) => setLocalMax(e.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map(([lo, hi], i) => (
                <button
                  key={i}
                  onClick={() => applyPreset(lo, hi)}
                  className="rounded-full border border-border bg-secondary px-2.5 py-1 text-xs text-foreground transition-colors hover:bg-muted"
                >
                  ฿{lo}
                  {hi != null ? `–${hi}` : '+'}
                </button>
              ))}
            </div>

            <div className="mt-1 flex gap-2">
              <button
                onClick={handleClear}
                className="h-9 flex-1 rounded-md border border-border bg-transparent text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Clear
              </button>
              <button
                onClick={handleApply}
                className="h-9 flex-1 rounded-md bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
