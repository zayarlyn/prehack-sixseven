export const CATEGORY_PALETTE = {
  Books: { bg: '#fef3ec', stripe: '#fde0cd', label: '#a3580f' },
  Electronics: { bg: '#eef1f7', stripe: '#dbe1ec', label: '#3c4a64' },
  Furniture: { bg: '#f1efe9', stripe: '#e3dfd2', label: '#6b5d3a' },
  Clothing: { bg: '#f3eef3', stripe: '#e3d8e3', label: '#6a4a6a' },
  Other: { bg: '#eef3f0', stripe: '#dbe6df', label: '#3f6253' },
} as const;

export type Category = keyof typeof CATEGORY_PALETTE;

export const CATEGORIES = Object.keys(CATEGORY_PALETTE) as Category[];
