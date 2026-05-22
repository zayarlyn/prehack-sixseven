import { CheckCheck } from 'lucide-react';
import { FirebaseMessage } from '@swap/types';
import { cn } from '@swap-web/common/lib/utils';

interface MessageBubbleProps {
  message: FirebaseMessage;
  isSent: boolean;
  isGrouped: boolean;
}

export default function MessageBubble({ message, isSent, isGrouped }: MessageBubbleProps) {
  const timestamp = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={cn('flex flex-col', isSent ? 'items-end' : 'items-start', isGrouped ? 'mt-0.5' : 'mt-2')}>
      <div
        className={cn(
          'max-w-[68%] px-4 py-2.5 text-sm rounded-[20px]',
          isSent
            ? cn('bg-primary text-primary-foreground rounded-br-[6px]', isGrouped && 'rounded-tr-[6px]')
            : cn('bg-[#f0f0f0] text-foreground rounded-bl-[6px]', isGrouped && 'rounded-tl-[6px]'),
        )}
      >
        {message.content}
      </div>
      <div className="flex items-center gap-1 mt-0.5 px-1">
        <span className="text-[10.5px] text-muted-foreground">{timestamp}</span>
        {isSent && <CheckCheck className="w-3 h-3 text-muted-foreground" />}
      </div>
    </div>
  );
}
