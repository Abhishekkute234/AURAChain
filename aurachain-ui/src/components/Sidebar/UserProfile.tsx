import React, { useState } from 'react';
import { clsx } from 'clsx';
import { 
  Settings, LogOut, ChevronUp, 
  Globe, HelpCircle, ArrowUpCircle, Download, Info 
} from 'lucide-react';

// --- HELPER COMPONENTS ---

interface MenuItemProps {
  icon: React.ElementType;
  label: string;
  shortcut?: string;
  hasSubmenu?: boolean;
  onClick?: () => void;
  className?: string; 
}

const MenuItem: React.FC<MenuItemProps> = ({ icon: Icon, label, shortcut, hasSubmenu = false, onClick, className }) => (
  <button 
    onClick={onClick}
    className={clsx(
      "w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors",
      // Default styling (gray/slate) if no custom class is provided
      !className && "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700",
      // Custom styling (e.g., red for logout)
      className
    )}
  >
    <div className="flex items-center gap-3">
      <Icon 
        size={16} 
        className={clsx(
          // If no custom class, force slate color.
          // If custom class exists (like text-red-600), remove this so icon inherits the red color naturally via currentColor.
          !className && "text-slate-500 dark:text-slate-400"
        )}
      />
      <span>{label}</span>
    </div>
    {shortcut && <span className="text-xs text-slate-400">{shortcut}</span>}
    {hasSubmenu && <span className="text-slate-400">›</span>}
  </button>
);

const Separator = () => <div className="h-px bg-slate-200 dark:bg-slate-700 my-1 mx-2" />;

// --- MAIN COMPONENT ---

interface UserProfileProps {
  isOpen: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    window.location.href = '/';
  };

  return (
    <div className="relative border-t border-light-border dark:border-dark-border p-3 bg-light-surface dark:bg-dark-surface">
      
      {/* --- DROPDOWN MENU --- */}
      {isMenuOpen && isOpen && (
        <div className="absolute bottom-full left-3 right-3 mb-2 bg-white dark:bg-[#212121] border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-1.5 z-50 animate-fade-in-up origin-bottom">
          
          <div className="px-3 py-2 text-xs text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700 mb-1">
            ansarimoin7861@gmail.com
          </div>

          <MenuItem icon={Settings} label="Settings" shortcut="Ctrl+," />
          <MenuItem icon={Globe} label="Language" hasSubmenu />
          <MenuItem icon={HelpCircle} label="Get help" />
          
          <Separator />
          
          <MenuItem icon={ArrowUpCircle} label="Upgrade plan" />
          <MenuItem icon={Download} label="Download Windows App" />
          <MenuItem icon={Info} label="Learn more" hasSubmenu />
          
          <Separator />
          
          <MenuItem 
            icon={LogOut} 
            label="Log out" 
            onClick={handleLogout}
            // RED COLOR STYLING HERE
            className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          />
        </div>
      )}

      {/* --- PROFILE BUTTON --- */}
      <button 
        onClick={toggleMenu}
        className={clsx(
          "flex items-center w-full rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800",
          !isOpen && "justify-center"
        )}
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary-400 to-primary-600 flex items-center justify-center text-white shadow-sm ring-2 ring-white dark:ring-slate-700 shrink-0">
          <span className="font-semibold text-xs">M</span> 
        </div>

        {isOpen && (
          <div className="ml-3 flex-1 text-left overflow-hidden">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
              Moin
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              Free plan
            </p>
          </div>
        )}

        {isOpen && (
            <ChevronUp 
                size={16} 
                className={clsx(
                    "text-slate-400 transition-transform duration-200",
                    isMenuOpen ? "rotate-180" : ""
                )} 
            />
        )}
      </button>
    </div>
  );
};

export default UserProfile;