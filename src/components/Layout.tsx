import { useState } from 'react';
import { Home, Calendar, CheckSquare, Users, Settings, Database } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'friends', label: 'Friends', icon: Users },
];

export function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Main Content */}
      <main className="pb-20 px-4 pt-6 max-w-md mx-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-700">
        <div className="flex justify-around items-center py-2 max-w-md mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 ease-in-out min-w-[60px]",
                  isActive 
                    ? "text-blue-600 dark:text-blue-400" 
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-lg transition-all duration-200 ease-in-out",
                  isActive && "bg-blue-100 dark:bg-blue-900/30"
                )}>
                  <Icon size={20} />
                </div>
                <span className="text-xs font-medium mt-1">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
