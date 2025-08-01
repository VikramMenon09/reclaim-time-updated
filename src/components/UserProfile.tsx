import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Camera, User, Mail, School, Clock, Moon, Sun, LogOut } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  school?: string;
  avatar?: string;
}

interface UserProfileProps {
  user: User;
  onUpdateUser: (user: User) => void;
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function UserProfile({ user, onUpdateUser, onLogout, darkMode, onToggleDarkMode }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    school: user.school || '',
  });

  const handleSave = () => {
    onUpdateUser({
      ...user,
      ...formData,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      school: user.school || '',
    });
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-100 rounded-3xl shadow-md">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className="w-20 h-20">
              {user.avatar ? <AvatarImage src={user.avatar} /> : null}
              {user.name ? (
                <AvatarFallback className="text-lg font-semibold font-sora bg-blue-200 text-blue-700">
                  {getInitials(user.name)}
                </AvatarFallback>
              ) : (
                <AvatarFallback className="text-lg font-semibold font-sora bg-blue-100 text-blue-400">
                  <User className="w-8 h-8" />
                </AvatarFallback>
              )}
            </Avatar>
            {isEditing && (
              <button className="absolute -bottom-1 -right-1 p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500 smooth-transition">
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="flex-1">
            {user.name && (
              <h2 className="text-2xl font-bold font-sora text-blue-900 mb-1">{user.name}</h2>
            )}
            {user.email && (
              <p className="text-blue-700 font-quicksand">{user.email}</p>
            )}
            {user.school && (
              <p className="text-sm text-purple-600 font-quicksand flex items-center mt-1">
                <School className="w-4 h-4 mr-1" />
                {user.school}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Profile Information */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-100 rounded-3xl shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold font-sora text-blue-900">Profile Information</h3>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              Edit Profile
            </Button>
          ) : (
            <div className="space-x-2">
              <Button onClick={handleCancel} variant="outline" size="sm">
                Cancel
              </Button>
              <Button onClick={handleSave} size="sm">
                Save
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {user.name && (
            <div className="space-y-2">
              <Label htmlFor="name" className="font-quicksand text-blue-700">Full Name</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              ) : (
                <div className="flex items-center space-x-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <User className="w-4 h-4 text-slate-500" />
                  <span>{user.name}</span>
                </div>
              )}
            </div>
          )}

          {user.email && (
            <div className="space-y-2">
              <Label htmlFor="email" className="font-quicksand text-blue-700">Email</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              ) : (
                <div className="flex items-center space-x-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <Mail className="w-4 h-4 text-slate-500" />
                  <span>{user.email}</span>
                </div>
              )}
            </div>
          )}

          {user.school && (
            <div className="space-y-2">
              <Label htmlFor="school" className="font-quicksand text-purple-600">School (Optional)</Label>
              {isEditing ? (
                <Input
                  id="school"
                  value={formData.school}
                  onChange={(e) => setFormData(prev => ({ ...prev, school: e.target.value }))}
                  placeholder="Enter your school name"
                />
              ) : (
                <div className="flex items-center space-x-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <School className="w-4 h-4 text-slate-500" />
                  <span>{user.school || 'Not specified'}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* App Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          App Settings
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-slate-500">Toggle dark/light theme</p>
              </div>
            </div>
            <button
              onClick={onToggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                darkMode ? 'bg-blue-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center space-x-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <Clock className="w-4 h-4 text-slate-500" />
            <div>
              <p className="font-medium">Energy Profile</p>
              <p className="text-sm text-slate-500">Coming soon - Set your peak productivity hours</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Logout */}
      <Card className="p-6">
        <Button 
          onClick={onLogout}
          variant="destructive"
          className="w-full flex items-center justify-center space-x-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </Button>
      </Card>
    </div>
  );
}
