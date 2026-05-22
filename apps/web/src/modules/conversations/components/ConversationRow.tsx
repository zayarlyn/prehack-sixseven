import { Conversation } from '@swap/types';

interface ConversationRowProps {
  conversation: Conversation;
}

export default function ConversationRow({ conversation }: ConversationRowProps) {
  return (
    <div className="border rounded p-4 hover:bg-gray-50 cursor-pointer">
      <p className="font-semibold">Item: {conversation.itemId}</p>
      <p className="text-sm text-gray-600">Last message: {conversation.lastMessageAt.toString()}</p>
    </div>
  );
}
