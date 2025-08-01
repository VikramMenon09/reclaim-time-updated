import React, { useEffect, useRef, useState } from 'react';
import { Message, UserProfile } from '../types/social';

interface Props {
  chatId: string;
  friend: UserProfile;
}

export const ChatRoom: React.FC<Props> = ({ chatId, friend }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showSchedule, setShowSchedule] = useState(false);

  // TODO: Replace with real-time subscription (e.g., Firebase)
  useEffect(() => {
    // subscribeToMessages(chatId, setMessages);
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    // sendMessageToBackend(chatId, input);
    setInput('');
  };

  return (
    <div className="flex flex-col flex-1 h-full">
      {/* Chat header */}
      <div className="flex items-center justify-between p-4 border-b border-lavender bg-card dark:bg-[#181f3a]">
        <div className="flex items-center gap-3">
          <img src={friend.profilePicUrl || '/default-avatar.png'} className="w-10 h-10 rounded-full" />
          <span className="font-sora text-lg text-dark-bg dark:text-lavender">{friend.displayName}</span>
        </div>
        <button
          className="bg-accent text-white px-3 py-1 rounded-lg font-quicksand hover:bg-accent/80"
          onClick={() => setShowSchedule(true)}
        >
          Schedule
        </button>
      </div>
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-background dark:bg-[#101c3a]">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'} mb-2`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl text-base font-quicksand shadow-md transition-all duration-200
                ${msg.senderId === 'me'
                  ? 'bg-accent text-white dark:bg-[#6f42c1] dark:text-white'
                  : 'bg-lavender text-dark-bg dark:bg-[#2c2f57] dark:text-lavender'}
              `}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {/* Chat input */}
      <div className="p-2 flex gap-2 border-t border-lavender bg-card dark:bg-[#181f3a]">
        <input
          className="flex-1 rounded-lg px-3 py-2 bg-background dark:bg-[#101c3a] text-dark-bg dark:text-lavender"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message…"
        />
        <button
          className="bg-accent text-white px-4 py-2 rounded-lg"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
      {/* Schedule modal stub */}
      {showSchedule && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#181f3a] rounded-2xl p-8 shadow-xl">
            <h2 className="font-sora text-xl mb-4 text-dark-bg dark:text-lavender">Shared Calendar (Coming Soon)</h2>
            <button className="mt-4 bg-accent text-white px-4 py-2 rounded-lg" onClick={() => setShowSchedule(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 