import { Loader2 } from 'lucide-react';
import { cn } from '@swap-web/common/lib/utils';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

export default function LoadingSpinner({ size = 18, className }: LoadingSpinnerProps) {
  return <Loader2 size={size} className={cn('animate-spin text-od-primary', className)} />;
}
