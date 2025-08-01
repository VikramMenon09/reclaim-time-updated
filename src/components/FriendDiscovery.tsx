import React, { useState } from 'react';
import { Search, Filter, UserPlus, Users, BookOpen, MapPin, Star, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserProfile } from '@/types/social';
import { FriendCard } from './FriendCard';

interface FriendDiscoveryProps {
  onSendRequest: (userId: string) => void;
  onViewProfile: (user: UserProfile) => void;
}

// Mock data for discovery
const suggestedUsers: UserProfile[] = [
  {
    userId: '1',
    username: 'emma_wilson',
    displayName: 'Emma Wilson',
    profilePicUrl: '/default-avatar.png',
    friendList: [],
    status: 'online',
    bio: 'Computer Science major, loves coding and coffee ☕',
  },
  {
    userId: '2',
    username: 'david_kim',
    displayName: 'David Kim',
    profilePicUrl: '/default-avatar.png',
    friendList: [],
    status: 'studying',
    bio: 'Math tutor and chess enthusiast ♟️',
  },
  {
    userId: '3',
    username: 'sarah_johnson',
    displayName: 'Sarah Johnson',
    profilePicUrl: '/default-avatar.png',
    friendList: [],
    status: 'free',
    bio: 'Study group organizer and book lover 📚',
  },
  {
    userId: '4',
    username: 'mike_rodriguez',
    displayName: 'Mike Rodriguez',
    profilePicUrl: '/default-avatar.png',
    friendList: [],
    status: 'online',
    bio: 'Photography enthusiast and travel lover 📸',
  },
  {
    userId: '5',
    username: 'lisa_park',
    displayName: 'Lisa Park',
    profilePicUrl: '/default-avatar.png',
    friendList: [],
    status: 'busy',
    bio: 'Art and design major 🎨',
  },
];

const mutualConnections = [
  { userId: '1', mutualFriends: ['Maya Chen', 'Jordan Smith'] },
  { userId: '2', mutualFriends: ['Alex Rivera'] },
  { userId: '3', mutualFriends: ['Maya Chen', 'Sarah Johnson'] },
  { userId: '4', mutualFriends: ['Jordan Smith'] },
  { userId: '5', mutualFriends: ['Emma Wilson'] },
];

const commonInterests = [
  { userId: '1', interests: ['Computer Science', 'Coding', 'Coffee'] },
  { userId: '2', interests: ['Mathematics', 'Chess', 'Tutoring'] },
  { userId: '3', interests: ['Study Groups', 'Reading', 'Organization'] },
  { userId: '4', interests: ['Photography', 'Travel', 'Art'] },
  { userId: '5', interests: ['Art', 'Design', 'Creativity'] },
];

const commonClasses = [
  { userId: '1', classes: ['CS 101', 'Calculus I'] },
  { userId: '2', classes: ['Calculus I', 'Linear Algebra'] },
  { userId: '3', classes: ['English 101', 'Psychology 101'] },
  { userId: '4', classes: ['Art History', 'Photography 101'] },
  { userId: '5', classes: ['Design Principles', 'Art History'] },
];

export function FriendDiscovery({ onSendRequest, onViewProfile }: FriendDiscoveryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'mutual' | 'interests' | 'classes'>('all');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getMutualFriends = (userId: string) => {
    return mutualConnections.find(conn => conn.userId === userId)?.mutualFriends || [];
  };

  const getCommonInterests = (userId: string) => {
    return commonInterests.find(interest => interest.userId === userId)?.interests || [];
  };

  const getCommonClasses = (userId: string) => {
    return commonClasses.find(cls => cls.userId === userId)?.classes || [];
  };

  const filteredUsers = suggestedUsers.filter(user => {
    const matchesSearch = user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.bio?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    switch (activeFilter) {
      case 'mutual':
        return getMutualFriends(user.userId).length > 0;
      case 'interests':
        return getCommonInterests(user.userId).length > 0;
      case 'classes':
        return getCommonClasses(user.userId).length > 0;
      default:
        return true;
    }
  });

  const filters = [
    { id: 'all', label: 'All', icon: Users },
    { id: 'mutual', label: 'Mutual Friends', icon: Users },
    { id: 'interests', label: 'Common Interests', icon: Star },
    { id: 'classes', label: 'Same Classes', icon: BookOpen },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Discover Friends
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Find people with similar interests and classes
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <Input
          placeholder="Search by name or interests..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
        {filters.map((filter) => {
          const Icon = filter.icon;
          return (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id as any)}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                activeFilter === filter.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {filter.label}
            </button>
          );
        })}
      </div>

      {/* Discovery Stats */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-0">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {suggestedUsers.length}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">People to discover</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {suggestedUsers.filter(u => getMutualFriends(u.userId).length > 0).length}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Mutual connections</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {suggestedUsers.filter(u => getCommonClasses(u.userId).length > 0).length}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Same classes</div>
          </div>
        </div>
      </Card>

      {/* User Cards */}
      <div className="space-y-4">
        {filteredUsers.map((user) => {
          const mutualFriends = getMutualFriends(user.userId);
          const commonInterests = getCommonInterests(user.userId);
          const commonClasses = getCommonClasses(user.userId);

          return (
            <Card key={user.userId} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={user.profilePicUrl} />
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                      {getInitials(user.displayName)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                        {user.displayName}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        @{user.username}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      {user.bio}
                    </p>

                    {/* Connection Indicators */}
                    <div className="flex flex-wrap gap-2">
                      {mutualFriends.length > 0 && (
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400">
                          <Users className="w-3 h-3 mr-1" />
                          {mutualFriends.length} mutual friend{mutualFriends.length !== 1 ? 's' : ''}
                        </Badge>
                      )}
                      
                      {commonClasses.length > 0 && (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400">
                          <BookOpen className="w-3 h-3 mr-1" />
                          {commonClasses.length} class{commonClasses.length !== 1 ? 'es' : ''} together
                        </Badge>
                      )}
                      
                      {commonInterests.length > 0 && (
                        <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400">
                          <Star className="w-3 h-3 mr-1" />
                          {commonInterests.length} common interest{commonInterests.length !== 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button 
                    size="sm" 
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={() => onSendRequest(user.userId)}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Friend
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setSelectedUser(user)}
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <Card className="p-8 text-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950/20 dark:to-blue-950/20 border-0">
          <Search className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            No matches found
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Try adjusting your search or filters to find more people
          </p>
          <Button 
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setActiveFilter('all');
            }}
          >
            Clear Filters
          </Button>
        </Card>
      )}

      {/* Detailed Profile Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6 bg-white dark:bg-slate-800 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Profile Details
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedUser(null)}>
                ✕
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-3">
                  <AvatarImage src={selectedUser.profilePicUrl} />
                  <AvatarFallback className="text-2xl bg-blue-100 text-blue-700 font-semibold">
                    {getInitials(selectedUser.displayName)}
                  </AvatarFallback>
                </Avatar>
                <h4 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  {selectedUser.displayName}
                </h4>
                <p className="text-slate-600 dark:text-slate-400">
                  @{selectedUser.username}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  {selectedUser.bio}
                </p>
              </div>

              {/* Mutual Friends */}
              {getMutualFriends(selectedUser.userId).length > 0 && (
                <div>
                  <h5 className="font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Mutual Friends
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {getMutualFriends(selectedUser.userId).map((friend, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {friend}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Common Classes */}
              {getCommonClasses(selectedUser.userId).length > 0 && (
                <div>
                  <h5 className="font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Classes Together
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {getCommonClasses(selectedUser.userId).map((cls, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400">
                        {cls}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Common Interests */}
              {getCommonInterests(selectedUser.userId).length > 0 && (
                <div>
                  <h5 className="font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Common Interests
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {getCommonInterests(selectedUser.userId).map((interest, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button 
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={() => {
                    onSendRequest(selectedUser.userId);
                    setSelectedUser(null);
                  }}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Send Friend Request
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    onViewProfile(selectedUser);
                    setSelectedUser(null);
                  }}
                >
                  View Full Profile
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
} 