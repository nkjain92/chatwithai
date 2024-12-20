import { Middleware } from '@reduxjs/toolkit';

const STORAGE_KEY = 'chatgpt-v2-state';

export const localStorageMiddleware: Middleware = store => next => action => {
  const result = next(action);

  if (typeof window !== 'undefined' && action.type.startsWith('conversations/')) {
    const state = store.getState();
    const stateToSave = {
      conversations: state.conversations,
      settings: state.settings,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.error('Failed to save state to localStorage:', error);
    }
  }

  return result;
};

export const loadState = () => {
  if (typeof window === 'undefined') return undefined;

  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (!serializedState) return undefined;
    return JSON.parse(serializedState);
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
    return undefined;
  }
};

export const saveState = (state: RootState) => {
  if (typeof window === 'undefined') return;

  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
  }
};
