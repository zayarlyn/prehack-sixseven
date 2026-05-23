interface TabButtonProps {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}

export default function TabButton({ label, count, active, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'relative',
        padding: '14px 4px 12px',
        marginRight: 16,
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: 15,
        fontWeight: active ? 700 : 500,
        color: active ? 'var(--od-text)' : 'var(--od-text-secondary)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        transition: 'color 120ms ease',
        fontFamily: 'inherit',
      }}
    >
      {label}
      <span
        style={{
          fontSize: 12.5,
          fontWeight: active ? 700 : 500,
          color: active ? 'var(--od-primary)' : 'var(--od-text-tertiary)',
        }}
      >
        {count}
      </span>
      {active && (
        <span
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: -1,
            height: 2,
            background: 'var(--od-primary)',
            borderRadius: 2,
          }}
        />
      )}
    </button>
  );
}
