import MicrosoftSignInButton from '@swap-web/modules/auth/components/MicrosoftSignInButton';

export default function SignInForm({ onSignIn }: { onSignIn: () => void }) {
  return (
    <div className="flex flex-col" style={{ animation: 'fadeUp 300ms ease both' }}>
      <div className="mb-7">
        <h1 className="m-0 text-2xl font-bold tracking-[-0.5px] mb-2.5">Welcome to Swap</h1>
        <p className="text-muted-foreground m-0 text-[15px] leading-normal">
          The student marketplace for KMUTT. Buy and sell within your campus community.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <MicrosoftSignInButton onClick={onSignIn} />
        <p className="text-muted-foreground text-xs text-center m-0">
          Use your <span className="text-foreground font-semibold">@kmutt.ac.th</span> account
        </p>
      </div>

      <div className="border-t border-border text-muted-foreground mt-7 pt-5 flex items-start gap-2.5 text-xs leading-normal">
        <svg
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          className="text-green-500 shrink-0 mt-px"
          aria-hidden
        >
          <path
            d="M12 3l8 3v5c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-3Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M8.5 12l2.5 2.5L16 9.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>{`Verified through KMUTT's Microsoft 365 tenant. We never see your password.`}</span>
      </div>

      <div className="mt-6 text-center">
        <span className="text-muted-foreground text-sm font-semibold cursor-pointer">Need help?</span>
      </div>
    </div>
  );
}
