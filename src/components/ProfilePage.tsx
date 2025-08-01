import React, { useState } from 'react';
import { UserProfile } from '../types/social';

interface Props {
  user: UserProfile;
}

export const ProfilePage: React.FC<Props> = ({ user }) => {
  const [copied, setCopied] = useState(false);
  const profileUrl = `${window.location.origin}/u/${user.username || user.userId}`;

  return (
    <div className="max-w-md mx-auto p-6 bg-card rounded-2xl shadow">
      <div className="flex flex-col items-center">
        <img
          src={user.profilePicUrl || '/default-avatar.png'}
          alt="Profile"
          className="rounded-full w-24 h-24 object-cover"
        />
        <h2 className="font-sora text-2xl mt-2">{user.displayName || 'Set your name'}</h2>
        <p className="text-lavender mt-1">{user.bio}</p>
        <button
          onClick={() => { navigator.clipboard.writeText(profileUrl); setCopied(true); }}
          className="mt-3 bg-accent text-white rounded-lg px-4 py-2"
        >
          {copied ? 'Copied!' : 'Share Profile Link'}
        </button>
      </div>
    </div>
  );
}; 