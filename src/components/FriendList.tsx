import React from 'react';
import { UserProfile } from '../types/social';

interface Props {
  friends: UserProfile[];
  onSelect: (chatId: string) => void;
}

export const FriendList: React.FC<Props> = ({ friends, onSelect }) => (
  <div className="flex-1 overflow-y-auto p-4">
    <h3 className="font-sora text-lg mb-2">Friends</h3>
    {friends.map(friend => (
      <div
        key={friend.userId}
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/10 cursor-pointer"
        onClick={() => onSelect(friend.userId)}
      >
        <span className={`w-3 h-3 rounded-full ${friend.status === 'online' ? 'bg-green-400' : 'bg-gray-400'}`}></span>
        <img src={friend.profilePicUrl || '/default-avatar.png'} className="w-8 h-8 rounded-full" />
        <span className="font-quicksand">{friend.displayName}</span>
      </div>
    ))}
  </div>
); 