import { useParams } from '@tanstack/react-router';

export default function ConversationDetailPage() {
  const { conversationId } = useParams({ from: '/conversations/$conversationId' });

  return <div>Conversation {conversationId} — coming soon</div>;
}
