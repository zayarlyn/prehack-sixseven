import { Search } from 'lucide-react';
import { type ConversationWithDetails } from '@swap/types';
import ConversationRow from './ConversationRow';

interface ConversationListProps {
  conversations: ConversationWithDetails[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export default function ConversationList({ conversations, activeId, onSelect }: ConversationListProps) {
  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-4 border-b flex-shrink-0">
        <div>
          <h2 className="font-bold text-base">Messages</h2>
          {totalUnread > 0 && <p className="text-xs text-muted-foreground">{totalUnread} unread</p>}
        </div>
        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-accent transition-colors">
          <Search className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
        {conversations.length === 0 ? (
          <div className="flex items-center justify-center h-full py-12">
            <p className="text-sm text-muted-foreground">No conversations yet</p>
          </div>
        ) : (
          conversations.map((conv, i) => (
            <ConversationRow
              key={conv.id}
              conv={conv}
              active={conv.id === activeId}
              isLast={i === conversations.length - 1}
              onClick={() => onSelect(conv.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
