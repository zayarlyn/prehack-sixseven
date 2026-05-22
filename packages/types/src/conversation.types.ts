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
