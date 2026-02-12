import { createSlice } from '@reduxjs/toolkit';

interface ThemeState {
  isDarkModeAuth: boolean;
}

const initialState: ThemeState = {
  isDarkModeAuth: true,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setIsDarkModeFunAuth(state, action) {
      state.isDarkModeAuth = action.payload;
    },
  },
});

export const { setIsDarkModeFunAuth } = themeSlice.actions;
export default themeSlice.reducer;
