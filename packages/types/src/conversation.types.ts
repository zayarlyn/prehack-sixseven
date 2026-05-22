import type { Item } from './item.types';
import type { PublicUser } from './user.types';

export interface Conversation {
  id: string;
  firebaseId: string;
  itemId: string;
  buyerId: string;
  sellerId: string;
  createdAt: Date;
  lastMessageAt: Date;
}

export interface CreateConversationPayload {
  itemId: string;
  sellerId: string;
}

export interface FirebaseMessage {
  senderId: string | null;
  type: 'text' | 'system';
  content: string;
  createdAt: number;
}

export interface ConversationWithDetails extends Conversation {
  item: Pick<Item, 'id' | 'title' | 'price' | 'category'> & { itemImages: { url: string }[] };
  otherUser: PublicUser;
  unreadCount: number;
  lastMessage: string | null;
}
