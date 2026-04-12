import { NavLink } from 'react-router-dom';
import { Home, Map, Calendar, Bell, Settings as SettingsIcon, Ticket, Utensils } from 'lucide-react';
import clsx from 'clsx';

export const Sidebar = () => {
  const tabs = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/map', icon: Map, label: 'Live Heatmap' },
    { to: '/events', icon: Calendar, label: 'Events' },
    { to: '/my-seat', icon: Ticket, label: 'My Seat' },
    { to: '/food', icon: Utensils, label: 'Food' },
    { to: '/alerts', icon: Bell, label: 'Alerts' },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 hidden md:flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary-500 rounded-full shadow-[0_0_10px_rgba(14,165,233,0.8)]" />
          <span>SmartStadium</span>
        </h1>
      </div>
      
      <nav className="flex-1 py-6 px-4 space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                clsx(
                  'flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                  isActive 
                    ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20' 
                    : 'hover:bg-white/5 hover:text-white'
                )
              }
            >
              <Icon size={20} className="opacity-80 group-hover:opacity-100" />
              <span className="font-medium">{tab.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            clsx(
              'flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group border',
              isActive 
                ? 'bg-primary-500 border-primary-500 text-white shadow-md shadow-primary-500/20' 
                : 'bg-slate-800 border-white/5 text-slate-300 hover:bg-slate-700 hover:text-white shadow-inner'
            )
          }
        >
          <div className="flex items-center space-x-3">
            <SettingsIcon size={20} className="opacity-80 group-hover:opacity-100" />
            <span className="font-medium">Settings</span>
          </div>
        </NavLink>
      </div>
    </aside>
  );
};
