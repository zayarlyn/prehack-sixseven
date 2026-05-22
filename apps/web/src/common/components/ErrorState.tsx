import { Alert, AlertDescription } from '@swap-web/common/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  message: string;
}

export default function ErrorState({ message }: ErrorStateProps) {
  return (
    <Alert variant="destructive" className="max-w-md mx-auto my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
