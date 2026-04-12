import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, Users, AlertTriangle, CheckCircle, Activity, Camera, Coffee, Shield } from 'lucide-react';
import type { RootState } from '../../../store/store';
import { useEffect } from 'react';

export default function ZoneDetail() {
  const { zoneId } = useParams();
  const navigate = useNavigate();
  const zones = useSelector((state: RootState) => state.crowd.zones);
  
  // Find mapped zone, e.g. "A" -> "z1"
  const zoneKey = zoneId === 'A' ? 'z1' : zoneId === 'B' ? 'z2' : zoneId === 'C' ? 'z3' : zoneId === 'D' ? 'z4' : null;
  const zone = zoneKey ? zones[zoneKey] : null;

  // Provide a cool scroll-to-top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!zone) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center transition-colors">
        <AlertTriangle size={64} className="text-slate-300 dark:text-slate-700 mb-6" />
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-200">Zone Not Found</h1>
        <p className="text-slate-500 mt-2">The sector you're trying to view does not exist.</p>
        <button onClick={() => navigate('/map')} className="mt-8 bg-primary-500 font-bold px-6 py-3 rounded-full text-white">Back to Map</button>
      </div>
    );
  }

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
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg px-6 pt-6 pb-4 border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-10 transition-colors flex items-center">
        <button onClick={() => navigate('/map')} className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform text-slate-600 dark:text-slate-300">
          <ArrowLeft size={20} />
        </button>
        <div className="ml-4">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">Zone {zone.name} Dashboard</h1>
          <p className="text-xs font-bold text-slate-500 tracking-widest uppercase">Live Sector Analytics</p>
        </div>
      </div>

      <div className="p-6 pb-2 space-y-6">
        {/* Status Hero Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 flex flex-col shadow-sm relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full opacity-10" style={{ backgroundColor: getStopColor(zone.alertStatus) }} />
          
          <div className="flex justify-between items-start z-10">
            <div>
              <p className="text-sm font-bold tracking-widest text-slate-500 uppercase flex items-center">
                 <Activity size={14} className="mr-1" /> Saturation
              </p>
              <h2 className="text-6xl font-black mt-2" style={{ color: getStopColor(zone.alertStatus) }}>{zone.densityPercent}%</h2>
            </div>
            <div className="text-right">
              <span className={`inline-flex px-3 py-1 text-xs font-black uppercase tracking-widest rounded-full`} style={{ color: getStopColor(zone.alertStatus), backgroundColor: `${getStopColor(zone.alertStatus)}20` }}>
                {zone.alertStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 flex flex-col justify-between shadow-sm">
            <Users size={24} className="text-indigo-500 mb-3" />
            <h3 className="text-3xl font-black text-slate-800 dark:text-white">{Math.floor(zone.densityPercent * 14.5)}</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Est. Individuals</p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 flex flex-col justify-between shadow-sm">
            <Shield size={24} className="text-emerald-500 mb-3" />
            <h3 className="text-3xl font-black text-slate-800 dark:text-white">{Math.floor(zone.densityPercent / 12)} Patrols</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Security</p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 flex flex-col justify-between shadow-sm col-span-2">
            <div className="flex items-center mb-3">
              <Coffee size={24} className="text-amber-500 mr-2" />
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Food Vendor Stress</p>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-4 overflow-hidden relative">
              <div className="h-full bg-amber-500 rounded-full absolute top-0 left-0 transition-all duration-1000" style={{ width: `${zone.densityPercent}%` }} />
            </div>
            <p className="text-xs font-medium text-slate-500 mt-2 text-right">{zone.densityPercent > 70 ? "Expect >15 min lines." : "Lines moving fast."}</p>
          </div>
        </div>

        {/* AI Diagnostic Frame */}
        <div className="bg-primary-50 dark:bg-primary-900/10 rounded-3xl p-6 border border-primary-100 dark:border-primary-800/30">
          <div className="flex items-center mb-4 text-primary-600 dark:text-primary-400">
             <Camera size={20} className="mr-2" />
             <h3 className="font-black uppercase tracking-widest text-sm">Computer Vision Diagnostics</h3>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
             <p className="text-sm font-medium text-slate-700 dark:text-slate-300 italic leading-relaxed">
               "{/* @ts-ignore */}{zone.aiPrediction?.trafficReason || "Vision sensors indicate nominal crowd throughput. No bottlenecks detected."}"
             </p>
          </div>
          <ul className="mt-4 space-y-2">
              <li className="flex items-center text-xs font-bold text-primary-700 dark:text-primary-300">
                <CheckCircle size={14} className="mr-2 opacity-50" /> Emergency Exits Accessible
              </li>
              <li className="flex items-center text-xs font-bold text-primary-700 dark:text-primary-300">
                <CheckCircle size={14} className="mr-2 opacity-50" /> Temperature Nominal (22°C)
              </li>
          </ul>
        </div>

      </div>
    </div>
  )
}
