import { Button } from '@swap-web/common/components/ui/button';
import LoadingSpinner from '@swap-web/common/components/LoadingSpinner';

interface MicrosoftSignInButtonProps {
  onClick: () => void;
  loading?: boolean;
}

const MicrosoftLogo = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" aria-hidden>
    <rect x="1.5" y="1.5" width="9" height="9" fill="#F25022" />
    <rect x="13.5" y="1.5" width="9" height="9" fill="#7FBA00" />
    <rect x="1.5" y="13.5" width="9" height="9" fill="#00A4EF" />
    <rect x="13.5" y="13.5" width="9" height="9" fill="#FFB900" />
  </svg>
);

export default function MicrosoftSignInButton({ onClick, loading }: MicrosoftSignInButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={loading}
      aria-busy={loading}
      variant="outline"
      className="w-full h-[52px] text-[15px] font-semibold text-foreground [&_svg]:size-5"
    >
      {loading ? <LoadingSpinner size={18} /> : <MicrosoftLogo />}
      <span>{loading ? 'Signing in…' : 'Sign in with Microsoft'}</span>
    </Button>
  );
}
