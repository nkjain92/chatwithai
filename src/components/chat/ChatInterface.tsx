'use client';

import React, { useEffect, useRef } from 'react';
import { useChat } from 'ai/react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createConversation, updateConversationTitle } from '@/store/slices/conversationsSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const ChatInterface = () => {
  const dispatch = useAppDispatch();
  const conversations = useAppSelector(state => state.conversations.conversations);
  const activeConversationId = useAppSelector(state => state.conversations.activeConversationId);
  const settings = useAppSelector(state => state.settings);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, error, reload } = useChat({
    api: '/api/chat',
    ...settings,
  });

  useEffect(() => {
    if (conversations.length === 0) {
      dispatch(createConversation());
    }
  }, [dispatch, conversations.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update conversation title based on first user message
  const updateTitle = (content: string) => {
    if (!activeConversationId) return;
    const title = content.split('\n')[0].slice(0, 40) + (content.length > 40 ? '...' : '');
    dispatch(updateConversationTitle({ id: activeConversationId, title }));
  };

  const handleMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || !activeConversationId) return;

    // Update title if this is the first message
    const activeConversation = conversations.find(c => c.id === activeConversationId);
    if (activeConversation && activeConversation.messages.length === 0) {
      updateTitle(input);
    }

    handleSubmit(e);
  };

  return (
    <div className='flex flex-col h-full'>
      <div className='flex-1 p-4 overflow-auto'>
        <div className='space-y-4'>
          {messages.map(message => (
            <div
              key={message.id}
              className={cn(
                'p-4 rounded-lg',
                message.role === 'user' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-muted',
                'max-w-[80%]',
              )}>
              <ReactMarkdown className='prose dark:prose-invert max-w-none'>
                {message.content}
              </ReactMarkdown>
            </div>
          ))}
          {error && (
            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>{error.message}</AlertDescription>
              <Button variant='outline' size='sm' className='ml-2' onClick={reload}>
                <RefreshCw className='h-4 w-4 mr-1' />
                Retry
              </Button>
            </Alert>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <form onSubmit={handleMessage} className='p-4 border-t'>
        <div className='flex gap-2'>
          <Input value={input} onChange={handleInputChange} placeholder='Type your message...' />
          <Button type='submit' disabled={isLoading || !input.trim()}>
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
