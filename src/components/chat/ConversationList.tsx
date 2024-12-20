'use client';

import React, { useState } from 'react';
import { Trash2, MessageSquare, Edit2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  createConversation,
  deleteConversation,
  setActiveConversation,
  updateConversationTitle,
} from '@/store/slices/conversationsSlice';
import { cn } from '@/lib/utils';

export const ConversationList = () => {
  const dispatch = useAppDispatch();
  const conversations = useAppSelector(state => state.conversations.conversations);
  const activeConversationId = useAppSelector(state => state.conversations.activeConversationId);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleCreateConversation = () => {
    dispatch(createConversation());
  };

  const handleSelectConversation = (id: string) => {
    dispatch(setActiveConversation(id));
  };

  const handleDeleteConversation = (id: string) => {
    dispatch(deleteConversation(id));
  };

  const startEditing = (id: string, title: string) => {
    setEditingId(id);
    setEditTitle(title);
  };

  const handleUpdateTitle = (id: string) => {
    if (editTitle.trim()) {
      dispatch(updateConversationTitle({ id, title: editTitle }));
    }
    setEditingId(null);
    setEditTitle('');
  };

  return (
    <div className='w-64 border-r h-full flex flex-col'>
      <div className='p-4 border-b'>
        <Button onClick={handleCreateConversation} className='w-full'>
          New Chat
        </Button>
      </div>
      <div className='flex-1 overflow-auto p-2 space-y-2'>
        {conversations.map(conversation => (
          <div
            key={conversation.id}
            className={cn(
              'flex items-center gap-2 p-2 rounded-lg hover:bg-muted cursor-pointer group',
              conversation.id === activeConversationId && 'bg-muted',
            )}
            onClick={() => handleSelectConversation(conversation.id)}>
            <MessageSquare className='w-4 h-4' />
            {editingId === conversation.id ? (
              <Input
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                onBlur={() => handleUpdateTitle(conversation.id)}
                onKeyDown={e => e.key === 'Enter' && handleUpdateTitle(conversation.id)}
                autoFocus
                className='h-6'
              />
            ) : (
              <>
                <span className='flex-1 truncate'>{conversation.title}</span>
                <div className='hidden group-hover:flex items-center gap-1'>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-6 w-6'
                    onClick={e => {
                      e.stopPropagation();
                      startEditing(conversation.id, conversation.title);
                    }}>
                    <Edit2 className='w-4 h-4' />
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-6 w-6'
                    onClick={e => {
                      e.stopPropagation();
                      handleDeleteConversation(conversation.id);
                    }}>
                    <Trash2 className='w-4 h-4' />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationList;
