import { Conversation } from '@swap/types';
import ConversationRow from './ConversationRow';

interface ConversationListProps {
  conversations: Conversation[];
}

export default function ConversationList({ conversations }: ConversationListProps) {
  return (
    <div className="space-y-2">
      {conversations.map((conv) => (
        <ConversationRow key={conv.id} conversation={conv} />
      ))}
    </div>
  );
}
