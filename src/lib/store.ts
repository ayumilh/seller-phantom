import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import themeReducerAuth from './themeSliceAuth'
export const store = configureStore({
  reducer: {
    theme: themeReducer,
    themeAuth: themeReducerAuth
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
