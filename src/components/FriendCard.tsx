import React from 'react';
import { MessageCircle, Calendar, Phone, Video, MoreVertical, Clock, MapPin, BookOpen, Coffee, Music, Gamepad2, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { UserProfile } from '@/types/social';

interface FriendCardProps {
  friend: UserProfile;
  mutualFreeTime?: string;
  mutualInterests?: string[];
  onMessage?: (friend: UserProfile) => void;
  onSchedule?: (friend: UserProfile) => void;
  onCall?: (friend: UserProfile) => void;
  onVideoCall?: (friend: UserProfile) => void;
  onViewProfile?: (friend: UserProfile) => void;
  showActions?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
}

const statusColors = {
  online: 'bg-green-500',
  busy: 'bg-yellow-500',
  free: 'bg-blue-500',
  studying: 'bg-purple-500',
  offline: 'bg-gray-400',
};

const statusIcons = {
  studying: <BookOpen className="w-3 h-3" />,
  free: <Coffee className="w-3 h-3" />,
  online: null,
  busy: null,
  offline: null,
};

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'studying': return 'Studying';
    case 'free': return 'Free to chat';
    case 'online': return 'Online';
    case 'busy': return 'Busy';
    case 'offline': return 'Offline';
    default: return 'Offline';
  }
};

export function FriendCard({ 
  friend, 
  mutualFreeTime, 
  mutualInterests = [],
  onMessage,
  onSchedule,
  onCall,
  onVideoCall,
  onViewProfile,
  showActions = true,
  variant = 'default'
}: FriendCardProps) {
  const status = friend.status || 'offline';
  const statusColor = statusColors[status as keyof typeof statusColors] || statusColors.offline;
  const statusIcon = statusIcons[status as keyof typeof statusIcons];

  if (variant === 'compact') {
    return (
      <Card className="p-3 hover:shadow-md transition-all duration-200 cursor-pointer" onClick={() => onViewProfile?.(friend)}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="w-10 h-10">
              <AvatarImage src={friend.profilePicUrl} />
              <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-sm">
                {getInitials(friend.displayName)}
              </AvatarFallback>
            </Avatar>
            <div className={cn(
              "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-800",
              statusColor
            )}>
              {statusIcon}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
              {friend.displayName}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {getStatusText(status)}
            </p>
          </div>
          {showActions && (
            <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); onMessage?.(friend); }}>
              <MessageCircle className="w-4 h-4" />
            </Button>
          )}
        </div>
      </Card>
    );
  }

  if (variant === 'detailed') {
    return (
      <Card className="p-4 hover:shadow-lg transition-all duration-200">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={friend.profilePicUrl} />
                  <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-lg">
                    {getInitials(friend.displayName)}
                  </AvatarFallback>
                </Avatar>
                <div className={cn(
                  "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-3 border-white dark:border-slate-800 flex items-center justify-center",
                  statusColor
                )}>
                  {statusIcon}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {friend.displayName}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  @{friend.username}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className={cn(
                    "text-xs",
                    status === 'online' && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                    status === 'busy' && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
                    status === 'free' && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                    status === 'studying' && "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                  )}>
                    {getStatusText(status)}
                  </Badge>
                </div>
              </div>
            </div>
            {showActions && (
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Bio */}
          {friend.bio && (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {friend.bio}
            </p>
          )}

          {/* Mutual Interests */}
          {mutualInterests.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Mutual Interests</h4>
              <div className="flex flex-wrap gap-2">
                {mutualInterests.map((interest, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Mutual Free Time */}
          {mutualFreeTime && (
            <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">Mutual Free Time</span>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400">{mutualFreeTime}</p>
            </div>
          )}

          {/* Action Buttons */}
          {showActions && (
            <div className="flex gap-2 pt-2">
              <Button 
                size="sm" 
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => onMessage?.(friend)}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Message
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                onClick={() => onSchedule?.(friend)}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Schedule
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onCall?.(friend)}
              >
                <Phone className="w-4 h-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onVideoCall?.(friend)}
              >
                <Video className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className="p-4 hover:shadow-md transition-all duration-200 cursor-pointer" onClick={() => onViewProfile?.(friend)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="w-12 h-12">
              <AvatarImage src={friend.profilePicUrl} />
              <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                {getInitials(friend.displayName)}
              </AvatarFallback>
            </Avatar>
            <div className={cn(
              "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center",
              statusColor
            )}>
              {statusIcon}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
              {friend.displayName}
            </h4>
            {friend.bio && (
              <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                {friend.bio}
              </p>
            )}
            <div className="flex items-center gap-2 mt-1">
              <span className={cn("w-2 h-2 rounded-full", statusColor)}></span>
              <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                {getStatusText(status)}
              </span>
            </div>
            {mutualFreeTime && (
              <div className="flex items-center gap-1 mt-1">
                <Clock className="w-3 h-3 text-green-500" />
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                  Free {mutualFreeTime}
                </span>
              </div>
            )}
          </div>
        </div>
        {showActions && (
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={(e) => { e.stopPropagation(); onMessage?.(friend); }}
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={(e) => { e.stopPropagation(); onSchedule?.(friend); }}
            >
              <Calendar className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
