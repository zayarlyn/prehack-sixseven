export interface Transaction {
  id: string;
  itemId: string;
  sellerId: string;
  buyerId: string;
  finalPrice: number;
  note: string | null;
  createdAt: Date;
}

export interface CreateTransactionPayload {
  itemId: string;
  buyerId: string;
  finalPrice: number;
  note?: string;
  conversationId?: string;
}
