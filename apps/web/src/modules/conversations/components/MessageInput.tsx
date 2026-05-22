import { useState, useRef, type KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { cn } from '@swap-web/common/lib/utils';

interface MessageInputProps {
  onSend: (content: string) => void;
}

export default function MessageInput({ onSend }: MessageInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const canSend = value.trim().length > 0;

  const handleSend = () => {
    if (!canSend) return;
    onSend(value.trim());
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-2 px-3.5 py-2.5 border-t bg-white flex-shrink-0">
      <textarea
        ref={textareaRef}
        value={value}
        rows={1}
        placeholder="Message..."
        className="flex-1 bg-[#f1f1f1] rounded-[22px] px-3.5 py-2.5 min-h-[44px] text-sm resize-none outline-none border border-transparent focus:border-primary focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.15)] transition-shadow overflow-hidden"
        onChange={(e) => {
          setValue(e.target.value);
          e.target.style.height = 'auto';
          e.target.style.height = `${e.target.scrollHeight}px`;
        }}
        onKeyDown={handleKeyDown}
      />
      <button
        onClick={handleSend}
        disabled={!canSend}
        className={cn(
          'w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-colors',
          canSend
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'bg-muted text-muted-foreground cursor-not-allowed',
        )}
      >
        <Send className="w-4 h-4" />
      </button>
    </div>
  );
}
