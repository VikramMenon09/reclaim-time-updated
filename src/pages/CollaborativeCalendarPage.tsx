import React, { useState } from 'react';
import { Users, Plus, Info, Calendar as CalendarIcon, User } from 'lucide-react';

// Types for collaborative calendar
interface GroupCalendar {
  id: string;
  name: string;
  color: string;
  icon: number;
  role: 'Owner' | 'Editor' | 'Viewer';
  members: string[];
}

interface GroupEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  createdBy: string;
  calendarId: string;
}

const CALENDAR_COLORS = [
  'from-purple-400 to-blue-400',
  'from-blue-400 to-cyan-400',
  'from-pink-400 to-purple-400',
  'from-green-400 to-blue-400',
];

const CALENDAR_ICONS = [
  <CalendarIcon className="w-6 h-6 text-blue-600" />, // fallback
  <span role="img" aria-label="book">📘</span>,
  <span role="img" aria-label="tools">🛠️</span>,
  <span role="img" aria-label="music">🎵</span>,
  <span role="img" aria-label="soccer">⚽</span>,
];

const mockCalendars = [
  { id: '1', name: 'Study Group', color: CALENDAR_COLORS[0], icon: 1, role: 'Owner', members: ['You', 'Alice', 'Bob'] },
  { id: '2', name: 'Robotics Club', color: CALENDAR_COLORS[1], icon: 2, role: 'Editor', members: ['You', 'Eve', 'Mallory'] },
];

const mockEvents = [
  { id: 'e1', title: 'Group Study', date: '2025-06-20', time: '16:00', duration: 90, createdBy: 'Alice', calendarId: '1' },
  { id: 'e2', title: 'Robotics Meeting', date: '2025-06-21', time: '18:00', duration: 60, createdBy: 'Mallory', calendarId: '2' },
];

const roleColors = {
  Owner: 'bg-gradient-to-r from-purple-500 to-blue-500 text-white',
  Editor: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
  Viewer: 'bg-gray-200 text-gray-700',
};

const CollaborativeCalendarPage: React.FC = () => {
  const [calendars, setCalendars] = useState(mockCalendars);
  const [selectedCalendar, setSelectedCalendar] = useState(mockCalendars[0]);
  const [showCreate, setShowCreate] = useState(false);
  const [newCalendarName, setNewCalendarName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [joinActive, setJoinActive] = useState(false);

  // Filter events for selected calendar
  const groupEvents = mockEvents.filter(e => e.calendarId === selectedCalendar.id);

  // Handlers
  const handleCreateCalendar = () => {
    if (newCalendarName.trim()) {
      const newCal = {
        id: Math.random().toString(36).slice(2),
        name: newCalendarName,
        color: CALENDAR_COLORS[(calendars.length + 1) % CALENDAR_COLORS.length],
        icon: 0,
        role: 'Owner',
        members: ['You'],
      };
      setCalendars([...calendars, newCal]);
      setSelectedCalendar(newCal);
      setShowCreate(false);
      setNewCalendarName('');
    }
  };
  const handleJoinCalendar = () => {
    setJoinActive(false);
    setJoinCode('');
    alert('Joining by code coming soon!');
  };

  return (
    <div className="w-full max-w-md mx-auto p-2 sm:p-4">
      {/* Calendar Cards Grid */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 flex gap-2 overflow-x-auto">
          {calendars.map((cal, i) => (
            <button
              key={cal.id}
              className={`group relative flex flex-col items-center justify-center min-w-[110px] h-24 rounded-2xl shadow-md transition-transform duration-150 active:scale-95 border border-gray-200 bg-gradient-to-br ${cal.color} ${selectedCalendar.id === cal.id ? 'ring-2 ring-purple-400' : ''}`}
              onClick={() => setSelectedCalendar(cal)}
              style={{ boxShadow: selectedCalendar.id === cal.id ? '0 4px 16px 0 rgba(124, 198, 255, 0.16)' : undefined }}
            >
              <div className="absolute top-2 left-2 text-lg">
                {CALENDAR_ICONS[cal.icon] || CALENDAR_ICONS[0]}
              </div>
              <div className="mt-6 font-semibold text-white text-base truncate w-20 text-center drop-shadow">
                {cal.name}
              </div>
              <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold ${roleColors[cal.role]}`}>{cal.role}</span>
            </button>
          ))}
          {/* New Calendar Card */}
          <button
            className="flex flex-col items-center justify-center min-w-[110px] h-24 rounded-2xl border-2 border-dashed border-purple-300 bg-white text-purple-500 hover:bg-purple-50 transition-all active:scale-95"
            onClick={() => setShowCreate(true)}
          >
            <Plus className="w-6 h-6 mb-1" />
            <span className="font-semibold">New</span>
          </button>
        </div>
      </div>
      {/* Create Calendar Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-xs">
            <h2 className="text-lg font-bold mb-2">Create New Calendar</h2>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              placeholder="Group name"
              value={newCalendarName}
              onChange={e => setNewCalendarName(e.target.value)}
            />
            <div className="flex gap-2">
              <button className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg py-2 font-semibold" onClick={handleCreateCalendar}>Create</button>
              <button className="flex-1 bg-gray-100 rounded-lg py-2 font-semibold" onClick={() => setShowCreate(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {/* Join Code Card */}
      <div className="mb-4">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold">Join an Existing Calendar</span>
            <span className="relative group">
              <Info className="w-4 h-4 text-blue-400 cursor-pointer" />
              <span className="absolute left-1/2 -bottom-7 -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-10">
                Enter a code to join a group calendar shared by a friend or club.
              </span>
            </span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              placeholder="Enter code"
              value={joinCode}
              onFocus={() => setJoinActive(true)}
              onBlur={() => setJoinActive(false)}
              onChange={e => setJoinCode(e.target.value)}
            />
            <button
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${joinActive ? 'animate-pulse bg-blue-500 text-white' : 'bg-blue-100 text-blue-700'}`}
              onClick={handleJoinCalendar}
              disabled={!joinCode.trim()}
            >
              Join
            </button>
          </div>
        </div>
      </div>
      {/* Events Panel */}
      <div className="mb-4">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-md p-4">
          <div className="flex items-center gap-2 mb-2">
            <CalendarIcon className="w-5 h-5 text-purple-500" />
            <span className="font-semibold">Upcoming Events: {selectedCalendar.name}</span>
          </div>
          {groupEvents.length > 0 ? (
            <div className="flex flex-col gap-3">
              {groupEvents.map(ev => (
                <div key={ev.id} className="flex items-center gap-3 rounded-xl border-l-4 border-purple-400 bg-gradient-to-r from-purple-50 to-blue-50 shadow-sm p-3">
                  <div className="flex flex-col items-center">
                    <span className="text-2xl">📚</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-base mb-1">{ev.title}</div>
                    <div className="text-sm text-slate-700 font-medium mb-1">🕒 {new Date(ev.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} — {ev.time} ({ev.duration} min)</div>
                    <div className="text-xs text-slate-500">👤 Created by {ev.createdBy}</div>
                  </div>
                  <button className="ml-auto px-3 py-1 rounded-lg bg-blue-100 text-blue-700 font-semibold text-xs shadow hover:bg-blue-200 transition">Edit</button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-slate-400 text-center py-6">No events yet.</div>
          )}
        </div>
      </div>
      {/* Members Panel */}
      <div className="mb-4">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-blue-500" />
            <span className="font-semibold">Members</span>
          </div>
          <div className="flex gap-2">
            {selectedCalendar.members.map((m, i) => (
              <div key={m} className="relative group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white font-bold text-lg shadow-md cursor-pointer hover:scale-105 transition">
                  {m[0]}
                </div>
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded px-2 py-0.5 text-xs font-semibold text-purple-600 shadow opacity-0 group-hover:opacity-100 transition pointer-events-none">
                  {m === 'You' ? selectedCalendar.role : 'Member'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Mutual Free Time Panel */}
      <div className="mb-2">
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-purple-50 shadow-inner p-4 flex flex-col items-center text-center">
          <div className="font-semibold text-blue-700 mb-1">Mutual Free Time (Beta)</div>
          <div className="text-slate-500 text-sm mb-2">When active, you'll see shared free blocks for all members.</div>
          <button className="px-4 py-2 rounded-lg bg-blue-200 text-blue-800 font-semibold opacity-60 cursor-not-allowed">Enable Availability Sync</button>
        </div>
      </div>
    </div>
  );
};

export default CollaborativeCalendarPage; 