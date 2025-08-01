import { WellnessCard } from '@/components/WellnessCard';
import { EventCard } from '@/components/EventCard';
import { TaskCard } from '@/components/TaskCard';
import { Sparkles, Calendar, CheckSquare, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { SettingsTab } from '@/components/SettingsTab';
import { useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  school?: string;
  avatar?: string;
}

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

interface HomePageProps {
  user: User;
  events: Event[];
}

export function HomePage({ user, events, onSettingsClick }: HomePageProps & { onSettingsClick?: () => void }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [username, setUsername] = useState(user.name || '');
  const handleUpdateUser = (updates: { username: string }) => setUsername(updates.username);
  const handleLogout = () => alert('Logged out!');

  const firstName = user.name.split(' ')[0];
  const currentHour = new Date().getHours();
  const greeting = (() => {
    if (currentHour >= 5 && currentHour < 12) return 'Good morning';
    if (currentHour >= 12 && currentHour < 18) return 'Good afternoon';
    if (currentHour >= 18 && currentHour < 22) return 'Good evening';
    return 'Good night';
  })();
  
  const tasks = events.filter(e => e.type === 'task');
  const todaysTasks = tasks.filter(task => !task.completed).slice(0, 3);
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const balanceScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const todayStr = new Date().toISOString().slice(0, 10);
  const todaysEvents = events.filter(e => e.type !== 'task' && e.date === todayStr);

  const streak = 1; // TODO: implement real streak logic

  // --- New Dashboard Metrics Logic ---
  // Time blocks
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const getBlock = (hour: number) => {
    if (hour < 12) return 'Morning';
    if (hour < 18) return 'Afternoon';
    return 'Evening';
  };
  const blocks = ['Morning', 'Afternoon', 'Evening'];
  // Example: Assume 8am-12pm, 12pm-6pm, 6pm-10pm
  const blockRanges = {
    Morning: [8, 12],
    Afternoon: [12, 18],
    Evening: [18, 22],
  };
  // Calculate available time in each block (placeholder: 4h/block minus events)
  const availableTime = blocks.map(block => {
    const [start, end] = blockRanges[block];
    // Find events in this block
    const blockEvents = events.filter(e => e.date === today && e.time &&
      parseInt(e.time.split(':')[0]) >= start && parseInt(e.time.split(':')[0]) < end);
    // Subtract event durations from 4h
    const used = blockEvents.reduce((sum, e) => sum + (e.duration || 0), 0);
    const free = Math.max(0, 4 * 60 - used); // in minutes
    return { block, free };
  });
  // Free time left today
  const freeTimeLeft = availableTime.reduce((sum, b) => sum + b.free, 0);
  // Week progress (placeholder: completed tasks this week / total tasks this week)
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);
  const weekTasks = events.filter(e => e.type === 'task' && new Date(e.date) >= weekStart && new Date(e.date) < weekEnd);
  const weekCompleted = weekTasks.filter(t => t.completed).length;
  const weekProgress = weekTasks.length > 0 ? Math.round((weekCompleted / weekTasks.length) * 100) : 0;
  // Study hours (sum durations of study tasks/events this week)
  const studyEvents = weekTasks.filter(t => t.title.toLowerCase().includes('study') || t.type === 'school');
  const studyMinutes = studyEvents.reduce((sum, e) => sum + (e.duration || 0), 0);
  const studyHours = (studyMinutes / 60).toFixed(1);
  // Auto-Plan handler (placeholder)
  const handleAutoPlan = () => {
    alert('Auto-Plan logic coming soon!');
  };

  return (
    <div className="space-y-6">
      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-w-lg w-full bg-white/90 dark:bg-[#232326]/90 rounded-2xl shadow-2xl p-0 border-0 backdrop-blur-xl pt-10">
          <SettingsTab
            user={{ email: user.email, username }}
            onUpdateUser={handleUpdateUser}
            onLogout={handleLogout}
            darkMode={darkMode}
            onToggleDarkMode={() => setDarkMode((d) => !d)}
          />
        </DialogContent>
      </Dialog>
      {/* Header with Settings Button */}
      <div className="relative text-center space-y-2">
        <button
          className="absolute right-0 top-0 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Settings"
          onClick={() => setSettingsOpen(true)}
        >
          <Settings className="w-6 h-6 text-slate-500 dark:text-slate-300" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {greeting}, {firstName} 👋
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Ready to fora your day?
        </p>
      </div>

      {/* Wellness Score */}
      <WellnessCard score={balanceScore} streak={streak} />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-xl border-l-4 border-l-blue-500">
          <div className="flex items-center space-x-2">
            <CheckSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Tasks Today</p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {todaysTasks.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-xl border-l-4 border-l-green-500">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Completed</p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {completedTasks}
              </p>
            </div>
          </div>
        </div>

        {/* New: Free Time Left */}
        <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-xl border-l-4 border-l-yellow-500 col-span-2">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-600 dark:text-yellow-400 font-bold">⏰</span>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Free Time Left Today</p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {Math.floor(freeTimeLeft / 60)}h {freeTimeLeft % 60}m
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* New: Available Time by Block */}
      <div className="grid grid-cols-3 gap-2 mt-2">
        {availableTime.map(b => (
          <div key={b.block} className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg text-center">
            <div className="font-semibold">{b.block}</div>
            <div className="text-blue-700 dark:text-blue-300">{Math.floor(b.free / 60)}h {b.free % 60}m</div>
          </div>
        ))}
      </div>

      {/* New: Week Progress & Study Hours */}
      <div className="flex flex-col md:flex-row gap-4 mt-2">
        <div className="flex-1 bg-purple-50 dark:bg-purple-950/20 p-4 rounded-xl border-l-4 border-l-purple-500">
          <div className="font-semibold text-purple-700 dark:text-purple-300">Week Progress</div>
          <div className="text-2xl font-bold">{weekProgress}%</div>
          <div className="text-sm text-slate-500">{weekCompleted} of {weekTasks.length} tasks done</div>
        </div>
        <div className="flex-1 bg-pink-50 dark:bg-pink-950/20 p-4 rounded-xl border-l-4 border-l-pink-500">
          <div className="font-semibold text-pink-700 dark:text-pink-300">Study Hours</div>
          <div className="text-2xl font-bold">{studyHours}h</div>
          <div className="text-sm text-slate-500">Logged this week</div>
        </div>
      </div>

      {/* New: Auto-Plan Button */}
      <div className="flex justify-center mt-4">
        <Button onClick={handleAutoPlan} className="w-full max-w-xs">Auto-Plan</Button>
      </div>

      {/* AI Suggestion */}
      <div className="wellness-gradient p-4 rounded-xl text-white">
        <div className="flex items-start space-x-3">
          <Sparkles className="w-5 h-5 mt-0.5" />
          <div>
            <h4 className="font-semibold mb-1">Smart Suggestion</h4>
            <p className="text-white/90 text-sm">
              You have {todaysTasks.length} tasks pending. Consider tackling the high-priority ones during your peak energy hours this afternoon.
            </p>
          </div>
        </div>
      </div>

      {/* Today's Events */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Today's Schedule
        </h3>
        
        {todaysEvents.length > 0 ? (
          todaysEvents.map(event => (
            <EventCard
              key={event.id}
              title={event.title}
              time={event.time || ''}
              type={event.type as any}
              location={event.location}
              attendees={event.attendees}
            />
          ))
        ) : (
          <p className="text-slate-500 dark:text-slate-400">No events today</p>
        )}
      </div>

      {/* Upcoming Tasks */}
      {todaysTasks.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Tasks Due Soon
          </h3>
          
          <div className="space-y-3">
            {todaysTasks.map((task) => (
              <TaskCard
                key={task.id}
                title={task.title}
                dueDate={task.date}
                duration={task.duration || 0}
                priority={task.priority || 1}
                energyLevel={task.energyLevel || 'medium'}
                completed={task.completed}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
