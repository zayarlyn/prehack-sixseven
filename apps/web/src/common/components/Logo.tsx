type LogoSize = 'sm' | 'md' | 'lg';

interface LogoProps {
  size?: LogoSize;
  variant?: 'default' | 'white';
  compact?: boolean;
}

const SIZE_MAP: Record<LogoSize, { icon: number; radius: number; font: number }> = {
  sm: { icon: 28, radius: 7, font: 15 },
  md: { icon: 36, radius: 9, font: 17 },
  lg: { icon: 44, radius: 11, font: 20 },
};

export default function Logo({ size = 'md', variant = 'default', compact = false }: LogoProps) {
  const { icon, radius, font } = SIZE_MAP[size];
  const isWhite = variant === 'white';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
      <div
        style={{
          width: icon,
          height: icon,
          borderRadius: radius,
          background: isWhite ? 'rgba(255,255,255,0.15)' : '#fa4617',
          border: isWhite ? '1px solid rgba(255,255,255,0.3)' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isWhite ? 'none' : '0 2px 6px rgba(250,70,23,0.25)',
          flexShrink: 0,
        }}
      >
        <svg width={icon * 0.5} height={icon * 0.5} viewBox="0 0 24 24" fill="none">
          <path
            d="M4 8 L15 8 M12.5 5.5 L15 8 L12.5 10.5"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20 16 L9 16 M11.5 13.5 L9 16 L11.5 18.5"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {!compact && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <span
            style={{
              fontSize: font,
              fontWeight: 800,
              letterSpacing: -0.3,
              color: isWhite ? '#ffffff' : '#1a1a1a',
              lineHeight: 1,
              whiteSpace: 'nowrap',
            }}
          >
            sw<span style={{ color: '#fa4617' }}>a</span>p
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: isWhite ? 'rgba(255,255,255,0.7)' : '#6b6b6b',
              letterSpacing: 0.2,
              lineHeight: 1,
            }}
          >
            Student marketplace
          </span>
        </div>
      )}
    </div>
  );
}
