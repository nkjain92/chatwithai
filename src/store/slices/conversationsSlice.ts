import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

interface ConversationsState {
  conversations: Conversation[];
  activeConversationId: string | null;
}

const initialState: ConversationsState = {
  conversations: [],
  activeConversationId: null,
};

export const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    createConversation: state => {
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: 'New Chat',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.conversations.push(newConversation);
      state.activeConversationId = newConversation.id;
    },
    setActiveConversation: (state, action: PayloadAction<string>) => {
      state.activeConversationId = action.payload;
    },
    deleteConversation: (state, action: PayloadAction<string>) => {
      state.conversations = state.conversations.filter(conv => conv.id !== action.payload);
      if (state.activeConversationId === action.payload) {
        state.activeConversationId = state.conversations[0]?.id || null;
      }
    },
    updateConversationTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const conversation = state.conversations.find(conv => conv.id === action.payload.id);
      if (conversation) {
        conversation.title = action.payload.title;
        conversation.updatedAt = new Date().toISOString();
      }
    },
    addMessage: (state, action: PayloadAction<{ conversationId: string; message: Message }>) => {
      const conversation = state.conversations.find(
        conv => conv.id === action.payload.conversationId,
      );
      if (conversation) {
        // Check if a message with this ID already exists
        const existingMessageIndex = conversation.messages.findIndex(
          msg => msg.id === action.payload.message.id,
        );

        if (existingMessageIndex !== -1) {
          // Update existing message
          conversation.messages[existingMessageIndex] = action.payload.message;
        } else {
          // Add new message
          conversation.messages.push(action.payload.message);
        }
        conversation.updatedAt = new Date().toISOString();
      }
    },
  },
});

export const {
  createConversation,
  setActiveConversation,
  deleteConversation,
  updateConversationTitle,
  addMessage,
} = conversationsSlice.actions;

export default conversationsSlice.reducer;
