import { createSlice } from '@reduxjs/toolkit';

interface ThemeState {
  isDarkMode: boolean;
}

const initialState: ThemeState = {
  isDarkMode: true,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setIsDarkModeFun(state, action) {
      state.isDarkMode = action.payload;
    },
  },
});

export const { setIsDarkModeFun } = themeSlice.actions;
export default themeSlice.reducer;
