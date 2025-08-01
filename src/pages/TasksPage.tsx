import { useState } from 'react';
import { TaskCard } from '@/components/TaskCard';
import { Plus, Sparkles, Filter } from 'lucide-react';

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

interface TasksPageProps {
  events: Event[];
  onToggleTask: (id: number) => void;
  onAddEvent: () => void;
}

export function TasksPage({ events, onToggleTask, onAddEvent }: TasksPageProps) {
  const [filter, setFilter] = useState('all');
  const tasks = events.filter(e => e.type === 'task');
  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Tasks
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {tasks.filter(t => !t.completed).length} pending tasks
          </p>
        </div>
        <button 
          onClick={onAddEvent}
          className="p-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 smooth-transition"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Auto Plan Button */}
      <button className="w-full wellness-gradient text-white font-semibold py-3 px-4 rounded-xl smooth-transition hover:scale-[1.02] flex items-center justify-center space-x-2">
        <Sparkles className="w-4 h-4" />
        <span>Plan My Tasks</span>
      </button>

      {/* Filter Tabs */}
      <div className="flex space-x-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
        {['all', 'pending', 'completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium smooth-transition ${
              filter === tab
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            title={task.title}
            dueDate={task.date}
            duration={task.duration || 0}
            priority={task.priority || 1}
            energyLevel={task.energyLevel || 'medium'}
            completed={task.completed}
            onToggle={() => onToggleTask(task.id)}
          />
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-500 dark:text-slate-400">
            No {filter} tasks found
          </p>
        </div>
      )}
    </div>
  );
}
