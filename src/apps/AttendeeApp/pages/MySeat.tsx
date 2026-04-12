import { Ticket, Navigation, Compass, MapPin, UserCheck, Loader2, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { RootState } from '../../../store/store';

export default function MySeat() {
  const { bookedSeats, hasBooked } = useSelector((state: RootState) => state.booking);
  
  if (!hasBooked || bookedSeats.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 items-center justify-center p-6 text-center">
        <AlertCircle size={60} className="text-slate-300 dark:text-slate-700 mb-4" />
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No Ticket Found</h2>
        <p className="text-slate-500 mb-6 font-medium">You haven't booked any seats yet.</p>
        <Link to="/events" className="bg-primary-500 text-white px-6 py-3 rounded-xl font-bold shadow-xl shadow-primary-500/30 active:scale-95 transition-all">
          Browse Events
        </Link>
      </div>
    );
  }

  const firstSeat = bookedSeats[0];
  const seatRow = firstSeat.charAt(0);
  const seatCol = firstSeat.substring(1);

  const [isNavigating, setIsNavigating] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [geoError, setGeoError] = useState('');

  const stadiumLocation: [number, number] = [18.9389, 72.8258]; // Example: Wankhede Stadium

  const handleStartNavigation = () => {
    setIsNavigating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          setGeoError("Failed to get your GPS. Rendered mock route.");
          setUserLocation([18.9322, 72.8264]); // Mock near stadium
        }
      );
    } else {
      setGeoError("Geolocation is not supported. Rendered mock route.");
      setUserLocation([18.9322, 72.8264]);
    }
  };

  const gateInfo = { gate: 'Gate A', section: '12', row: seatRow, seat: seatCol };
  
  // Generate a mock seating block array
  const columns = Array.from({length: 12}, (_, i) => i + 38);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 transition-colors">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg px-6 pt-6 pb-4 border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-10 transition-colors">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">My Seat Allocation</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Navigate to your designated zone.</p>
      </div>

      <div className="p-4 space-y-6">
        
        {/* Ticket Context */}
        <div className="bg-gradient-to-r from-primary-600 to-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-primary-500/20 relative overflow-hidden">
           <div className="absolute top-[-50%] right-[-10%] w-32 h-32 bg-white/20 blur-2xl rounded-full" />
           <div className="flex items-center mb-4">
             <Ticket size={24} className="mr-3 text-primary-200" />
             <h2 className="font-black text-xl tracking-tighter">Championship Finals</h2>
           </div>
           
           <div className="grid grid-cols-4 gap-2 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
             <div className="flex flex-col"><span className="text-[10px] text-primary-200 uppercase font-bold tracking-widest">Gate</span><span className="font-extrabold text-lg">{gateInfo.gate.split(' ')[1]}</span></div>
             <div className="flex flex-col border-l border-white/20 pl-2"><span className="text-[10px] text-primary-200 uppercase font-bold tracking-widest">Sec</span><span className="font-extrabold text-lg">{gateInfo.section}</span></div>
             <div className="flex flex-col border-l border-white/20 pl-2"><span className="text-[10px] text-primary-200 uppercase font-bold tracking-widest">Row</span><span className="font-extrabold text-lg">{gateInfo.row}</span></div>
             <div className="flex flex-col border-l border-white/20 pl-2"><span className="text-[10px] text-primary-200 uppercase font-bold tracking-widest">Seat</span><span className="font-extrabold text-lg text-primary-300">{gateInfo.seat}</span></div>
           </div>
        </div>

        {/* Visual Seat Block */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm overflow-x-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-700 dark:text-slate-300">Section {gateInfo.section} Block</h3>
            <div className="flex items-center space-x-3 text-xs font-bold text-slate-500">
              <span className="flex items-center"><div className="w-3 h-3 rounded-sm bg-slate-200 dark:bg-slate-800 mr-1" /> Other</span>
              <span className="flex items-center"><div className="w-3 h-3 rounded-sm bg-primary-500 mr-1 shadow-[0_0_8px_rgba(14,165,233,0.8)]" /> You</span>
            </div>
          </div>

          <div className="flex flex-col space-y-2 min-w-[500px]">
             {/* Stage/Pitch direction */}
             <div className="w-full text-center text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-600 mb-4 border-b-2 border-slate-200 dark:border-slate-800 pb-2">PITCH DIRECTION</div>
             
             {['A','B','C', seatRow, 'X','Y'].map((row) => {
                if (row === 'X' || row === 'Y') return null; // just creating a mock range around their row
                return (
                <div key={row} className="flex items-center space-x-2">
                  <span className="w-6 text-xs font-bold text-slate-400">{row}</span>
                  <div className="flex space-x-1 border-l-2 pl-2 border-slate-100 dark:border-slate-800">
                    {columns.map(col => {
                      const isMySeat = bookedSeats.includes(`${row}${col}`);
                      return (
                        <div 
                          key={`${row}-${col}`}
                          className={clsx(
                            "w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all",
                            isMySeat 
                              ? "bg-primary-500 text-white shadow-[0_0_12px_rgba(14,165,233,0.8)] z-10 scale-125" 
                              : "bg-slate-100/50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                          )}
                        >
                          {col}
                        </div>
                      )
                    })}
                  </div>
                </div>
              );
             })}
          </div>
        </div>

        {/* Walk Instructions */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
           <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center"><Compass size={18} className="mr-2 text-indigo-500" /> Navigation Route</h3>
           
           <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500"><MapPin size={12} /></div>
                  <div className="w-0.5 h-10 bg-slate-100 dark:bg-slate-800 mt-2"></div>
                </div>
                <div className="ml-3 pt-1">
                  <p className="font-bold text-sm text-slate-900 dark:text-white">Current Location</p>
                  <p className="text-xs text-slate-500">Stadium Main Plaza</p>
                </div>
              </div>
              
              <div className="flex items-start opacity-50">
                <div className="w-8 flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold text-[10px]">1</div>
                  <div className="w-0.5 h-10 bg-slate-100 dark:bg-slate-800 mt-2"></div>
                </div>
                <div className="ml-3 pt-1">
                  <p className="font-bold text-sm text-slate-900 dark:text-white">Enter {gateInfo.gate}</p>
                  <p className="text-xs text-slate-500">Scan QR at Turnstile 4</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full border-2 border-primary-500 flex items-center justify-center text-primary-500 bg-primary-50 dark:bg-primary-900/20"><UserCheck size={12} /></div>
                </div>
                <div className="ml-3 pt-1">
                  <p className="font-bold text-sm text-primary-600 dark:text-primary-400">Arrive at Seat</p>
                  <p className="text-xs text-slate-500">Sec {gateInfo.section}, Row {gateInfo.row}</p>
                </div>
              </div>
           </div>

           {isNavigating && userLocation ? (
             <div className="mt-6 rounded-2xl overflow-hidden border-2 border-primary-500 shadow-xl h-64 w-full relative">
               <MapContainer center={userLocation} zoom={14} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={userLocation}>
                    <Popup>You are here</Popup>
                  </Marker>
                  <Marker position={stadiumLocation}>
                    <Popup>SmartStadium Gate A</Popup>
                  </Marker>
                  <Polyline positions={[userLocation, stadiumLocation]} color="#0ea5e9" weight={5} dashArray="10, 10" />
               </MapContainer>
               {geoError && <div className="absolute bottom-2 left-2 right-2 bg-white/90 p-2 rounded-lg text-xs font-bold text-red-500 text-center z-[400] shadow-md">{geoError}</div>}
             </div>
           ) : (
             <button 
               onClick={handleStartNavigation}
               disabled={isNavigating && !userLocation}
               className="w-full mt-6 py-4 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl font-bold flex items-center justify-center shadow-lg active:scale-95 transition-transform disabled:opacity-80"
             >
               {isNavigating ? <Loader2 size={18} className="animate-spin mr-2" /> : <Navigation size={18} className="mr-2" />} 
               {isNavigating ? "Acquiring GPS Signal..." : "Start Live Navigation"}
             </button>
           )}
        </div>

      </div>
    </div>
  )
}
