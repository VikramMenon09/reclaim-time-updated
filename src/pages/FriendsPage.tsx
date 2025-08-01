import React, { useState, useEffect } from 'react';
import { UserProfile, FriendRequest } from '../types/social';
import { ChatRoom } from '../components/ChatRoom';
import { FriendDiscovery } from '../components/FriendDiscovery';
import { 
  Plus, 
  Users2, 
  Calendar, 
  Search, 
  Filter, 
  UserPlus, 
  Clock, 
  MapPin, 
  BookOpen,
  Music,
  Gamepad2,
  Coffee,
  Heart,
  Star,
  MessageCircle,
  Video,
  Phone,
  MoreVertical,
  X,
  Check,
  UserX,
  Compass
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface Event {
  id: number;
  title: string;
  description?: string;
  date: string;
  time?: string;
  duration?: number;
  priority?: 1 | 2 | 3 | 4 | 5;
  energyLevel?: 'low' | 'medium' | 'high';
  completed?: boolean;
  type: 'task' | 'school' | 'social' | 'custom';
  location?: string;
  attendees?: number;
  collaborativeId?: string;
}

interface FriendsPageProps {
  events: Event[];
}

// Enhanced dummy data
const dummyFriends: UserProfile[] = [
  {
    userId: '1',
    username: 'maya',
    displayName: 'Maya Chen',
    profilePicUrl: '/default-avatar.png',
    friendList: [],
    status: 'online',
    bio: 'Loves math and music 🎵',
  },
  {
    userId: '2',
    username: 'jordan',
    displayName: 'Jordan Smith',
    profilePicUrl: '/default-avatar.png',
    friendList: [],
    status: 'busy',
    bio: 'Soccer captain ⚽',
  },
  {
    userId: '3',
    username: 'sarah',
    displayName: 'Sarah Johnson',
    profilePicUrl: '/default-avatar.png',
    friendList: [],
    status: 'studying',
    bio: 'Computer science major 💻',
  },
  {
    userId: '4',
    username: 'mike',
    displayName: 'Mike Rodriguez',
    profilePicUrl: '/default-avatar.png',
    friendList: [],
    status: 'free',
    bio: 'Photography enthusiast 📸',
  },
];

const dummyRequests: FriendRequest[] = [
  { from: '5', to: 'me', status: 'pending' },
  { from: '6', to: 'me', status: 'pending' },
];

const dummyProfiles: Record<string, UserProfile> = {
  '5': {
    userId: '5',
    username: 'alex',
    displayName: 'Alex Rivera',
    profilePicUrl: '/default-avatar.png',
    friendList: [],
    status: 'offline',
    bio: 'Science club president 🔬',
  },
  '6': {
    userId: '6',
    username: 'emma',
    displayName: 'Emma Wilson',
    profilePicUrl: '/default-avatar.png',
    friendList: [],
    status: 'online',
    bio: 'Art and design lover 🎨',
  },
};

// Friend suggestions based on common interests
const friendSuggestions: UserProfile[] = [
  {
    userId: '7',
    username: 'david',
    displayName: 'David Kim',
    profilePicUrl: '/default-avatar.png',
    friendList: [],
    status: 'online',
    bio: 'Math tutor and chess player ♟️',
  },
  {
    userId: '8',
    username: 'lisa',
    displayName: 'Lisa Park',
    profilePicUrl: '/default-avatar.png',
    friendList: [],
    status: 'free',
    bio: 'Study group organizer 📚',
  },
];

const statusOptions = ['online', 'busy', 'free', 'studying', 'offline'];

// Mutual free time data
const mutualFreeTime = [
  { friendId: '1', time: '2:00 PM - 4:00 PM', day: 'Today' },
  { friendId: '4', time: '6:00 PM - 8:00 PM', day: 'Tomorrow' },
  { friendId: '2', time: '10:00 AM - 12:00 PM', day: 'Saturday' },
];

export function FriendsPage({ events }: FriendsPageProps) {
  const [friends, setFriends] = useState<UserProfile[]>(dummyFriends);
  const [requests, setRequests] = useState<FriendRequest[]>(dummyRequests);
  const [suggestions] = useState<UserProfile[]>(friendSuggestions);
  const [chatFriend, setChatFriend] = useState<UserProfile | null>(null);
  const [showSchedule, setShowSchedule] = useState<UserProfile | null>(null);
  const [profilePreview, setProfilePreview] = useState<UserProfile | null>(null);
  const [myStatus, setMyStatus] = useState('online');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'suggestions' | 'discover'>('friends');
  const [showAddFriend, setShowAddFriend] = useState(false);

  const acceptRequest = (req: FriendRequest) => {
    setFriends(f => [...f, dummyProfiles[req.from]]);
    setRequests(r => r.filter(rq => rq !== req));
  };

  const rejectRequest = (req: FriendRequest) => {
    setRequests(r => r.filter(rq => rq !== req));
  };

  const unfriend = (friend: UserProfile) => {
    setFriends(f => f.filter(fr => fr.userId !== friend.userId));
  };

  const handleSendFriendRequest = (userId: string) => {
    // In real app, this would call the API
    console.log('Sending friend request to:', userId);
    // Add to requests for demo
    const newRequest: FriendRequest = { from: userId, to: 'me', status: 'pending' };
    setRequests(prev => [...prev, newRequest]);
  };

  const handleViewProfile = (user: UserProfile) => {
    setProfilePreview(user);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'busy': return 'bg-yellow-400';
      case 'free': return 'bg-blue-400';
      case 'studying': return 'bg-purple-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'studying': return <BookOpen className="w-3 h-3" />;
      case 'free': return <Coffee className="w-3 h-3" />;
      default: return null;
    }
  };

  const filteredFriends = friends.filter(friend =>
    friend.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.bio?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Friends
          </h1>
          <p className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${getStatusColor('online')}`}></span>
            {friends.filter(f => f.status === 'online').length} friends online
          </p>
        </div>
        <Button 
          onClick={() => setShowAddFriend(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full p-3"
        >
          <UserPlus className="w-5 h-5" />
        </Button>
      </div>

      {/* Enhanced Status Setting */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-700 dark:text-slate-300">My Status:</span>
            <select
              className="rounded-lg px-3 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500"
              value={myStatus}
              onChange={e => setMyStatus(e.target.value)}
            >
              {statusOptions.map(opt => (
                <option key={opt} value={opt}>
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </option>
              ))}
            </select>
            <div className={`w-3 h-3 rounded-full ${getStatusColor(myStatus)}`}></div>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            Active
          </Badge>
        </div>
      </Card>

      {/* Search and Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600"
          />
        </div>
        <Button variant="outline" className="px-3">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-slate-100 dark:bg-slate-800 rounded-2xl p-1 w-full max-w-md mx-auto">
        {[
          { id: 'friends', label: 'Friends', count: friends.length, icon: Users2 },
          { id: 'requests', label: 'Requests', count: requests.length, icon: UserPlus },
          { id: 'suggestions', label: 'Suggestions', count: suggestions.length, icon: Star },
          { id: 'discover', label: 'Discover', count: 0, icon: Compass }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex flex-col items-center justify-center py-2 rounded-xl text-sm font-medium transition-all gap-1 shadow-sm border-2 border-transparent min-w-0 mx-0.5 ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 border-blue-300 dark:border-blue-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 bg-transparent'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="truncate">{tab.label}</span>
              {tab.count > 0 && (
                <span className="mt-0.5 px-2 py-0.5 rounded-full bg-purple-200 text-purple-800 text-xs font-semibold">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Discover Tab Content */}
      {activeTab === 'discover' && (
        <FriendDiscovery 
          onSendRequest={handleSendFriendRequest}
          onViewProfile={handleViewProfile}
        />
      )}

      {/* Mutual Free Time Section */}
      {activeTab === 'friends' && mutualFreeTime.length > 0 && (
        <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-0">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-slate-700 dark:text-slate-300">Mutual Free Time</h3>
          </div>
          <div className="space-y-2">
            {mutualFreeTime.map((item, index) => {
              const friend = friends.find(f => f.userId === item.friendId);
              if (!friend) return null;
              
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={friend.profilePicUrl} />
                      <AvatarFallback className="text-sm bg-blue-100 text-blue-700">
                        {getInitials(friend.displayName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-slate-700 dark:text-slate-300">{friend.displayName}</p>
                      <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.time} • {item.day}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                    Schedule
                  </Button>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Content based on active tab */}
      {activeTab === 'friends' && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Users2 className="w-5 h-5 text-blue-500" />
            <span>Your Friends ({filteredFriends.length})</span>
          </h2>
          
          <div className="space-y-3">
            {filteredFriends.map((friend) => (
              <Card key={friend.userId} className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setProfilePreview(friend)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={friend.profilePicUrl} />
                        <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                          {getInitials(friend.displayName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 ${getStatusColor(friend.status || 'offline')}`}>
                        {getStatusIcon(friend.status || 'offline')}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">{friend.displayName}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{friend.bio}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`w-2 h-2 rounded-full ${getStatusColor(friend.status || 'offline')}`}></span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                          {friend.status || 'offline'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setChatFriend(friend); }}>
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setShowSchedule(friend); }}>
                      <Calendar className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); }}>
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'requests' && requests.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-orange-500" />
            <span>Friend Requests ({requests.length})</span>
          </h2>
          
          <div className="space-y-3">
            {requests.map(req => (
              <Card key={req.from} className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={dummyProfiles[req.from].profilePicUrl} />
                      <AvatarFallback className="bg-orange-100 text-orange-700 font-semibold">
                        {getInitials(dummyProfiles[req.from].displayName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                        {dummyProfiles[req.from].displayName}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {dummyProfiles[req.from].bio}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="bg-green-500 hover:bg-green-600 text-white"
                      onClick={() => acceptRequest(req)}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => rejectRequest(req)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'suggestions' && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span>People You May Know</span>
          </h2>
          
          <div className="space-y-3">
            {suggestions.map((suggestion) => (
              <Card key={suggestion.userId} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={suggestion.profilePicUrl} />
                      <AvatarFallback className="bg-purple-100 text-purple-700 font-semibold">
                        {getInitials(suggestion.displayName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">{suggestion.displayName}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{suggestion.bio}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`w-2 h-2 rounded-full ${getStatusColor(suggestion.status || 'offline')}`}></span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                          {suggestion.status || 'offline'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={() => handleSendFriendRequest(suggestion.userId)}
                  >
                    <UserPlus className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Add Friend CTA */}
      {activeTab === 'friends' && friends.length === 0 && (
        <Card className="p-8 text-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-0">
          <Users2 className="w-16 h-16 text-purple-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Start Building Your Network
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-sm mx-auto">
            Connect with friends to find mutual free time, study together, and make your academic journey more collaborative.
          </p>
          <div className="flex gap-3 justify-center">
            <Button 
              className="bg-purple-500 hover:bg-purple-600 text-white"
              onClick={() => setActiveTab('discover')}
            >
              <Compass className="w-4 h-4 mr-2" />
              Discover Friends
            </Button>
            <Button variant="outline">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </Card>
      )}

      {/* Add Friend Modal */}
      {showAddFriend && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6 bg-white dark:bg-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Add Friends</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowAddFriend(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Search by username or email
                </label>
                <Input placeholder="Enter username or email" />
              </div>
              <div className="flex gap-2">
                <Button className="flex-1">Search</Button>
                <Button variant="outline" className="flex-1">Scan QR Code</Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Enhanced Chat overlay */}
      {chatFriend && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="w-full max-w-2xl h-[600px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex overflow-hidden">
            <div className="flex-1 flex flex-col">
              <ChatRoom chatId={chatFriend.userId} friend={chatFriend} />
              <Button 
                className="absolute top-4 right-4 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-600" 
                onClick={() => setChatFriend(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Schedule modal */}
      {showSchedule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl p-6 bg-white dark:bg-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Schedule with {showSchedule.displayName}
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setShowSchedule(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Mutual Free Time</h3>
                <p className="text-blue-700 dark:text-blue-300">Feature coming soon - View and schedule shared free time</p>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1">View Calendar</Button>
                <Button variant="outline" className="flex-1">Send Invite</Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Enhanced Profile preview modal */}
      {profilePreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-sm p-6 bg-white dark:bg-slate-800">
            <div className="flex flex-col items-center text-center">
              <Avatar className="w-20 h-20 mb-4">
                <AvatarImage src={profilePreview.profilePicUrl} />
                <AvatarFallback className="text-2xl bg-blue-100 text-blue-700 font-semibold">
                  {getInitials(profilePreview.displayName)}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-1">
                {profilePreview.displayName}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-3">{profilePreview.bio}</p>
              <div className="flex items-center gap-2 mb-4">
                <span className={`w-3 h-3 rounded-full ${getStatusColor(profilePreview.status || 'offline')}`}></span>
                <span className="text-sm text-slate-500 dark:text-slate-400 capitalize">
                  {profilePreview.status || 'offline'}
                </span>
              </div>
              <div className="flex gap-2 w-full">
                <Button 
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={() => { setChatFriend(profilePreview); setProfilePreview(null); }}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => { setShowSchedule(profilePreview); setProfilePreview(null); }}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule
                </Button>
              </div>
              <Button 
                variant="destructive" 
                className="w-full mt-3"
                onClick={() => { unfriend(profilePreview); setProfilePreview(null); }}
              >
                <UserX className="w-4 h-4 mr-2" />
                Unfriend
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
