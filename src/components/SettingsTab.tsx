import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Mail, User, Lock, Moon, Sun, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SettingsTabProps {
  user: { email: string; username: string; avatar?: string };
  onUpdateUser: (updates: { username: string }) => void;
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function SettingsTab({ user, onUpdateUser, onLogout, darkMode, onToggleDarkMode }: SettingsTabProps) {
  const [username, setUsername] = useState(user.username);
  const [editing, setEditing] = useState(false);

  const handleSave = () => {
    onUpdateUser({ username });
    setEditing(false);
  };

  // Glassmorphic input style
  const inputClass =
    'bg-white/70 dark:bg-[#232326] border border-[#E0E0E0] dark:border-[#333] rounded-lg px-10 py-2 focus:border-primary focus:ring-2 focus:ring-primary transition placeholder:text-slate-400 text-base w-full';

  // Icon inside input wrapper
  const iconWrapper =
    'absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none';

  // Card style
  const cardClass =
    'relative bg-white dark:bg-[#2B2B2E] rounded-2xl shadow-lg p-6 mb-6 transition-all';

  // Section title
  const sectionTitle = 'flex items-center text-lg font-semibold mb-4 gap-2';

  // Divider
  const divider = 'border-b border-[#E0E0E0] dark:border-[#333] my-3';

  // Avatar fallback
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="max-w-md w-full px-2 py-4 mx-auto max-h-[80vh] overflow-y-auto flex flex-col items-center justify-center gap-4">
      {/* Profile Info Card */}
      <div className={cardClass + ' w-full max-w-sm mx-auto pt-20 relative'}>
        {/* Floating Avatar Blurb */}
        <div className="absolute left-1/2 -top-8 -translate-x-1/2 z-10">
          <div className="rounded-full bg-white dark:bg-[#232326] shadow-lg p-2 flex items-center justify-center" style={{ boxShadow: '0 4px 16px rgba(76,110,220,0.10)' }}>
            <Avatar className="w-20 h-20">
              {user.avatar ? <AvatarImage src={user.avatar} /> : null}
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl">
                {getInitials(username) || (username[0] || '').toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div className="flex flex-col items-center mb-4 mt-2">
          <div className="text-xl font-bold text-slate-900 dark:text-white mt-2">{username}</div>
        </div>
        <div className={sectionTitle}><span>🔒</span> Profile Info</div>
        <div className={divider} />
        {/* Email */}
        <div className="relative mb-4">
          <span className={iconWrapper}><Mail className="w-5 h-5" /></span>
          <Input id="email" value={user.email} disabled className={inputClass + ' pl-10'} />
        </div>
        {/* Password (locked) */}
        <div className="relative mb-4">
          <span className={iconWrapper}><Lock className="w-5 h-5" /></span>
          <Input id="password" value="********" disabled className={inputClass + ' pl-10'} />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">(Change soon)</span>
        </div>
        {/* Username */}
        <div className="relative mb-2 flex items-center">
          <span className={iconWrapper}><User className="w-5 h-5" /></span>
          <Input
            id="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            disabled={!editing}
            className={inputClass + ' pl-10 pr-20'}
          />
          {!editing ? (
            <Button size="sm" variant="outline" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={() => setEditing(true)}>
              Edit
            </Button>
          ) : (
            <Button size="sm" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={handleSave}>
              Save
            </Button>
          )}
        </div>
      </div>

      {/* App Settings Card */}
      <div className={cardClass + ' w-full max-w-sm mx-auto'}>
        <div className={sectionTitle}><span>⚙️</span> App Settings</div>
        <div className={divider} />
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            {darkMode ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
            <span className="font-medium">Dark Mode</span>
          </div>
          <Switch
            checked={darkMode}
            onCheckedChange={onToggleDarkMode}
            className="data-[state=checked]:bg-[#4C6EDC] data-[state=unchecked]:bg-[#E0E0E0] transition-colors duration-300"
          >
            <span className="sr-only">Toggle dark mode</span>
          </Switch>
        </div>
      </div>

      {/* Logout Card */}
      <div className={cardClass + ' w-full max-w-sm mx-auto flex justify-center items-center p-4'}>
        <Button
          onClick={onLogout}
          variant="ghost"
          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-full text-white bg-[#E94B4B] hover:bg-[#D74242] shadow-sm hover:shadow-lg transition-all text-base font-semibold"
        >
          <span className="text-lg">↩️</span>
          Log Out
        </Button>
      </div>
    </div>
  );
} 