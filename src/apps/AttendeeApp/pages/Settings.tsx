import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, logout } from '../../../store/userSlice';
import type { RootState } from '../../../store/store';
import { useTheme } from '../../../components/layout/ThemeProvider';
import { LogOut, Save, Moon, Sun, Monitor } from 'lucide-react';
import { useState } from 'react';

export default function Settings() {
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.user.profile);
  const { theme, setTheme } = useTheme();
  
  const [name, setName] = useState(profile?.name || '');
  const [favoriteTeam, setFavoriteTeam] = useState(profile?.favoriteTeam || '');
  const [diet, setDiet] = useState(profile?.diet || '');

  const handleSave = () => {
    dispatch(updateProfile({ name, favoriteTeam, diet }));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 transition-colors">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg px-6 pt-6 pb-4 border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-10">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage profile and preferences</p>
      </div>

      <div className="p-4 space-y-6">
         {/* Theme Settings */}
         <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
           <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 tracking-wider uppercase">Appearance</h2>
           <div className="grid grid-cols-3 gap-3">
             <button onClick={() => setTheme('light')} className={`flex flex-col items-center justify-center p-3 rounded-xl border ${theme === 'light' ? 'bg-primary-50 border-primary-500 text-primary-600 dark:bg-primary-900/20' : 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-500 dark:text-slate-400'} transition-all`}>
               <Sun size={24} className="mb-2" />
               <span className="text-xs font-bold">Light</span>
             </button>
             <button onClick={() => setTheme('dark')} className={`flex flex-col items-center justify-center p-3 rounded-xl border ${theme === 'dark' ? 'bg-primary-50 border-primary-500 text-primary-600 dark:bg-primary-900/20' : 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-500 dark:text-slate-400'} transition-all`}>
               <Moon size={24} className="mb-2" />
               <span className="text-xs font-bold">Dark</span>
             </button>
             <button onClick={() => setTheme('system')} className={`flex flex-col items-center justify-center p-3 rounded-xl border ${theme === 'system' ? 'bg-primary-50 border-primary-500 text-primary-600 dark:bg-primary-900/20' : 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-500 dark:text-slate-400'} transition-all`}>
               <Monitor size={24} className="mb-2" />
               <span className="text-xs font-bold">System</span>
             </button>
           </div>
         </div>

         {/* Profile Details */}
         <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
           <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 tracking-wider uppercase mb-2">Profile Details</h2>
           
           <div>
             <label className="block text-xs font-semibold text-slate-500 mb-1">Full Name</label>
             <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm dark:text-white outline-none focus:border-primary-500 transition-colors" />
           </div>

           <div>
             <label className="block text-xs font-semibold text-slate-500 mb-1">Favorite Team</label>
             <input type="text" value={favoriteTeam} onChange={e => setFavoriteTeam(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm dark:text-white outline-none focus:border-primary-500 transition-colors" />
           </div>

           <div>
             <label className="block text-xs font-semibold text-slate-500 mb-1">Dietary Preference</label>
             <select value={diet} onChange={e => setDiet(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm dark:text-white outline-none focus:border-primary-500 transition-colors">
               <option value="None">No Restriction</option>
               <option value="Vegetarian">Vegetarian</option>
               <option value="Vegan">Vegan</option>
               <option value="Gluten-Free">Gluten-Free</option>
             </select>
           </div>

           <button onClick={handleSave} className="w-full mt-4 flex items-center justify-center space-x-2 py-3 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 transition-colors">
             <Save size={18} />
             <span>Save Profile</span>
           </button>
         </div>

         {/* Actions */}
         <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-2 py-4 bg-red-50 dark:bg-red-500/10 text-red-600 rounded-3xl font-bold hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors shadow-sm border border-red-100 dark:border-red-900/50">
           <LogOut size={18} />
           <span>Log Out</span>
         </button>
      </div>
    </div>
  )
}
