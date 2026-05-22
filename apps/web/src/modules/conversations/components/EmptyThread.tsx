import { MessageSquare } from 'lucide-react';

export default function EmptyThread() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
      <div className="w-16 h-16 rounded-full bg-muted/40 flex items-center justify-center">
        <MessageSquare className="w-7 h-7 text-primary" />
      </div>
      <div>
        <h3 className="font-semibold text-base mb-1">Select a conversation</h3>
        <p className="text-sm text-muted-foreground">Choose from the left to start chatting</p>
      </div>
    </div>
  );
}
