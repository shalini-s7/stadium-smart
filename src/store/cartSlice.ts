import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  stallName: string;
}

export interface CartState {
  items: CartItem[];
  deliveryMode: 'pickup' | 'seat';
  deliveryFee: number;
}

const initialState: CartState = {
  items: [],
  deliveryMode: 'pickup',
  deliveryFee: 50,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    decrementItem: (state, action: PayloadAction<string>) => {
      const existing = state.items.find(i => i.id === action.payload);
      if (existing) {
        if (existing.quantity > 1) {
          existing.quantity -= 1;
        } else {
          state.items = state.items.filter(i => i.id !== action.payload);
        }
      }
    },
    setDeliveryMode: (state, action: PayloadAction<'pickup' | 'seat'>) => {
      state.deliveryMode = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
    }
  },
});

export const { addItem, removeItem, decrementItem, setDeliveryMode, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
