"use client";
import { create } from "zustand";

export interface CartItemConfig {
  metal?: string;
  size?: string;
  diamond?: { shape: string; carat: number; color: string; clarity: string };
  engraving?: string;
}

export interface CartItem {
  id: string;
  productSlug: string;
  title: string;
  price: number; // pence
  variantLabel?: string;
  quantity: number;
  configuration?: CartItemConfig;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  total: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (item) => set((s) => ({ items: [...s.items, item] })),
  removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
  clear: () => set({ items: [] }),
  total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
}));
















