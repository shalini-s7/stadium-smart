import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { RootState } from '../../../store/store';
import { CrowdMeter } from '../../../components/ui/CrowdMeter';
import { AiTipCard } from '../../../components/ui/AiTipCard';
import { Ticket, Utensils, Calendar, BellRing, Flame } from 'lucide-react';
import clsx from 'clsx';

export default function Home() {
  const globalDensity = useSelector((state: RootState) => state.crowd.globalDensity);
  const profile = useSelector((state: RootState) => state.user.profile);
  const liveMatchContext = useSelector((state: RootState) => state.liveMatch);

  const aiMessage = useMemo(() => {
    if (globalDensity === 'critical') {
       return "Avoid Gate A. We recommend using Gate C, which currently has a 4-minute wait time.";
    } else if (globalDensity === 'high') {
       return "Areas are filling up fast. Head to your seat in Zone B while routes are clear.";
    }
    return "Crowds are normal. Grab some food at Food Court North before the rush begins!";
  }, [globalDensity]);

  const quickActions = [
    { icon: Ticket, label: 'My Seat', color: 'bg-gradient-to-br from-blue-400 to-indigo-500 text-white shadow-blue-500/30', to: '/my-seat' },
    { icon: Utensils, label: 'Food Near Me', color: 'bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-orange-500/30', to: '/food' },
    { icon: Calendar, label: 'Events', color: 'bg-gradient-to-br from-teal-400 to-emerald-500 text-white shadow-teal-500/30', to: '/events' },
    { icon: BellRing, label: 'Alerts', color: 'bg-gradient-to-br from-purple-400 to-fuchsia-500 text-white shadow-purple-500/30', to: '/alerts' },
  ];

  return (
    <div className="flex flex-col min-h-screen pb-24 transition-colors">
      {/* V4 Multi-Color Header Component */}
      <div className="relative overflow-hidden bg-slate-950 text-white px-6 pt-12 pb-8 md:rounded-b-[3rem] shadow-2xl transition-colors">
        {/* Dynamic Abstract Gradients */}
        <div className="absolute top-[-50%] right-[-10%] w-[120%] h-[150%] pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary-500 rounded-full mix-blend-screen filter blur-[80px] opacity-60 animate-pulse" />
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-fuchsia-600 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-amber-500 rounded-full mix-blend-screen filter blur-[100px] opacity-30" />
        </div>
        
        {/* Header Content */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 mb-4 shadow-xl">
             <img src={profile?.avatar || "https://api.dicebear.com/7.x/notionists/svg?seed=Fan"} className="w-14 h-14 rounded-[1.2rem]" alt="Profile" />
          </motion.div>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-primary-200 font-bold tracking-widest text-xs uppercase mb-1 drop-shadow-md">
            Welcome back, {profile?.name || 'Super Fan'}
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl font-black tracking-tighter leading-tight drop-shadow-xl bg-clip-text text-transparent bg-gradient-to-r from-white via-primary-100 to-slate-300">
            SmartStadium
          </motion.h1>

          {/* V4 Mini Live Match Card */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="mt-6 w-full max-w-sm bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-4 text-left relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 rounded-full filter blur-2xl group-hover:bg-primary-500/40 transition-colors" />
             <div className="flex justify-between items-center mb-1 relative z-10">
               <span className="text-[10px] uppercase tracking-widest font-bold text-slate-300 flex items-center"><Flame size={12} className="text-orange-400 mr-1" /> Live • {liveMatchContext.sport}</span>
               <span className="text-[10px] font-bold text-white bg-white/20 px-2 py-0.5 rounded-full">{liveMatchContext.currentOver}</span>
             </div>
             <p className="text-lg font-black text-white relative z-10">{liveMatchContext.teams.join(' vs ')}</p>
             <p className="text-sm font-medium text-slate-200 mt-1 relative z-10">Score: <span className="font-bold text-primary-300">{liveMatchContext.currentScore}</span></p>
          </motion.div>
        </div>
      </div>

      <div className="px-5 py-6 space-y-6 flex-1 bg-slate-50 dark:bg-slate-950 transition-colors">
        
        {/* Real-time Status */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CrowdMeter status={globalDensity} />
        </section>

        {/* AI Tip Glassmorphism Redesign */}
        <section className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both">
          <AiTipCard message={aiMessage} />
        </section>

        {/* Multi-Color Quick Actions */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
          <h3 className="font-extrabold text-slate-900 dark:text-white mb-4 px-1 text-lg">Command Center</h3>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <Link key={i} to={action.to} className="flex flex-col items-center justify-center p-5 bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all active:scale-95 space-y-3 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-100/50 to-transparent dark:from-slate-800/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className={clsx("p-4 rounded-[1.5em] shadow-lg transition-transform group-hover:scale-110", action.color)}>
                    <Icon size={24} />
                  </div>
                  <span className="font-bold text-sm text-slate-700 dark:text-slate-300 relative z-10">{action.label}</span>
                </Link>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
