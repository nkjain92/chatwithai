'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Feedback submitted:', feedback);
    // In a real app, you would send this to your backend
    router.push('/');
  };

  return (
    <div className='container max-w-2xl py-8'>
      <h1 className='text-2xl font-bold mb-8'>Send Feedback</h1>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='space-y-2'>
          <label htmlFor='feedback' className='text-sm font-medium'>
            Your Feedback
          </label>
          <Textarea
            id='feedback'
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            placeholder='Tell us what you think about the chat experience...'
            className='min-h-[200px]'
          />
        </div>

        <div className='flex justify-end space-x-2'>
          <Button variant='outline' onClick={() => router.push('/')}>
            Cancel
          </Button>
          <Button type='submit' disabled={!feedback.trim()}>
            Submit Feedback
          </Button>
        </div>
      </form>
    </div>
  );
}
