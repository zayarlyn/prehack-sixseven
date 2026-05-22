export type ItemStatus = 'active' | 'sold' | 'deleted';
export type ItemCategory = 'books' | 'electronics' | 'furniture' | 'clothing' | 'other';
export type ItemCondition = 'new' | 'like_new' | 'good' | 'fair';

export interface Item {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  category: ItemCategory;
  condition: ItemCondition;
  pickupLocation: string | null;
  openToOffers: boolean;
  status: ItemStatus;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  soldAt: Date | null;
  deletedAt: Date | null;
}

export interface CreateItemPayload {
  title: string;
  description: string;
  price: number;
  category: ItemCategory;
  condition: ItemCondition;
  pickupLocation?: string;
  openToOffers?: boolean;
  itemImageIds?: string[];
}

export type UpdateItemPayload = Partial<CreateItemPayload>;
