import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, endOfWeek } from 'date-fns';
import { Plus, Users, BookOpen, Star, User, Flag, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import '@/styles/calendar-custom.css';
import CollaborativeCalendarPage from './CollaborativeCalendarPage';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

// Use the Event interface from App.tsx
interface Event {
  id: number;
  title: string;
  description?: string;
  date: string; // ISO string
  time?: string; // e.g. '14:00' or '2:00 PM'
  duration?: number;
  priority?: 1 | 2 | 3 | 4 | 5;
  energyLevel?: 'low' | 'medium' | 'high';
  completed?: boolean;
  type: 'task' | 'school' | 'social' | 'custom' | 'class' | 'club' | 'study' | 'personal';
  location?: string;
  attendees?: number;
  collaborativeId?: string;
}

const eventColors = {
  class: 'bg-[#b2aaff]',
  club: 'bg-[#6f42c1]',
  personal: 'bg-[#cbb8f5]',
  study: 'bg-[#a7f3d0]',
  social: 'bg-[#b2f2bb]',
  task: 'bg-[#fbbf24]',
  school: 'bg-[#b2aaff]',
  custom: 'bg-[#cbb8f5]'
};

const VIEW_MODES = ['month', 'week', 'day'] as const;
type ViewMode = typeof VIEW_MODES[number];

interface CalendarPageProps {
  events: Event[];
  onAddEvent?: (eventData: Omit<Event, 'id'>) => void;
  showCollaborativeSection?: boolean;
}

export function CalendarPage({ events = [], onAddEvent, showCollaborativeSection }: CalendarPageProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDay, setModalDay] = useState('');
  const [topTab, setTopTab] = useState<'personal' | 'collab'>('personal');
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState<{
    title: string;
    date: string;
    time: string;
    description: string;
    type: 'task';
    priority: 1 | 2 | 3 | 4 | 5;
    energyLevel: 'low' | 'medium' | 'high';
  }>({
    title: '',
    date: format(selectedDate, 'yyyy-MM-dd'),
    time: '',
    description: '',
    type: 'task',
    priority: 3,
    energyLevel: 'medium'
  });
  const [sortMode, setSortMode] = useState<'priority' | 'urgency' | 'workload'>('priority');

  // Map events by date string
  const eventsByDate = events.reduce((acc, ev) => {
    acc[ev.date] = acc[ev.date] || [];
    acc[ev.date].push(ev);
    return acc;
  }, {} as Record<string, Event[]>);

  // Get calendar days for current month view
  const getCalendarDays = (date: Date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const startDate = startOfWeek(start, { weekStartsOn: 0 });
    const endDate = endOfWeek(end, { weekStartsOn: 0 });
    
    return eachDayOfInterval({ start: startDate, end: endDate });
  };

  const calendarDays = getCalendarDays(selectedDate);

  // Icons for view switch
  const VIEW_ICONS = {
    month: '📆',
    week: '🗓️',
    day: '🌤️',
  };

  // Calendar tile content: event dots
  function tileContent({ date, view }: { date: Date; view: string }) {
    if (view !== 'month') return null;
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayEvents = eventsByDate[dateStr] || [];
    if (!dayEvents.length) return null;
    
    // Separate tasks from other events
    const tasks = dayEvents.filter(ev => ev.type === 'task');
    const otherEvents = dayEvents.filter(ev => ev.type !== 'task');
    
    return (
      <div className="flex flex-col gap-1 mt-1">
        {/* Task indicator */}
        {tasks.length > 0 && (
          <div className="flex justify-center">
            <div className="flex items-center gap-1 bg-[#fbbf24] rounded-full px-2 py-0.5">
              <Flag className="w-2 h-2 text-white" />
              <span className="text-xs text-white font-medium">{tasks.length}</span>
            </div>
          </div>
        )}
        {/* Other event dots */}
        {otherEvents.length > 0 && (
          <div className="flex gap-0.5 justify-center">
            {otherEvents.slice(0, 3).map((ev, i) => (
              <span key={i} className={`inline-block w-2 h-2 rounded-full ${eventColors[ev.type] || 'bg-[#cbb8f5]'}`}></span>
            ))}
            {otherEvents.length > 3 && (
              <span className="text-xs text-purple-500 ml-1">+{otherEvents.length - 3}</span>
            )}
          </div>
        )}
      </div>
    );
  }

  // On day click, open modal with events
  function onDayClick(date: Date) {
    setModalDay(format(date, 'yyyy-MM-dd'));
    setModalOpen(true);
    setSelectedDate(date);
  }

  // Handle adding new task
  const handleAddTask = () => {
    if (newTask.title.trim() && onAddEvent) {
      onAddEvent({
        title: newTask.title,
        description: newTask.description,
        date: newTask.date,
        time: newTask.time || undefined,
        type: newTask.type,
        priority: newTask.priority,
        energyLevel: newTask.energyLevel,
        completed: false
      });
      setNewTask({
        title: '',
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: '',
        description: '',
        type: 'task',
        priority: 3,
        energyLevel: 'medium'
      });
      setShowAddTask(false);
    }
  };

  // Modal event list
  const modalEvents = eventsByDate[modalDay] || [];

  // New: AI sort logic
  function aiSort(events: Event[]) {
    switch (sortMode) {
      case 'priority':
        return [...events].sort((a, b) => (b.priority || 0) - (a.priority || 0));
      case 'urgency':
        return [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      case 'workload':
        return [...events].sort((a, b) => (b.duration || 0) - (a.duration || 0));
      default:
        return events;
    }
  }

  // Day events
  const dayStr = format(selectedDate, 'yyyy-MM-dd');
  const dayEvents = aiSort(eventsByDate[dayStr] || []);

  // Week events
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const weekEvents = aiSort(weekDates.flatMap(date => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return (eventsByDate[dateStr] || []);
  }));

  return (
    <div className="h-screen w-full bg-[#f6f7fb] font-sans flex flex-col max-w-md mx-auto">
      {/* Polished Top Navigation Bar (no gradient background) */}
      <div className="w-full flex flex-col items-center px-3 pt-6 pb-2 gap-0">
        {/* Segmented Tab: Personal / Collaborative (no gradient) */}
        <div className="relative flex w-full max-w-xs rounded-full bg-white/80 shadow-lg mb-4 border border-slate-100" style={{ minHeight: 48 }}>
          {['personal', 'collab'].map((tab, idx) => (
            <button
              key={tab}
              className={`flex-1 z-10 py-2 font-bold text-base rounded-full transition-all duration-200 focus:outline-none
                ${topTab === tab
                  ? 'text-blue-900'
                  : 'text-slate-500 hover:text-blue-700'}
              `}
              style={{ position: 'relative', padding: '0 8px' }}
              onClick={() => setTopTab(tab as 'personal' | 'collab')}
            >
              {tab === 'personal' ? 'Personal' : 'Collaborative'}
            </button>
          ))}
          {/* Animated slider underline (glassmorphism/neumorphism) */}
          <motion.div
            className="absolute bottom-1 left-0 h-3/4 w-1/2 rounded-full bg-white/90 shadow-xl border border-blue-100"
            layoutId="tab-slider"
            style={{
              x: topTab === 'personal' ? 0 : '100%',
              width: '50%',
              zIndex: 1,
              backdropFilter: 'blur(8px)',
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        </div>
        {/* Only show view selector and sort dropdown in Personal tab */}
        {topTab === 'personal' && (
          <>
            <div className="w-full flex justify-center items-center gap-2 mb-1">
              {VIEW_MODES.map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none
                    px-5 py-2 text-base font-semibold
                    ${viewMode === mode
                      ? 'bg-blue-500 text-white shadow-md scale-105'
                      : 'bg-white/80 text-blue-700 border border-blue-100 hover:bg-blue-50'}
                  `}
                  style={{ minWidth: 80, minHeight: 40 }}
                >
                  <span className="text-lg mr-2 pointer-events-none select-none">
                    {VIEW_ICONS[mode]}
                  </span>
                  <span className="pointer-events-none select-none">
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </span>
                </button>
              ))}
            </div>
            <div className="w-full flex flex-col items-center mb-2 mt-1">
              <label className="text-slate-500 text-sm font-medium select-none mb-1">Sort by:</label>
              <div className="relative w-fit">
                <select
                  value={sortMode}
                  onChange={e => setSortMode(e.target.value as any)}
                  className="appearance-none bg-white/90 border border-blue-100 rounded-full px-4 py-1 pr-8 text-sm font-semibold text-blue-700 shadow focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none hover:border-blue-200"
                  style={{ minWidth: 100, maxWidth: 140, boxShadow: '0 2px 12px 0 rgba(124, 198, 255, 0.10)' }}
                >
                  <option value="priority">Priority</option>
                  <option value="urgency">Urgency</option>
                  <option value="workload">Time</option>
                  <option value="type">Type</option>
                  <option value="collaborators">Collaborators</option>
                </select>
                {/* Chevron icon */}
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 text-lg">⌄</span>
              </div>
            </div>
          </>
        )}
      </div>
      {/* Conditional rendering for tabs */}
      {topTab === 'personal' ? (
        <>
          {/* Calendar Container with shadow */}
          <div className="flex-1 flex flex-col items-center justify-start">
            <div className="w-full bg-white/90 rounded-2xl shadow-xl p-2 mt-2 mb-4">
              {/* Calendar Content */}
              <div className="flex-1 p-4 overflow-hidden">
                {/* Month View */}
                {viewMode === 'month' && (
                  <div className="h-full bg-white/80 dark:bg-[#181f3a]/80 rounded-2xl p-4 shadow-xl backdrop-blur-md">
                    {/* Month Navigation */}
                    <div className="flex items-center justify-between mb-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedDate(subMonths(selectedDate, 1))}
                        className="p-2 hover:bg-white/20 rounded-full"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </Button>
                      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {format(selectedDate, 'MMMM yyyy')}
                      </h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedDate(addMonths(selectedDate, 1))}
                        className="p-2 hover:bg-white/20 rounded-full"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </div>
                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="text-center py-2 text-sm font-semibold text-purple-600 dark:text-purple-300">
                          {day}
                        </div>
                      ))}
                    </div>
                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1 h-[calc(100%-120px)]">
                      {calendarDays.map((date, index) => {
                        const dateStr = format(date, 'yyyy-MM-dd');
                        const dayEvents = eventsByDate[dateStr] || [];
                        const isCurrentMonth = isSameMonth(date, selectedDate);
                        const isToday = isSameDay(date, new Date());
                        const isSelected = isSameDay(date, selectedDate);
                        const isSunday = date.getDay() === 0;
                        // Separate tasks from other events
                        const tasks = dayEvents.filter(ev => ev.type === 'task');
                        const otherEvents = dayEvents.filter(ev => ev.type !== 'task');
                        return (
                          <div
                            key={index}
                            onClick={() => onDayClick(date)}
                            className={`
                              relative p-2 rounded-xl cursor-pointer transition-all duration-200
                              ${isCurrentMonth ? 'bg-white/60 dark:bg-[#181f3a]/60' : 'bg-gray-100/40 dark:bg-gray-800/40'}
                              ${isToday ? 'calendar-tile-today' : ''}
                              ${isSelected ? 'ring-2 ring-purple-400' : ''}
                              hover:bg-white/80 dark:hover:bg-[#181f3a]/80 hover:scale-105
                              flex flex-col items-center justify-start
                              min-h-[80px]
                            `}
                          >
                            {/* Date Number */}
                            <div className={`
                              text-sm font-medium mb-1
                              ${isCurrentMonth ? 'text-gray-800 dark:text-white' : 'text-gray-400 dark:text-gray-500'}
                              ${isSunday ? 'font-bold text-red-500' : ''}
                              ${isToday ? 'text-white' : ''}
                            `}>
                              {format(date, 'd')}
                            </div>
                            {/* Event Indicators */}
                            <div className="flex flex-col gap-1 w-full">
                              {/* Task indicator */}
                              {tasks.length > 0 && (
                                <div className="flex justify-center">
                                  <div className="flex items-center gap-1 bg-[#fbbf24] rounded-full px-2 py-0.5 shadow-sm">
                                    <Flag className="w-2 h-2 text-white" />
                                    <span className="text-xs text-white font-medium">{tasks.length}</span>
                                  </div>
                                </div>
                              )}
                              {/* Other event dots */}
                              {otherEvents.length > 0 && (
                                <div className="flex gap-0.5 justify-center flex-wrap">
                                  {otherEvents.slice(0, 3).map((ev, i) => (
                                    <span 
                                      key={i} 
                                      className={`inline-block w-2 h-2 rounded-full ${eventColors[ev.type] || 'bg-[#cbb8f5]'}`}
                                    />
                                  ))}
                                  {otherEvents.length > 3 && (
                                    <span className="text-xs text-purple-500">+{otherEvents.length - 3}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {/* Week View */}
                {viewMode === 'week' && (
                  <div className="h-full bg-white/80 dark:bg-[#181f3a]/80 rounded-2xl p-4 shadow-xl backdrop-blur-md overflow-y-auto">
                    <h3 className="text-lg font-semibold mb-4">This Week</h3>
                    <div className="flex flex-col gap-3">
                      {weekEvents.length === 0 && (
                        <div className="text-slate-500 text-center py-8">No events this week</div>
                      )}
                      {weekEvents.map((ev, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl shadow-sm" style={{ background: eventColors[ev.type] }}>
                          <div className="flex flex-col items-center">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="text-sm">{ev.title[0]}</AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-base">{ev.title}</div>
                            <div className="text-sm text-slate-600">{ev.time} {ev.location && <>• {ev.location}</>}</div>
                            <div className="flex gap-2 mt-2">
                              {ev.type === 'class' && <BookOpen className="w-4 h-4 text-blue-400" />}
                              {ev.type === 'club' && <Users className="w-4 h-4 text-purple-400" />}
                              {ev.type === 'study' && <Star className="w-4 h-4 text-yellow-400" />}
                              {ev.type === 'personal' && <User className="w-4 h-4 text-pink-400" />}
                              {ev.type === 'social' && <Users className="w-4 h-4 text-green-400" />}
                              {ev.type === 'task' && <Flag className="w-4 h-4 text-yellow-400" />}
                            </div>
                            <div className="text-xs text-slate-400 mt-1">{format(new Date(ev.date), 'EEEE, MMM d')}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Day View */}
                {viewMode === 'day' && (
                  <div className="h-full bg-white/80 dark:bg-[#181f3a]/80 rounded-2xl p-4 shadow-xl backdrop-blur-md overflow-y-auto">
                    <h3 className="text-lg font-semibold mb-4">{format(selectedDate, 'EEEE, MMMM d')}</h3>
                    <div className="flex flex-col gap-3">
                      {dayEvents.length === 0 && (
                        <div className="text-slate-500 text-center py-8">No events for this day</div>
                      )}
                      {dayEvents.map((ev, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl shadow-sm" style={{ background: eventColors[ev.type] }}>
                          <div className="flex flex-col items-center">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="text-sm">{ev.title[0]}</AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-base">{ev.title}</div>
                            <div className="text-sm text-slate-600">{ev.time} {ev.location && <>• {ev.location}</>}</div>
                            <div className="flex gap-2 mt-2">
                              {ev.type === 'class' && <BookOpen className="w-4 h-4 text-blue-400" />}
                              {ev.type === 'club' && <Users className="w-4 h-4 text-purple-400" />}
                              {ev.type === 'study' && <Star className="w-4 h-4 text-yellow-400" />}
                              {ev.type === 'personal' && <User className="w-4 h-4 text-pink-400" />}
                              {ev.type === 'social' && <Users className="w-4 h-4 text-green-400" />}
                              {ev.type === 'task' && <Flag className="w-4 h-4 text-yellow-400" />}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Modal for day events */}
          {modalOpen && (
            <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50 px-2" onClick={() => setModalOpen(false)}>
              <div className="w-full max-w-sm bg-white dark:bg-[#181f3a] rounded-t-2xl p-4 shadow-2xl animate-[modalSpring_0.4s_ease-out] max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">{format(new Date(modalDay), 'EEEE, MMMM d')}</h2>
                  <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>Close</Button>
                </div>
                {modalEvents.length === 0 && <div className="text-slate-500 text-center py-8">No events</div>}
                {modalEvents.map((ev, i) => (
                  <div key={i} className="flex items-center gap-3 mb-4 p-3 rounded-xl" style={{ background: eventColors[ev.type] }}>
                    <div className="flex flex-col items-center">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="text-sm">{ev.title[0]}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-base">{ev.title}</div>
                      <div className="text-sm text-slate-600">{ev.time} {ev.location && <>• {ev.location}</>}</div>
                      <div className="flex gap-2 mt-2">
                        {ev.type === 'class' && <BookOpen className="w-4 h-4 text-blue-400" />}
                        {ev.type === 'club' && <Users className="w-4 h-4 text-purple-400" />}
                        {ev.type === 'study' && <Star className="w-4 h-4 text-yellow-400" />}
                        {ev.type === 'personal' && <User className="w-4 h-4 text-pink-400" />}
                        {ev.type === 'social' && <Users className="w-4 h-4 text-green-400" />}
                        {ev.type === 'task' && <Flag className="w-4 h-4 text-yellow-400" />}
                      </div>
                    </div>
                  </div>
                ))}
                <Button className="w-full mt-4" onClick={() => setShowAddTask(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Event
                </Button>
              </div>
            </div>
          )}
          {/* Add Task Modal */}
          {showAddTask && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
              <div className="w-full max-w-md bg-white dark:bg-[#181f3a] rounded-2xl p-6 shadow-2xl">
                <h2 className="text-xl font-bold mb-4">Add New Task</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Task Title</label>
                    <input 
                      type="text" 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter task title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Date</label>
                    <input 
                      type="date" 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={newTask.date}
                      onChange={(e) => setNewTask({...newTask, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Time (Optional)</label>
                    <input 
                      type="time" 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={newTask.time}
                      onChange={(e) => setNewTask({...newTask, time: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Priority</label>
                    <select 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={newTask.priority}
                      onChange={(e) => setNewTask({...newTask, priority: parseInt(e.target.value) as 1|2|3|4|5})}
                    >
                      <option value={1}>1 - Low</option>
                      <option value={2}>2 - Medium Low</option>
                      <option value={3}>3 - Medium</option>
                      <option value={4}>4 - Medium High</option>
                      <option value={5}>5 - High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Energy Level</label>
                    <select 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={newTask.energyLevel}
                      onChange={(e) => setNewTask({...newTask, energyLevel: e.target.value as 'low'|'medium'|'high'})}
                    >
                      <option value="low">Low Energy</option>
                      <option value="medium">Medium Energy</option>
                      <option value="high">High Energy</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="Enter task description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button variant="outline" className="flex-1" onClick={() => setShowAddTask(false)}>
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1 bg-gradient-to-r from-[#b2aaff] to-[#e8cbff] hover:from-[#a19aff] hover:to-[#d7baff]"
                    onClick={handleAddTask}
                    disabled={!newTask.title.trim()}
                  >
                    Add Task
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <CollaborativeCalendarPage />
      )}
    </div>
  );
}
