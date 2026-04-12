import { useSelector } from 'react-redux';
import { Bell, Flame, Info, CheckCircle2, AlertTriangle, Coffee } from 'lucide-react';
import type { RootState } from '../../../store/store';
import { motion, AnimatePresence } from 'framer-motion';

export default function Alerts() {
  const events = useSelector((state: RootState) => state.liveMatch.events);
  const { isBreakTime, isRushTime } = useSelector((state: RootState) => state.liveMatch);

  const getIcon = (type: string) => {
    switch (type) {
      case 'six':
      case 'four':
        return <Flame className="text-amber-500" size={24} />;
      case 'wicket':
        return <AlertTriangle className="text-red-500" size={24} />;
      case 'break':
        return <Coffee className="text-blue-500" size={24} />;
      case 'rush':
        return <Info className="text-purple-500" size={24} />;
      default:
        return <CheckCircle2 className="text-primary-500" size={24} />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'six':
      case 'four':
        return 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/50';
      case 'wicket':
        return 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/50';
      case 'break':
        return 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/50';
      case 'rush':
        return 'bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800/50';
      default:
        return 'bg-white dark:bg-slate-800/50 border-slate-100 dark:border-slate-700/50';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 transition-colors">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg px-6 pt-6 pb-4 border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Live Alerts</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time match and venue updates</p>
          </div>
          <div className="relative">
            <Bell className="text-slate-400 dark:text-slate-500" />
            {(isBreakTime || isRushTime) && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
            )}
            {(isBreakTime || isRushTime) && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            )}
          </div>
        </div>

        {/* Dynamic Status Pill */}
        <AnimatePresence>
          {(isBreakTime || isRushTime) && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 flex items-center p-3 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl"
            >
              <AlertTriangle className="text-red-500 mr-2" size={18} />
              <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                {isBreakTime ? "Break Time! Expect massive queues." : "Rush Time! Movement is highly restricted."}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 space-y-4">
        <AnimatePresence>
          {events.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 text-slate-500 dark:text-slate-400">
              No alerts yet. Waiting for action!
            </motion.div>
          ) : (
            events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                layout
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className={`p-4 rounded-2xl border shadow-sm flex items-start space-x-4 ${getBgColor(event.type)}`}
              >
                <div className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm">
                  {getIcon(event.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 block">
                      {event.type}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                      {index === 0 ? 'Just now' : new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-snug">
                    {event.text}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
