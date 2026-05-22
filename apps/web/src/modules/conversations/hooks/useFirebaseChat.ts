import { FirebaseMessage } from '@swap/types';
import { useEffect, useState } from 'react';

export function useFirebaseChat(conversationId: string) {
  const [messages, _setMessages] = useState<FirebaseMessage[]>([]);

  const sendMessage = (_message: string) => {
    // TODO: Implement Firebase message sending
  };

  const markAsRead = () => {
    // TODO: Implement mark as read
  };

  useEffect(() => {
    // TODO: Set up Firebase listener for messages
  }, [conversationId]);

  return { messages, sendMessage, markAsRead };
}
