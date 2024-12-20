'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateSettings } from '@/store/slices/settingsSlice';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SettingsState {
  settings: {
    temperature: number;
    maxTokens: number;
    topP: number;
    model: string;
  };
}

const Settings: React.FC = () => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state: SettingsState) => state.settings);

  const handleTemperatureChange = (value: number[]) => {
    dispatch(updateSettings({ temperature: value[0] }));
  };

  const handleMaxTokensChange = (value: number[]) => {
    dispatch(updateSettings({ maxTokens: value[0] }));
  };

  const handleTopPChange = (value: number[]) => {
    dispatch(updateSettings({ topP: value[0] }));
  };

  const handleModelChange = (value: string) => {
    dispatch(updateSettings({ model: value }));
  };

  return (
    <div className='space-y-6 p-4'>
      <div className='space-y-2'>
        <Label>Model</Label>
        <Select value={settings.model} onValueChange={handleModelChange}>
          <SelectTrigger>
            <SelectValue placeholder='Select a model' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='gpt-4'>GPT-4</SelectItem>
            <SelectItem value='gpt-3.5-turbo'>GPT-3.5 Turbo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <Label>Temperature: {settings.temperature}</Label>
        <Slider
          value={[settings.temperature]}
          onValueChange={handleTemperatureChange}
          min={0}
          max={1}
          step={0.1}
        />
      </div>

      <div className='space-y-2'>
        <Label>Max Tokens: {settings.maxTokens}</Label>
        <Slider
          value={[settings.maxTokens]}
          onValueChange={handleMaxTokensChange}
          min={100}
          max={4000}
          step={100}
        />
      </div>

      <div className='space-y-2'>
        <Label>Top P: {settings.topP}</Label>
        <Slider
          value={[settings.topP]}
          onValueChange={handleTopPChange}
          min={0}
          max={1}
          step={0.1}
        />
      </div>
    </div>
  );
};

export default Settings;
