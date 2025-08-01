export interface UserProfile {
  userId: string;
  username: string;
  displayName: string;
  profilePicUrl?: string;
  bio?: string;
  friendList: string[];
  status?: 'online' | 'offline' | 'busy' | 'free' | 'studying';
}

export interface FriendRequest {
  from: string;
  to: string;
  status: 'pending' | 'accepted' | 'blocked';
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: 'text' | 'emoji' | 'attachment';
  timestamp: number;
  seenBy: string[];
  reactions?: { [userId: string]: string };
}

export interface Chat {
  chatId: string;
  members: string[];
  isGroup: boolean;
  groupName?: string;
  createdAt: number;
} 