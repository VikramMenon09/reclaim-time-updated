import React, { useState } from 'react';
import { FriendList } from './FriendList';
import { ChatRoom } from './ChatRoom';
import { UserProfile } from '../types/social';

// Dummy data for friends (replace with real data/fetch from backend)
const dummyFriends: UserProfile[] = [
  {
    userId: '1',
    username: 'maya',
    displayName: 'Maya Chen',
    profilePicUrl: '/default-avatar.png',
    friendList: [],
    status: 'online',
  },
  {
    userId: '2',
    username: 'jordan',
    displayName: 'Jordan Smith',
    profilePicUrl: '/default-avatar.png',
    friendList: [],
    status: 'offline',
  },
];

export const ChatOverlay: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [activeChat, setActiveChat] = useState<string | null>(null);

  return (
    <>
      <button
        className="fixed bottom-6 right-6 z-50 bg-accent text-white rounded-full p-4 shadow-lg hover:bg-accent/80"
        onClick={() => setOpen(true)}
      >
        💬 Chat
      </button>
      {open && (
        <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
          <div className="w-full max-w-2xl h-full bg-background dark:bg-[#101c3a] shadow-2xl flex">
            <div className="w-1/3 border-r border-lavender bg-card dark:bg-[#181f3a] flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-lavender">
                <span className="font-sora text-lg text-dark-bg dark:text-lavender">Friends</span>
                <button className="text-accent" onClick={() => setOpen(false)}>✕</button>
              </div>
              <FriendList friends={dummyFriends} onSelect={setActiveChat} />
            </div>
            <div className="flex-1 flex flex-col bg-background dark:bg-[#101c3a]">
              {activeChat ? (
                <ChatRoom chatId={activeChat} friend={dummyFriends.find(f => f.userId === activeChat)!} />
              ) : (
                <div className="flex-1 flex items-center justify-center text-lavender dark:text-lavender">Select a friend to chat</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}; 