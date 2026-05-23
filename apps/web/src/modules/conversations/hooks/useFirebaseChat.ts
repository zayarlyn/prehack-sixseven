import { useEffect, useRef, useState, useCallback } from 'react';
import { ref, query, orderByChild, onValue, push, set } from 'firebase/database';
import { db } from '@swap-web/common/lib/firebase';
import api from '@swap-web/common/lib/axios';
import { type FirebaseMessage } from '@swap/types';

export function useFirebaseChat(firebaseId: string, conversationId: string, currentUserId: string) {
  const [messages, setMessages] = useState<FirebaseMessage[]>([]);
  const userIdRef = useRef(currentUserId);

  useEffect(() => {
    userIdRef.current = currentUserId;
  });

  useEffect(() => {
    if (!firebaseId) return;

    const messagesRef = query(ref(db, `conversations/${firebaseId}/messages`), orderByChild('createdAt'));
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val() as Record<string, Omit<FirebaseMessage, 'key'>> | null;
      if (!data) {
        setMessages([]);
        return;
      }
      const msgs = Object.entries(data)
        .map(([key, msg]) => ({ key, ...msg }))
        .sort((a, b) => a.createdAt - b.createdAt);
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [firebaseId]);

  const sendMessage = useCallback(
    async (content: string): Promise<void> => {
      if (!firebaseId || !content.trim()) return;
      const messagesRef = ref(db, `conversations/${firebaseId}/messages`);
      await push(messagesRef, {
        senderId: userIdRef.current,
        type: 'text' as const,
        content,
        createdAt: Date.now(),
      });
      if (conversationId) {
        await api.patch(`/conversations/${conversationId}/last-message`);
      }
    },
    [firebaseId, conversationId],
  );

  const markAsRead = useCallback(async (): Promise<void> => {
    if (!firebaseId || !userIdRef.current) return;
    await set(ref(db, `conversations/${firebaseId}/readBy/${userIdRef.current}`), Date.now());
  }, [firebaseId]);

  return { messages, sendMessage, markAsRead };
}
