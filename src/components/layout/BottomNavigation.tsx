import { NavLink } from 'react-router-dom';
import { Home, Map, Calendar, Bell, Utensils } from 'lucide-react';
import clsx from 'clsx';

export const BottomNavigation = () => {
  const tabs = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/map', icon: Map, label: 'Heatmap' },
    { to: '/food', icon: Utensils, label: 'Food' },
    { to: '/events', icon: Calendar, label: 'Events' },
    { to: '/alerts', icon: Bell, label: 'Alerts' },
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 z-50 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                clsx(
                  'flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors',
                  isActive ? 'text-primary-500' : 'text-gray-400 hover:text-gray-600'
                )
              }
            >
              <Icon size={24} strokeWidth={2.5} />
              <span className="text-[10px] font-semibold">{tab.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
