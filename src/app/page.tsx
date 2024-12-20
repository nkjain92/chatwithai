'use client';

import dynamic from 'next/dynamic';

const ChatInterface = dynamic(() => import('@/components/chat/ChatInterface'), {
  ssr: false,
});

const ConversationList = dynamic(() => import('@/components/chat/ConversationList'), {
  ssr: false,
});

export default function Home() {
  return (
    <main className='flex h-screen'>
      <ConversationList />
      <div className='flex-1'>
        <ChatInterface />
      </div>
    </main>
  );
}
