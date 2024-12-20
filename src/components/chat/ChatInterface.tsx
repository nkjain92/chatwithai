'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addMessage,
  createConversation,
  updateConversationTitle,
} from '@/store/slices/conversationsSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Message } from '@/store/slices/conversationsSlice';

export const ChatInterface = () => {
  const dispatch = useAppDispatch();
  const conversations = useAppSelector(state => state.conversations.conversations);
  const activeConversationId = useAppSelector(state => state.conversations.activeConversationId);
  const settings = useAppSelector(state => state.settings);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<{ userMessage: Message; assistantMessage: Message } | null>(null);

  useEffect(() => {
    if (conversations.length === 0) {
      dispatch(createConversation());
    }
  }, [dispatch, conversations.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations]);

  // Update conversation title based on first user message
  const updateTitle = (conversationId: string, content: string) => {
    const title = content.split('\n')[0].slice(0, 40) + (content.length > 40 ? '...' : '');
    dispatch(updateConversationTitle({ id: conversationId, title }));
  };

  const sendMessage = async (userMessage: Message) => {
    if (!activeConversationId) return;

    setError(null);
    setIsLoading(true);

    try {
      const activeConversation = conversations.find(c => c.id === activeConversationId);
      if (!activeConversation) throw new Error('Conversation not found');

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            ...activeConversation.messages,
            { role: userMessage.role, content: userMessage.content },
          ],
          ...settings,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let content = '';

      if (!reader) throw new Error('No response body');

      // Create a single message that we'll update as we receive chunks
      const assistantMessage = {
        id: Date.now().toString(),
        role: 'assistant' as const,
        content: '',
        createdAt: new Date().toISOString(),
      };

      lastMessageRef.current = { userMessage, assistantMessage };

      // Add the initial empty message
      dispatch(addMessage({ conversationId: activeConversationId, message: assistantMessage }));

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        content += text;

        // Update the existing message with new content
        dispatch(
          addMessage({
            conversationId: activeConversationId,
            message: { ...assistantMessage, content },
          }),
        );
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeConversationId) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: input,
      createdAt: new Date().toISOString(),
    };

    dispatch(addMessage({ conversationId: activeConversationId, message: userMessage }));

    // Update title if this is the first message
    const activeConversation = conversations.find(c => c.id === activeConversationId);
    if (activeConversation && activeConversation.messages.length === 0) {
      updateTitle(activeConversationId, input);
    }

    setInput('');
    await sendMessage(userMessage);
  };

  const handleRetry = async () => {
    if (!lastMessageRef.current || !activeConversationId) return;

    const { userMessage } = lastMessageRef.current;

    // Remove the last assistant message
    const activeConversation = conversations.find(c => c.id === activeConversationId);
    if (!activeConversation) return;

    // Retry sending the last user message
    await sendMessage(userMessage);
  };

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  return (
    <div className='flex flex-col h-full'>
      <div className='flex-1 p-4 overflow-auto'>
        <div className='space-y-4'>
          {activeConversation?.messages.map(message => (
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
              <AlertDescription>{error}</AlertDescription>
              <Button variant='outline' size='sm' className='ml-2' onClick={handleRetry}>
                <RefreshCw className='h-4 w-4 mr-1' />
                Retry
              </Button>
            </Alert>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <form onSubmit={handleSubmit} className='p-4 border-t'>
        <div className='flex gap-2'>
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder='Type your message...'
          />
          <Button type='submit' disabled={isLoading || !input.trim()}>
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
