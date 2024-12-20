import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from './slices/settingsSlice';
import conversationsReducer from './slices/conversationsSlice';
import { localStorageMiddleware, loadState } from './middleware/localStorage';

const store = configureStore({
  reducer: {
    settings: settingsReducer,
    conversations: conversationsReducer,
  },
  preloadedState: loadState(),
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store };
