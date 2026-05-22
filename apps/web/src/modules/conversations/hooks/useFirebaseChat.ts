import { FirebaseMessage } from '@swap/types';
import { useEffect, useState } from 'react';

export function useFirebaseChat(conversationId: string) {
  const [messages, setMessages] = useState<FirebaseMessage[]>([]);

  const sendMessage = (message: string) => {
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
