import { type ConversationWithDetails } from '@swap/types';
import { cn } from '@swap-web/common/lib/utils';
import UserAvatar from '@swap-web/common/components/UserAvatar';
import CategoryThumbnail from '@swap-web/common/components/CategoryThumbnail';
import { type Category } from '@swap-web/common/lib/category-palette';

function formatTimestamp(date: Date | string): string {
  const now = new Date();
  const d = new Date(date);
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

interface ConversationRowProps {
  conv: ConversationWithDetails;
  active: boolean;
  isLast: boolean;
  onClick: () => void;
}

export default function ConversationRow({ conv, active, isLast, onClick }: ConversationRowProps) {
  const hasUnread = conv.unreadCount > 0;
  const category = (conv.item.category.charAt(0).toUpperCase() + conv.item.category.slice(1)) as Category;

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative w-full text-left px-4 py-3 transition-colors',
        active ? 'bg-primary/10' : hasUnread ? 'bg-primary/10 hover:bg-primary/15' : 'hover:bg-accent',
      )}
    >
      {active && <div className="absolute inset-y-0 left-0 w-[3px] bg-primary rounded-r-full" />}

      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0">
          <UserAvatar user={conv.otherUser} size={44} />
          {hasUnread && (
            <div className="absolute top-[-2px] right-[-2px] min-w-[18px] h-[18px] rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center border-2 border-white px-0.5">
              {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <span className={cn('text-sm truncate', hasUnread ? 'font-bold' : 'font-semibold')}>
              {conv.otherUser.fullName}
            </span>
            <span
              className={cn(
                'text-[11px] flex-shrink-0',
                hasUnread ? 'text-primary font-bold' : 'text-muted-foreground',
              )}
            >
              {formatTimestamp(conv.lastMessageAt)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 mb-0.5">
            <div className="w-4 h-4 rounded-sm overflow-hidden flex-shrink-0">
              <CategoryThumbnail category={category} tag={conv.item.category.slice(0, 3)} />
            </div>
            <span className="text-[11px] text-muted-foreground truncate">{conv.item.title}</span>
          </div>

          {conv.lastMessage && (
            <span
              className={cn(
                'text-xs truncate block',
                hasUnread ? 'font-bold text-foreground' : 'text-muted-foreground',
              )}
            >
              {conv.lastMessage}
            </span>
          )}
        </div>
      </div>

      {!isLast && <div className="absolute left-[72px] right-4 bottom-0 h-px bg-border" />}
    </button>
  );
}
