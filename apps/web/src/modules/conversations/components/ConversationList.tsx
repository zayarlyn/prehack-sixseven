import { useState, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { type ConversationWithDetails } from '@swap/types';
import ConversationRow from './ConversationRow';

interface ConversationListProps {
  conversations: ConversationWithDetails[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export default function ConversationList({ conversations, activeId, onSelect }: ConversationListProps) {
  const [searching, setSearching] = useState(false);
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  const filtered = q.trim()
    ? conversations.filter(
        (c) =>
          c.otherUser.fullName.toLowerCase().includes(q.toLowerCase()) ||
          c.item.title.toLowerCase().includes(q.toLowerCase()),
      )
    : conversations;

  function openSearch() {
    setSearching(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function closeSearch() {
    setSearching(false);
    setQ('');
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-4 border-b flex-shrink-0 gap-2">
        {searching ? (
          <>
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search conversations…"
              className="flex-1 text-sm bg-transparent outline-none"
            />
            <button
              onClick={closeSearch}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-accent transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <div>
              <h2 className="font-bold text-base">Messages</h2>
              {totalUnread > 0 && <p className="text-xs text-muted-foreground">{totalUnread} unread</p>}
            </div>
            <button
              onClick={openSearch}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-accent transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-full py-12">
            <p className="text-sm text-muted-foreground">
              {q ? 'No conversations match your search' : 'No conversations yet'}
            </p>
          </div>
        ) : (
          filtered.map((conv, i) => (
            <ConversationRow
              key={conv.id}
              conv={conv}
              active={conv.id === activeId}
              isLast={i === filtered.length - 1}
              onClick={() => onSelect(conv.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
