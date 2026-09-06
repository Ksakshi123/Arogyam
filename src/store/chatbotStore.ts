import { create } from "zustand";
import { ChatMessage } from "../types/chatbot";

interface ChatbotState {
  isOpen: boolean;
  messages: ChatMessage[];
  setIsOpen: (isOpen: boolean) => void;
  addMessage: (message: ChatMessage) => void;
  setMessages: (messages: ChatMessage[]) => void;
  clearMessages: () => void;
}

export const useChatbotStore = create<ChatbotState>((set) => ({
  isOpen: false,
  messages: [
    {
      id: "welcome-1",
      role: "assistant",
      content: "Namaste! I am Ayu, your personal wellness assistant. How can I help you with your diet or wellness journey today?",
      timestamp: new Date().toISOString(),
    }
  ],
  setIsOpen: (isOpen) => set({ isOpen }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages) => set({ messages }),
  clearMessages: () => set({ messages: [] }),
}));
