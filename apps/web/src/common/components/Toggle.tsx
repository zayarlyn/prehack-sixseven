import { cn } from '@swap-web/common/lib/utils';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  hint?: string;
}

export default function Toggle({ checked, onChange, label, hint }: ToggleProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-[42px] shrink-0 cursor-pointer rounded-full transition-colors duration-200',
          checked ? 'bg-primary' : 'bg-border-strong',
        )}
      >
        <span
          className={cn(
            'absolute top-[2px] left-[2px] h-5 w-5 rounded-full bg-white shadow transition-transform duration-200',
            checked ? 'translate-x-[18px]' : 'translate-x-0',
          )}
        />
      </button>
      <div className="flex flex-col">
        <span className="text-[13px] font-semibold">{label}</span>
        {hint && <span className="text-[12px] text-muted-foreground">{hint}</span>}
      </div>
    </div>
  );
}
