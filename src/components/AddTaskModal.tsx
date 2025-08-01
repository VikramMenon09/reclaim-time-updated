import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Clock, Zap, Flag } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

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

interface AddEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddEvent: (event: Omit<Event, 'id'>) => void;
}

export function AddEventModal({ open, onOpenChange, onAddEvent }: AddEventModalProps) {
  const [formData, setFormData] = useState({
    type: 'task' as 'task' | 'school' | 'social' | 'custom',
    title: '',
    description: '',
    date: undefined as Date | undefined,
    time: '',
    duration: 60,
    priority: 3 as 1 | 2 | 3 | 4 | 5,
    energyLevel: 'medium' as 'low' | 'medium' | 'high',
    location: '',
    attendees: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date) return;
    const event: Omit<Event, 'id'> = {
      type: formData.type,
      title: formData.title,
      description: formData.description,
      date: format(formData.date, 'yyyy-MM-dd'),
      time: formData.type !== 'task' ? formData.time : undefined,
      duration: formData.type === 'task' ? formData.duration : undefined,
      priority: formData.type === 'task' ? formData.priority : undefined,
      energyLevel: formData.type === 'task' ? formData.energyLevel : undefined,
      location: formData.type === 'school' || formData.type === 'custom' ? formData.location : undefined,
      attendees: formData.type === 'social' ? formData.attendees : undefined,
      completed: formData.type === 'task' ? false : undefined,
    };
    onAddEvent(event);
    setFormData({
      type: 'task',
      title: '',
      description: '',
      date: undefined,
      time: '',
      duration: 60,
      priority: 3,
      energyLevel: 'medium',
      location: '',
      attendees: 1,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Event Type</Label>
            <select
              id="type"
              value={formData.type}
              onChange={e => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
              className="w-full h-10 px-3 py-2 text-sm rounded-md border border-input bg-background"
            >
              <option value="task">Task</option>
              <option value="school">School</option>
              <option value="social">Social</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={date => setFormData(prev => ({ ...prev, date }))}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          {/* Time for non-task events */}
          {formData.type !== 'task' && (
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={e => setFormData(prev => ({ ...prev, time: e.target.value }))}
              />
            </div>
          )}
          {/* Task-specific fields */}
          {formData.type === 'task' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="15"
                    max="480"
                    step="15"
                    value={formData.duration}
                    onChange={e => {
                      const value = parseInt(e.target.value);
                      if (isNaN(value)) return;
                      const clampedValue = Math.min(Math.max(value, 15), 480);
                      setFormData(prev => ({ ...prev, duration: clampedValue }));
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    value={formData.priority}
                    onChange={e => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5 }))}
                    className="w-full h-10 px-3 py-2 text-sm rounded-md border border-input bg-background"
                  >
                    <option value={1}>1 - Low</option>
                    <option value={2}>2 - Minor</option>
                    <option value={3}>3 - Medium</option>
                    <option value={4}>4 - High</option>
                    <option value={5}>5 - Urgent</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Energy Level Required</Label>
                <div className="flex space-x-2">
                  {(['low', 'medium', 'high'] as const).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, energyLevel: level }))}
                      className={cn(
                        "flex-1 p-2 rounded-lg text-sm font-medium smooth-transition",
                        formData.energyLevel === level
                          ? level === 'low' ? 'bg-blue-500 text-white' 
                            : level === 'medium' ? 'bg-yellow-500 text-white'
                            : 'bg-red-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      )}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
          {/* School event location */}
          {formData.type === 'school' && (
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
          )}
          {/* Social event attendees */}
          {formData.type === 'social' && (
            <div className="space-y-2">
              <Label htmlFor="attendees">Attendees</Label>
              <Input
                id="attendees"
                type="number"
                min="1"
                value={formData.attendees}
                onChange={e => setFormData(prev => ({ ...prev, attendees: parseInt(e.target.value) }))}
              />
            </div>
          )}
          {/* Custom event location */}
          {formData.type === 'custom' && (
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
          )}
          <div className="flex space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Event
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
