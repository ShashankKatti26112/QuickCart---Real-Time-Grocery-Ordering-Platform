import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme: localStorage.getItem('theme') || 'light',
    notification: null
  },
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
    },
    showNotification: (state, action) => {
      state.notification = {
        message: action.payload.message,
        type: action.payload.type
      };
    },
    clearNotification: (state) => {
      state.notification = null;
    }
  }
});

export const { toggleTheme, showNotification, clearNotification } = uiSlice.actions;
export default uiSlice.reducer;