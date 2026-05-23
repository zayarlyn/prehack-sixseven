import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import api from '@swap-web/common/lib/axios';
import { db } from '@swap-web/common/lib/firebase';
import {
  type ConversationWithDetails,
  type FirebaseMessage,
  type ItemCategory,
  type Faculty,
  type Major,
  type ProgramLevel,
} from '@swap/types';
import { useAuth } from '@swap-web/modules/auth/hooks/useAuth';

type RawUser = {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: string;
  faculty: Faculty | null;
  major: Major | null;
  year: number | null;
  programLevel: ProgramLevel | null;
};

type RawConversation = {
  id: string;
  firebaseId: string;
  itemId: string;
  buyerId: string;
  sellerId: string;
  createdAt: string;
  lastMessageAt: string;
  item: {
    id: string;
    title: string;
    price: number;
    category: ItemCategory;
    itemImages: { s3Object: { publicUrl: string } }[];
  };
  buyer: RawUser;
  seller: RawUser;
};

function buildConversationWithDetails(
  conv: RawConversation,
  userId: string,
  unreadCount: number,
  lastMessage: string | null,
): ConversationWithDetails {
  const rawOther = conv.buyerId === userId ? conv.seller : conv.buyer;
  return {
    id: conv.id,
    firebaseId: conv.firebaseId,
    itemId: conv.itemId,
    buyerId: conv.buyerId,
    sellerId: conv.sellerId,
    createdAt: new Date(conv.createdAt),
    lastMessageAt: new Date(conv.lastMessageAt),
    item: {
      id: conv.item.id,
      title: conv.item.title,
      price: conv.item.price,
      category: conv.item.category,
      itemImages: conv.item.itemImages.map((img) => ({ url: img.s3Object.publicUrl })),
    },
    otherUser: {
      id: rawOther.id,
      fullName: rawOther.fullName,
      avatarUrl: rawOther.avatarUrl,
      bio: rawOther.bio,
      faculty: rawOther.faculty,
      major: rawOther.major,
      year: rawOther.year,
      programLevel: rawOther.programLevel,
      createdAt: new Date(rawOther.createdAt),
    },
    unreadCount,
    lastMessage,
  };
}

async function enrichConversation(conv: RawConversation, userId: string): Promise<ConversationWithDetails> {
  try {
    const { firebaseId } = conv;

    const [readBySnap, msgsSnap] = await Promise.all([
      get(ref(db, `conversations/${firebaseId}/readBy/${userId}`)),
      get(ref(db, `conversations/${firebaseId}/messages`)),
    ]);

    const readAt: number = (readBySnap.val() as number | null) ?? 0;
    const msgsData = msgsSnap.val() as Record<string, Omit<FirebaseMessage, 'key'>> | null;
    const msgs = msgsData ? Object.values(msgsData).sort((a, b) => a.createdAt - b.createdAt) : [];

    const unreadCount = msgs.filter((m) => m.createdAt > readAt && m.senderId !== userId).length;
    const lastMsg = msgs[msgs.length - 1] ?? null;
    const lastMessage = lastMsg ? (lastMsg.senderId === userId ? `You: ${lastMsg.content}` : lastMsg.content) : null;

    return buildConversationWithDetails(conv, userId, unreadCount, lastMessage);
  } catch (err) {
    console.error('[useConversations] Firebase enrichment failed for', conv.id, err);
    return buildConversationWithDetails(conv, userId, 0, null);
  }
}

export function useConversations() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);

  const rawQuery = useQuery({
    queryKey: ['conversations'],
    queryFn: () => api.get('/conversations').then((r) => (r.data.data ?? r.data) as RawConversation[]),
    enabled: !!user,
  });

  useEffect(() => {
    if (rawQuery.data === undefined || !user) return;
    Promise.all(rawQuery.data.map((c) => enrichConversation(c, user.id)))
      .then(setConversations)
      .catch((err) => console.error('[useConversations] enrichment failed:', err));
  }, [rawQuery.data, user]);

  return {
    conversations,
    isLoading: rawQuery.isLoading,
    isError: rawQuery.isError,
  };
}

export function useConversation(id: string) {
  return useQuery({
    queryKey: ['conversation', id],
    queryFn: () => api.get(`/conversations/${id}`).then((r) => r.data),
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { itemId: string; sellerId: string }) => api.post('/conversations', data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}
