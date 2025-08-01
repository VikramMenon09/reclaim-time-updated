import { Clock, Zap, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isToday, isTomorrow, isYesterday } from 'date-fns';

interface TaskCardProps {
  title: string;
  dueDate: string;
  duration: number; // in minutes
  priority: 1 | 2 | 3 | 4 | 5;
  energyLevel: 'low' | 'medium' | 'high';
  completed?: boolean;
  onToggle?: () => void;
}

const priorityColors = {
  1: 'text-gray-500',
  2: 'text-blue-500',
  3: 'text-yellow-500',
  4: 'text-orange-500',
  5: 'text-red-500',
};

const energyColors = {
  low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

const formatDueDate = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMM d');
};

export function TaskCard({ title, dueDate, duration, priority, energyLevel, completed = false, onToggle }: TaskCardProps) {
  return (
    <div className={cn(
      "p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all duration-200 ease-in-out hover:shadow-md",
      completed && "opacity-60"
    )}>
      <div className="flex items-start space-x-3">
        <button
          onClick={onToggle}
          className={cn(
            "w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 transition-all duration-200 ease-in-out",
            completed 
              ? "bg-green-500 border-green-500" 
              : "border-slate-300 dark:border-slate-600 hover:border-green-400"
          )}
        >
          {completed && (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        <div className="flex-1">
          <h4 className={cn(
            "font-semibold mb-2",
            completed 
              ? "line-through text-slate-500 dark:text-slate-400" 
              : "text-slate-900 dark:text-slate-100"
          )}>
            {title}
          </h4>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 text-sm">
              <div className="flex items-center space-x-1 text-slate-500">
                <Clock className="w-4 h-4" />
                <span>{duration}min</span>
              </div>

              <span className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                energyColors[energyLevel]
              )}>
                {energyLevel} energy
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Flag className={cn("w-4 h-4", priorityColors[priority])} />
              <span className="text-xs text-slate-500">{formatDueDate(dueDate)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
