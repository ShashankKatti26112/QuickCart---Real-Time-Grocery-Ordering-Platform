import { createSlice } from '@reduxjs/toolkit';
import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_SERVER_URL);

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], total: 0 },
  reducers: {
    addItem: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      socket.emit('cartUpdate', state.items);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      socket.emit('cartUpdate', state.items);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      socket.emit('cartUpdate', []);
    }
  }
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;