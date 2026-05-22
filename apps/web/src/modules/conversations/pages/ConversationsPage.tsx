import { useState, useEffect, useRef } from 'react';
import { useSearch, useNavigate } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { type FirebaseMessage } from '@swap/types';
import { cn } from '@swap-web/common/lib/utils';
import UserAvatar from '@swap-web/common/components/UserAvatar';
import { useAuth } from '@swap-web/modules/auth/hooks/useAuth';
import { useConversations } from '../hooks/useConversations';
import { useFirebaseChat } from '../hooks/useFirebaseChat';
import ConversationList from '../components/ConversationList';
import PinnedItemCard from '../components/PinnedItemCard';
import MessageBubble from '../components/MessageBubble';
import MessageInput from '../components/MessageInput';
import SystemMessage from '../components/SystemMessage';
import EmptyThread from '../components/EmptyThread';

function groupByDay(messages: FirebaseMessage[]): { label: string; messages: FirebaseMessage[] }[] {
  const groups: { label: string; messages: FirebaseMessage[] }[] = [];
  for (const msg of messages) {
    const d = new Date(msg.createdAt);
    const now = new Date();
    let label: string;
    if (d.toDateString() === now.toDateString()) {
      label = 'Today';
    } else {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      label =
        d.toDateString() === yesterday.toDateString()
          ? 'Yesterday'
          : d.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
    }
    const last = groups[groups.length - 1];
    if (last && last.label === label) {
      last.messages.push(msg);
    } else {
      groups.push({ label, messages: [msg] });
    }
  }
  return groups;
}

export default function ConversationsPage() {
  const { conv } = useSearch({ strict: false }) as { conv?: string };
  const navigate = useNavigate();
  const { user } = useAuth();
  const { conversations } = useConversations();
  const [mobilePane, setMobilePane] = useState<'list' | 'thread'>('list');
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeId = conv ?? null;
  const activeConv = conversations.find((c) => c.id === activeId) ?? null;

  const { messages, sendMessage, markAsRead } = useFirebaseChat(
    activeConv?.firebaseId ?? '',
    activeConv?.id ?? '',
    user?.id ?? '',
  );

  const markAsReadRef = useRef(markAsRead);
  useEffect(() => {
    markAsReadRef.current = markAsRead;
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!activeConv) return;
    markAsReadRef.current();
  }, [activeConv?.id, messages.length]);

  const handleSelect = (id: string) => {
    navigate({ to: '/conversations', search: { conv: id } });
    setMobilePane('thread');
  };

  const handleBack = () => {
    navigate({ to: '/conversations', search: {} });
    setMobilePane('list');
  };

  const dayGroups = groupByDay(messages);

  return (
    <div className="h-screen overflow-hidden flex flex-col pt-16">
      <div className="flex-1 min-h-0 overflow-hidden p-4 md:p-6">
        <div
          className={cn(
            'h-full grid rounded-xl border shadow overflow-hidden bg-white',
            'grid-cols-1 lg:grid-cols-[360px_1fr]',
          )}
        >
          {/* Left sidebar */}
          <div className={cn('border-r flex flex-col min-h-0', mobilePane !== 'list' && 'hidden lg:flex')}>
            <ConversationList conversations={conversations} activeId={activeId} onSelect={handleSelect} />
          </div>

          {/* Right thread pane */}
          <div className={cn('flex flex-col min-h-0', mobilePane !== 'thread' && 'hidden lg:flex')}>
            {activeConv ? (
              <>
                {/* Thread header */}
                <div className="h-16 border-b flex items-center gap-3 px-4 flex-shrink-0">
                  <button className="lg:hidden p-1 -ml-1 rounded-full hover:bg-accent" onClick={handleBack}>
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <UserAvatar user={activeConv.otherUser} size={38} />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{activeConv.otherUser.fullName}</p>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <span className="text-xs text-muted-foreground">Active now</span>
                    </div>
                  </div>
                </div>

                {/* Pinned item */}
                <PinnedItemCard item={activeConv.item} />

                {/* Messages area */}
                <div
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto min-h-0 bg-[#fafafa] px-7 py-3 [&::-webkit-scrollbar]:hidden"
                >
                  {dayGroups.map(({ label, messages: dayMessages }) => (
                    <div key={label}>
                      <SystemMessage label={label} />
                      {dayMessages.map((msg, i) => {
                        const isGrouped = i > 0 && dayMessages[i - 1].senderId === msg.senderId;
                        return (
                          <MessageBubble
                            key={`${msg.senderId}-${msg.createdAt}`}
                            message={msg}
                            isSent={msg.senderId === user?.id}
                            isGrouped={isGrouped}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* Composer */}
                <MessageInput onSend={sendMessage} />
              </>
            ) : (
              <EmptyThread />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
