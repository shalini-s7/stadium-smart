import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import type { RootState } from '../../../store/store';
import { AlertTriangle, CheckCircle, X, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CrowdMap() {
  const globalDensity = useSelector((state: RootState) => state.crowd.globalDensity);
  const zones = useSelector((state: RootState) => state.crowd.zones);
  const navigate = useNavigate();
  const [selectedZone, setSelectedZone] = useState<typeof zones['z1'] | null>(null);

  const handleZoneClick = (zoneId: string) => {
    setSelectedZone(zones[zoneId]);
  };

  const getStopColor = (status: string) => {
    switch (status) {
      case 'clear': return '#10b981'; // Tailwind green-500
      case 'moderate': return '#f59e0b'; // Tailwind amber-500
      case 'high': return '#ef4444'; // Tailwind red-500
      case 'critical': return '#dc2626'; // Tailwind red-600
      default: return '#3b82f6';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 transition-colors">
      <div className="px-6 pt-6 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Live Heatmap</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time crowd intelligence mapping</p>
      </div>

      <div className="px-6 mb-4 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
        <span>Stadium Status</span>
        <div className="flex items-center">
          <span className="relative flex h-3 w-3 mr-2">
            {globalDensity === 'critical' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>}
            <span className={`relative inline-flex rounded-full h-3 w-3 ${globalDensity === 'critical' ? 'bg-red-500' : 'bg-green-500'}`}></span>
          </span>
          {globalDensity}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 -mt-10">
        <div className="relative w-full max-w-sm aspect-square bg-white dark:bg-slate-900 rounded-full shadow-2xl border-4 border-slate-100 dark:border-slate-800 p-8 flex items-center justify-center">
          
          <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-xl overflow-visible">
            <defs>
              {Object.values(zones).map(zone => (
                <radialGradient key={`grad-${zone.id}`} id={`grad-${zone.id}`} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                  <stop offset="0%" stopColor={getStopColor(zone.alertStatus)} stopOpacity="0.8" />
                  <stop offset="70%" stopColor={getStopColor(zone.alertStatus)} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={getStopColor(zone.alertStatus)} stopOpacity="0" />
                </radialGradient>
              ))}
            </defs>

            {/* Stadium Outline */}
            <circle cx="200" cy="200" r="180" fill="none" stroke="currentColor" strokeWidth="4" className="text-slate-200 dark:text-slate-700" />
            <circle cx="200" cy="200" r="90" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300 dark:text-slate-600 border-dashed" />
            
            {/* Zones Heat Bubbles (Now Interactive) */}
            <g className="transition-all duration-1000 opacity-80 cursor-pointer pointer-events-auto">
              <motion.circle onClick={() => handleZoneClick('z1')} className="hover:opacity-100" animate={{ scale: [1, 1.05, 1], opacity: [0.6, 0.8, 0.6] }} transition={{ duration: 3, repeat: Infinity }} cx="120" cy="120" r="80" fill="url(#grad-z1)" />
              <motion.circle onClick={() => handleZoneClick('z2')} className="hover:opacity-100" animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.8, 0.6] }} transition={{ duration: 4, repeat: Infinity }} cx="280" cy="120" r="80" fill="url(#grad-z2)" />
              <motion.circle onClick={() => handleZoneClick('z3')} className="hover:opacity-100" animate={{ scale: [1, 1.05, 1], opacity: [0.6, 0.8, 0.6] }} transition={{ duration: 3.5, repeat: Infinity }} cx="200" cy="280" r="100" fill="url(#grad-z3)" />
              <motion.circle onClick={() => handleZoneClick('z4')} className="hover:opacity-100" animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.8, 0.6] }} transition={{ duration: 2.5, repeat: Infinity }} cx="100" cy="240" r="70" fill="url(#grad-z4)" />
            </g>

            {/* Field markers */}
            <rect x="140" y="140" width="120" height="120" rx="20" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300 dark:text-slate-600 pointer-events-none" />
            <text x="200" y="200" textAnchor="middle" dominantBaseline="middle" fill="currentColor" className="text-slate-400 dark:text-slate-500 font-bold text-xl tracking-widest pointer-events-none">FIELD</text>
            
            {/* Labels */}
            <text x="70" y="70" fill="currentColor" className="text-slate-800 dark:text-slate-200 font-black text-2xl pointer-events-none">A</text>
            <text x="330" y="70" fill="currentColor" className="text-slate-800 dark:text-slate-200 font-black text-2xl pointer-events-none">B</text>
            <text x="200" y="350" fill="currentColor" className="text-slate-800 dark:text-slate-200 font-black text-2xl pointer-events-none">C</text>
          </svg>


          
        </div>
      </div>

      <div className="px-5 space-y-4">
        <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-lg">Zone Breakdown</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.values(zones).map(zone => (
            <motion.div 
              key={zone.id}
              whileHover={{ scale: 1.02 }}
              className={`p-4 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-black text-xl text-slate-900 dark:text-white">Zone {zone.name}</span>
                {zone.alertStatus === 'critical' ? <AlertTriangle size={18} className="text-red-500" /> : <CheckCircle size={18} className="text-green-500" />}
              </div>
              <div className="flex items-end justify-between mb-4">
                <span className="text-3xl font-extrabold tracking-tighter" style={{ color: getStopColor(zone.alertStatus) }}>{zone.densityPercent}%</span>
              </div>
              {/* @ts-ignore */}
              {zone.aiPrediction?.trafficReason && (
                 <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
                   {/* @ts-ignore */}
                   🧠 {zone.aiPrediction.trafficReason}
                 </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    {/* Interactive Zone Bottom Sheet */}
      <AnimatePresence>
        {selectedZone && (
          <motion.div 
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur z-[100] flex flex-col justify-end pointer-events-auto"
          >
            <div className="bg-white dark:bg-slate-900 w-full md:max-w-md md:mx-auto rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex flex-col pointer-events-auto border-t border-slate-200 dark:border-slate-800">
               <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950 rounded-t-3xl">
                 <h2 className="font-extrabold text-xl text-slate-900 dark:text-white flex items-center">
                   <Navigation size={20} className="mr-2 text-primary-500" /> Zone {selectedZone.name} Diagnostics
                 </h2>
                 <button onClick={() => setSelectedZone(null)} className="w-8 h-8 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 active:scale-95"><X size={18} /></button>
               </div>
               
               <div className="p-6">
                 <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Live Density</p>
                      <span className="text-4xl font-black" style={{ color: getStopColor(selectedZone.alertStatus) }}>{selectedZone.densityPercent}%</span>
                    </div>
                    {selectedZone.alertStatus === 'critical' ? (
                      <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-xl flex items-center font-bold">
                        <AlertTriangle size={18} className="mr-2" /> Critical Traffic
                      </div>
                    ) : (
                      <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-4 py-2 rounded-xl flex items-center font-bold">
                        <CheckCircle size={18} className="mr-2" /> Flowing Normally
                      </div>
                    )}
                 </div>

                 {/* @ts-ignore */}
                 <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-5 mb-6">
                    <p className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-widest mb-3">AI Root Cause Analysis</p>
                    {/* @ts-ignore */}
                    <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">🧠 {selectedZone.aiPrediction?.trafficReason || "No unusual activity detected. Standard flow."}</p>
                 </div>

                 <button 
                   onClick={() => navigate(`/zone/${selectedZone.name}`)}
                   className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 rounded-xl shadow-xl active:scale-95 transition-transform"
                 >
                   View Full Security Metrics
                 </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
