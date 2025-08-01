import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { HomePage } from '@/pages/HomePage';
import { TasksPage } from '@/pages/TasksPage';
import { FriendsPage } from '@/pages/FriendsPage';
import { CalendarPage } from '@/pages/CalendarPage';
import { LoginPage } from '@/pages/LoginPage';
import { UserProfile } from '@/components/UserProfile';
import { AddEventModal } from '@/components/AddTaskModal';
import { ChatOverlay } from './components/ChatOverlay';
import CollaborativeCalendarPage from '@/pages/CollaborativeCalendarPage';

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
  date: string; // ISO string
  time?: string; // e.g. '14:00' or '2:00 PM'
  duration?: number;
  priority?: 1 | 2 | 3 | 4 | 5;
  energyLevel?: 'low' | 'medium' | 'high';
  completed?: boolean;
  type: 'task' | 'school' | 'social' | 'custom';
  location?: string;
  attendees?: number;
  collaborativeId?: string; // for collaborative events
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [darkMode, setDarkMode] = useState(false);
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: 'Math Homework - Chapter 12',
      date: '2025-06-18',
      duration: 90,
      priority: 5,
      energyLevel: 'high',
      completed: false,
      type: 'task',
    },
    {
      id: 2,
      title: 'Read History Chapter',
      date: '2025-06-19',
      duration: 45,
      priority: 3,
      energyLevel: 'medium',
      completed: false,
      type: 'task',
    },
    {
      id: 3,
      title: 'Science Lab Report',
      date: '2025-06-21',
      duration: 120,
      priority: 4,
      energyLevel: 'high',
      completed: true,
      type: 'task',
    },
    {
      id: 100,
      title: 'Math Class',
      date: '2025-06-17',
      time: '09:00',
      type: 'school',
      location: 'Room 201',
    },
    {
      id: 101,
      title: 'Study Group',
      date: '2025-06-17',
      time: '15:00',
      type: 'social',
      attendees: 4,
    },
  ]);
  const [addEventModalOpen, setAddEventModalOpen] = useState(false);

  // Check for stored user and events on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('fora_user');
    const storedDarkMode = localStorage.getItem('fora_dark_mode');
    const storedEvents = localStorage.getItem('fora_events');
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedDarkMode) setDarkMode(JSON.parse(storedDarkMode));
    if (storedEvents) setEvents(JSON.parse(storedEvents));
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('fora_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('fora_user');
    setActiveTab('home');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('fora_user', JSON.stringify(updatedUser));
  };

  const handleToggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('fora_dark_mode', JSON.stringify(newDarkMode));
  };

  // Add or update event
  const handleAddEvent = (eventData: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Math.max(0, ...events.map(e => e.id)) + 1,
    };
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    localStorage.setItem('fora_events', JSON.stringify(updatedEvents));
  };

  const handleToggleTask = (eventId: number) => {
    const updatedEvents = events.map(event =>
      event.id === eventId ? { ...event, completed: !event.completed } : event
    );
    setEvents(updatedEvents);
    localStorage.setItem('fora_events', JSON.stringify(updatedEvents));
  };

  // Show login page if user is not authenticated
  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage user={user} events={events} />;
      case 'tasks': 
        return (
          <TasksPage 
            events={events} 
            onToggleTask={handleToggleTask}
            onAddEvent={() => setAddEventModalOpen(true)}
          />
        );
      case 'calendar':
        return <CalendarPage events={events} onAddEvent={() => setAddEventModalOpen(true)} showCollaborativeSection />;
      case 'friends':
        return <FriendsPage events={events} />;
      case 'settings':
        return (
          <UserProfile
            user={user}
            onUpdateUser={handleUpdateUser}
            onLogout={handleLogout}
            darkMode={darkMode}
            onToggleDarkMode={handleToggleDarkMode}
          />
        );
      default:
        return <HomePage user={user} events={events} />;
    }
  };

  return (
    <>
      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        {renderContent()}
      </Layout>
      <AddEventModal
        open={addEventModalOpen}
        onOpenChange={setAddEventModalOpen}
        onAddEvent={handleAddEvent}
      />
      <ChatOverlay />
    </>
  );
}

export default App;
