import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ModelSettingsState {
  temperature: number;
  maxTokens: number;
  topP: number;
  model: string;
  theme: 'light' | 'dark' | 'system';
}

export const AVAILABLE_MODELS = [
  { id: 'gpt-4', name: 'GPT-4', description: 'Most capable model, best for complex tasks' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and efficient for most tasks' },
] as const;

const initialState: ModelSettingsState = {
  temperature: 0.7,
  maxTokens: 2048,
  topP: 1,
  model: 'gpt-4',
  theme: 'system',
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateSettings: (state, action: PayloadAction<Partial<ModelSettingsState>>) => {
      return { ...state, ...action.payload };
    },
    resetSettings: () => initialState,
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },
  },
});

export const { updateSettings, resetSettings, setTheme } = settingsSlice.actions;

export default settingsSlice.reducer;
