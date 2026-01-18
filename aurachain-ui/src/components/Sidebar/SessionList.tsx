import React from 'react';
import { clsx } from 'clsx';

interface Session {
  id: string;
  title: string;
  time: string;
  active?: boolean;
}

const MOCK_SESSIONS: Session[] = [
  { id: '1', title: 'Diwali Forecast', time: '2h ago', active: true },
  { id: '2', title: 'Inventory Analysis', time: '1d ago' },
  { id: '3', title: 'Q3 Performance', time: '3d ago' },
  { id: '4', title: 'Supplier Risk Assessment', time: '4d ago' },
  { id: '5', title: 'Logistics Optimization', time: '1w ago' },
];

interface SessionListProps {
  isOpen: boolean;
}

const SessionList: React.FC<SessionListProps> = ({ isOpen }) => {
  // UX Decision: If sidebar is collapsed, text-only lists are unreadable.
  // We hide the list entirely to keep the "Icon Only" rail clean.
  if (!isOpen) return <div className="flex-1" />; 

  return (
    <div className="flex-1 overflow-y-auto py-4 space-y-1 custom-scrollbar animate-fade-in">
      <h3 className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 whitespace-nowrap">
        Recent Sessions
      </h3>
      
      {MOCK_SESSIONS.map((session) => (
        <button
          key={session.id}
          className={clsx(
            "w-[calc(100%-16px)] mx-2 flex items-center rounded-lg transition-all duration-200 group px-3 py-2.5 text-left",
            session.active 
              ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300 border-l-4 border-primary-500" 
              : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 border-l-4 border-transparent"
          )}
        >
          <div className="overflow-hidden w-full">
             <p className="text-sm font-medium truncate">{session.title}</p>
             <p className="text-xs opacity-70 truncate">{session.time}</p>
          </div>
        </button>
      ))}
    </div>
  );
};

export default SessionList;