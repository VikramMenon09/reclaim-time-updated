import { Clock, MapPin, Users2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { format, parse } from 'date-fns';

interface EventCardProps {
  title: string;
  time: string;
  type: 'school' | 'social' | 'task';
  location?: string;
  attendees?: number;
  className?: string;
}

const eventTypeStyles = {
  school: 'border-l-blue-500 bg-blue-50 dark:bg-blue-950/20',
  social: 'border-l-green-500 bg-green-50 dark:bg-green-950/20',
  task: 'border-l-orange-500 bg-orange-50 dark:bg-orange-950/20',
};

const eventTypeColors = {
  school: 'text-blue-600 dark:text-blue-400',
  social: 'text-green-600 dark:text-green-400',
  task: 'text-orange-600 dark:text-orange-400',
};

function formatTime(time: string) {
  // Try to parse 24-hour or 12-hour time and always output 12-hour format with AM/PM
  let date;
  if (/\d{1,2}:\d{2}\s?(AM|PM|am|pm)?/.test(time)) {
    // Already in 12-hour format
    date = parse(time.replace(/\s?(AM|PM|am|pm)/, ''), 'H:mm', new Date());
  } else if (/\d{1,2}:\d{2}/.test(time)) {
    // 24-hour format
    date = parse(time, 'H:mm', new Date());
  } else {
    return time;
  }
  return format(date, 'h:mm a');
}

export function EventCard({ title, time, type, location, attendees, className }: EventCardProps) {
  return (
    <div className={cn(
      "p-5 rounded-2xl border-l-4 shadow-sm bg-white dark:bg-slate-900/60 transition-all flex flex-col gap-2",
      eventTypeStyles[type],
      className
    )}>
      <div className="flex items-center justify-between gap-2">
        <h4 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-1">
          {title}
        </h4>
      </div>
      <div className="flex flex-wrap items-center gap-4 text-sm mt-1">
        <div className={cn("flex items-center gap-1", eventTypeColors[type])}>
          <Clock className="w-4 h-4" />
          <span>{formatTime(time)}</span>
        </div>
        {location && (
          <div className="flex items-center gap-1 text-slate-500">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
        )}
        {attendees && (
          <div className="flex items-center gap-1 text-slate-500">
            <Users2 className="w-4 h-4" />
            <span>{attendees}</span>
          </div>
        )}
      </div>
    </div>
  );
}
