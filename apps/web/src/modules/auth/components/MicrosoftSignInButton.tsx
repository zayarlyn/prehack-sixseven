interface MicrosoftSignInButtonProps {
  onClick: () => void;
}

export default function MicrosoftSignInButton({ onClick }: MicrosoftSignInButtonProps) {
  return (
    <button onClick={onClick} className="px-4 py-2 border rounded">
      Sign in with Microsoft
    </button>
  );
}
