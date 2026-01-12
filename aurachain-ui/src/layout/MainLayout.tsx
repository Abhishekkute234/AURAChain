import React, { useRef, useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { GripVertical, ChevronDown, Plus, Building2, Check } from 'lucide-react';
import Sidebar from '../components/Sidebar/Sidebar';
import AgentDashboard from '../components/Canvas/AgentDashboard';
import ThemeToggle from '../components/Shared/ThemeToggle';
import { useUIStore } from '../store/uiStore';

// Mock Data for the Company Selector
const COMPANIES = [
  { id: '1', name: 'Rajesh Electronics' },
  { id: '2', name: 'Mumbai Central Store' },
  { id: '3', name: 'Pune Warehouse Operations' }
];

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { 
    isSidebarOpen, 
    toggleSidebar, 
    isRightPanelOpen, 
    rightPanelWidth,
    setRightPanelWidth
  } = useUIStore();

  // Resizing Logic
  const isResizingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Company Dropdown State
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);
  const [activeCompany, setActiveCompany] = useState(COMPANIES[0]);

  const startResizing = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isResizingRef.current = true;
    setIsDragging(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const stopResizing = React.useCallback(() => {
    if (isResizingRef.current) {
      isResizingRef.current = false;
      setIsDragging(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  }, []);

  const resize = React.useCallback((e: MouseEvent) => {
    if (isResizingRef.current) {
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth > 300 && newWidth < 900) {
        setRightPanelWidth(newWidth);
      }
    }
  }, [setRightPanelWidth]);

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-light-bg dark:bg-dark-bg text-slate-900 dark:text-slate-50 font-sans transition-colors duration-300">
      
      {/* 1. Left Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={toggleSidebar} 
      />

      {/* 2. Main Chat Section */}
      <main className="flex-1 flex flex-col min-w-0 relative transition-all duration-300">
        
        {/* HEADER */}
        <header className="h-16 flex-shrink-0 border-b border-light-border dark:border-dark-border flex items-center justify-between px-6 bg-light-bg/80 dark:bg-dark-bg/80 backdrop-blur-sm z-10">
          
          {/* Left Side: Company Selector (Replaces Breadcrumb) */}
          <div className="relative">
            <button 
              onClick={() => setIsCompanyOpen(!isCompanyOpen)}
              className="flex items-center space-x-2 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-2 rounded-lg transition-all"
            >
              <span>{activeCompany.name}</span>
              <ChevronDown size={16} className={clsx("text-slate-400 transition-transform duration-200", isCompanyOpen && "rotate-180")} />
            </button>

            {/* Dropdown Menu */}
            {isCompanyOpen && (
              <>
                {/* Invisible overlay to handle click outside */}
                <div className="fixed inset-0 z-10" onClick={() => setIsCompanyOpen(false)} />
                
                <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-[#212121] border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-2 z-20 animate-fade-in-up origin-top-left">
                  <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Switch Organization
                  </div>
                  
                  {COMPANIES.map(company => (
                    <button
                      key={company.id}
                      onClick={() => {
                        setActiveCompany(company);
                        setIsCompanyOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-4 py-3 text-sm text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                    >
                      <div className="flex items-center overflow-hidden">
                        <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-md mr-3 text-slate-500 group-hover:text-primary-500 transition-colors">
                           <Building2 size={16} />
                        </div>
                        <span className={clsx(
                          "truncate",
                          company.id === activeCompany.id ? "text-slate-900 dark:text-white font-medium" : "text-slate-600 dark:text-slate-400"
                        )}>
                          {company.name}
                        </span>
                      </div>
                      {company.id === activeCompany.id && <Check size={16} className="text-primary-500 flex-shrink-0 ml-2" />}
                    </button>
                  ))}

                  <div className="h-px bg-slate-100 dark:bg-slate-700 my-2 mx-4" />

                  <button className="w-full flex items-center px-4 py-2.5 text-sm text-left text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors hover:text-primary-500 group">
                    <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-md mr-3 text-slate-400 group-hover:text-primary-500 transition-colors">
                      <Plus size={16} />
                    </div>
                    Add New Company
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Right Side: Theme Toggle */}
          <div><ThemeToggle /></div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
           {children}
        </div>
      </main>

      {/* 3. Resizable Right Canvas */}
      <aside 
        style={{ width: isRightPanelOpen ? `${rightPanelWidth}px` : '0px' }}
        className={clsx(
          "flex-shrink-0 border-l border-light-border dark:border-dark-border bg-white dark:bg-dark-elevated relative flex",
          // Only animate transitions when NOT dragging.
          !isDragging && "transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
          !isRightPanelOpen && "border-l-0"
        )}
      >
        {/* --- DRAG HANDLE (The Pill) --- */}
        <div 
          className={clsx(
            "absolute -left-3 top-0 bottom-0 w-6 z-50 flex items-center justify-center group cursor-col-resize outline-none",
            !isRightPanelOpen && "hidden" // Hide handle if closed
          )}
          onMouseDown={startResizing}
        >
          {/* Visual Pill */}
          <div className={clsx(
            "w-1.5 h-16 rounded-full transition-all duration-200 flex items-center justify-center overflow-hidden shadow-sm",
            // Visual feedback during drag
            isDragging 
              ? "bg-primary-500 scale-y-110" 
              : "bg-slate-200 dark:bg-slate-700 group-hover:bg-primary-400"
          )}>
            {/* Subtle Grip Icon */}
            <GripVertical size={8} className={clsx(
              "text-white transition-opacity duration-200",
              isDragging ? "opacity-50" : "opacity-0 group-hover:opacity-100"
            )} />
          </div>
        </div>

        {/* Content Container */}
        <div className="h-full w-full overflow-hidden">
          <AgentDashboard />
        </div>
      </aside>
    </div>
  );
};

export default MainLayout;