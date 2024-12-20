'use client';

import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateSettings, AVAILABLE_MODELS } from '@/store/slices/settingsSlice';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const settings = useAppSelector(state => state.settings);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSave = () => {
    router.push('/');
  };

  return (
    <div className='container max-w-2xl py-8'>
      <h1 className='text-2xl font-bold mb-8'>Model Settings</h1>

      <div className='space-y-8'>
        {/* Model Selection */}
        <div className='space-y-2'>
          <Label>Model</Label>
          <Select
            value={settings.model}
            onValueChange={value =>
              dispatch(
                updateSettings({
                  model: value,
                }),
              )
            }>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_MODELS.map(model => (
                <SelectItem key={model.id} value={model.id}>
                  <div className='flex flex-col'>
                    <span>{model.name}</span>
                    <span className='text-xs text-muted-foreground'>{model.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Temperature */}
        <div className='space-y-2'>
          <Label>Temperature: {settings.temperature}</Label>
          <Slider
            min={0}
            max={2}
            step={0.1}
            value={[settings.temperature]}
            onValueChange={([value]) =>
              dispatch(
                updateSettings({
                  temperature: value,
                }),
              )
            }
          />
          <p className='text-sm text-muted-foreground'>
            Higher values make the output more random, lower values make it more focused and
            deterministic.
          </p>
        </div>

        {/* Max Tokens */}
        <div className='space-y-2'>
          <Label>Max Tokens: {settings.maxTokens}</Label>
          <Slider
            min={1}
            max={4096}
            step={1}
            value={[settings.maxTokens]}
            onValueChange={([value]) =>
              dispatch(
                updateSettings({
                  maxTokens: value,
                }),
              )
            }
          />
          <p className='text-sm text-muted-foreground'>
            The maximum number of tokens to generate in the response.
          </p>
        </div>

        {/* Top P */}
        <div className='space-y-2'>
          <Label>Top P: {settings.topP}</Label>
          <Slider
            min={0}
            max={1}
            step={0.1}
            value={[settings.topP]}
            onValueChange={([value]) =>
              dispatch(
                updateSettings({
                  topP: value,
                }),
              )
            }
          />
          <p className='text-sm text-muted-foreground'>
            Controls diversity via nucleus sampling: 0.5 means half of all likelihood-weighted
            options are considered.
          </p>
        </div>

        {/* Actions */}
        <div className='flex justify-end space-x-2 pt-4'>
          <Button variant='outline' onClick={() => router.push('/')}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
