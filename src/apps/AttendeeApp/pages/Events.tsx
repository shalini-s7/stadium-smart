import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, TicketCheck, ChevronRight, X, CheckCircle, Smartphone, CreditCard, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { bookSeats } from '../../../store/bookingSlice';

const UPCOMING_EVENTS = [
  { id: 1, title: 'Championship Finals: IND vs AUS', date: 'Tomorrow, 14:00', venue: 'Main Stadium', tickets: 'Filling Fast', image: 'https://placehold.co/800x400/0f172a/ffffff?text=Championship+Finals&font=Montserrat', price: 1500 },
  { id: 2, title: 'Global Music Festival', date: 'Oct 24, 18:00', venue: 'Arena North', tickets: 'Available', image: 'https://placehold.co/800x400/0f172a/0ea5e9?text=Global+Music+Festival&font=Montserrat', price: 2500 },
  { id: 3, title: 'Local League Playoffs', date: 'Oct 28, 16:00', venue: 'Stadium Grounds', tickets: 'Available', image: 'https://placehold.co/800x400/0f172a/10b981?text=League+Playoffs&font=Montserrat', price: 500 },
];

export default function Events() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedEvent, setSelectedEvent] = useState<typeof UPCOMING_EVENTS[0] | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [bookingStatus, setBookingStatus] = useState<'idle'|'processing'|'success'>('idle');
  
  // Swiggy-Style Checkout State
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi'|'card'>('upi');

  // Generate 5x8 grid of mock seats. Randomly assign some as 'booked'
  const rows = ['A','B','C','D','E'];
  const cols = Array.from({length: 8}, (_, i) => i + 1);
  const [bookedSeats] = useState(() => {
    const s = new Set();
    while(s.size < 15) {
       s.add(`${rows[Math.floor(Math.random()*rows.length)]}${cols[Math.floor(Math.random()*cols.length)]}`);
    }
    return s;
  });

  const toggleSeat = (seatId: string) => {
    if (bookedSeats.has(seatId)) return;
    setSelectedSeats(prev => 
      prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]
    );
  };

  const handlePayClick = () => {
    setBookingStatus('processing');
    setTimeout(() => {
       setShowCheckout(false);
       setBookingStatus('success');
       setTimeout(() => {
         dispatch(bookSeats(selectedSeats));
         navigate('/my-seat');
       }, 3000);
    }, 2500);
  };

  const totalPrice = selectedEvent ? selectedEvent.price * selectedSeats.length : 0;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 transition-colors relative">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg px-6 pt-6 pb-4 border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-10 transition-colors">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Upcoming Events</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Book premium venue experiences.</p>
      </div>

      <div className="p-4 space-y-4">
        {UPCOMING_EVENTS.map(event => (
          <motion.div 
            whileHover={{ scale: 1.02 }}
            key={event.id}
            onClick={() => { setSelectedEvent(event); setSelectedSeats([]); setBookingStatus('idle'); setShowCheckout(false); }}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col group cursor-pointer"
          >
            <div className="h-32 relative overflow-hidden">
               <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-transparent transition-colors z-10" />
               <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
               <div className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-800">
                 {event.tickets}
               </div>
            </div>
            <div className="p-5 flex justify-between items-center">
              <div>
                 <h3 className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight mb-2">{event.title}</h3>
                 <div className="flex items-center text-slate-500 dark:text-slate-400 text-xs font-semibold space-x-4">
                   <span className="flex items-center"><Calendar size={14} className="mr-1 text-primary-500" /> {event.date}</span>
                   <span className="flex items-center"><MapPin size={14} className="mr-1 text-indigo-500" /> {event.venue}</span>
                 </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                <ChevronRight size={20} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Seat Booking Modal Layer */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-white dark:bg-slate-950 flex flex-col md:rounded-t-[3rem] shadow-2xl overflow-hidden"
          >
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900 sticky top-0 z-20">
              <div className="flex-1 flex items-center justify-between">
                 <h2 className="font-extrabold text-lg flex items-center text-slate-900 dark:text-white"><TicketCheck size={20} className="mr-2 text-primary-500" /> Select Seats</h2>
                 <button onClick={() => setSelectedEvent(null)} className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300"><X size={20} /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col pt-10">
               {bookingStatus === 'success' ? (
                 <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-500 mb-6 border-4 border-green-200 dark:border-green-800 shadow-xl">
                      <CheckCircle size={50} />
                    </motion.div>
                    <h2 className="text-3xl font-black mb-2 text-slate-900 dark:text-white">Tickets Secured!</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium">Seats {selectedSeats.join(', ')} reserved. Re-routing you to your tickets...</p>
                 </div>
               ) : (
                 <>
                   {/* Stadium Display */}
                   <div className="flex flex-col items-center flex-1">
                     <div className="w-full max-w-sm h-12 bg-gradient-to-b from-slate-200 to-transparent dark:from-slate-800 rounded-t-[100px] border-t-8 border-slate-300 dark:border-slate-700 flex items-center justify-center mb-10 shadow-inner">
                       <span className="text-xs font-black tracking-widest text-slate-400">PITCH / STAGE</span>
                     </div>
                     
                     {/* Seat Grid */}
                     <div className="flex flex-col space-y-3 relative z-10 w-full max-w-[300px]">
                       {rows.map(row => (
                         <div key={row} className="flex justify-between items-center w-full">
                           <span className="text-xs font-bold w-4 text-slate-400">{row}</span>
                           <div className="flex space-x-2 flex-1 justify-center">
                             {cols.map(col => {
                               const seatId = `${row}${col}`;
                               const isBooked = bookedSeats.has(seatId);
                               const isSelected = selectedSeats.includes(seatId);
                               return (
                                 <button 
                                   key={seatId}
                                   disabled={isBooked}
                                   onClick={() => toggleSeat(seatId)}
                                   className={clsx(
                                     "flex items-center justify-center rounded-t-md rounded-b flex-1 h-8 transition-all relative overflow-hidden",
                                     isBooked ? "bg-slate-200 dark:bg-slate-800 text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-50" :
                                     isSelected ? "bg-primary-500 text-white shadow-[0_0_15px_rgba(14,165,233,0.6)] scale-110 z-10" :
                                     "bg-emerald-100 hover:bg-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:hover:bg-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                                   )}
                                 >
                                    <span className="text-[10px] font-bold relative z-10">{col}</span>
                                    {isSelected && <div className="absolute inset-0 bg-white/20 animate-pulse" />}
                                 </button>
                               )
                             })}
                           </div>
                           <span className="text-xs font-bold w-4 text-slate-400 text-right">{row}</span>
                         </div>
                       ))}
                     </div>
                   </div>

                   {/* Booking Panel */}
                   <div className="bg-slate-100 dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 mt-8 shadow-sm">
                     <div className="flex justify-between items-center mb-6">
                       <div className="flex-1 pr-4 max-w-[50%]">
                         <p className="text-xs font-bold tracking-widest text-slate-500 uppercase">Selected ({selectedSeats.length})</p>
                         <h3 className="text-2xl font-black text-slate-900 dark:text-white truncate">{selectedSeats.length > 0 ? selectedSeats.join(', ') : "None"}</h3>
                       </div>
                       <div className="text-right">
                         <p className="text-xs font-bold tracking-widest text-slate-500 uppercase">Price</p>
                         <h3 className="text-2xl font-black text-primary-500">₹{totalPrice}</h3>
                       </div>
                     </div>
                     <button 
                       disabled={selectedSeats.length === 0}
                       onClick={() => setShowCheckout(true)}
                       className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-xl font-bold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all shadow-xl shadow-slate-900/10"
                     >
                       Proceed to Checkout
                     </button>
                   </div>
                 </>
               )}
            </div>

            {/* Swiggy-Style Secure Payment Overlay */}
            <AnimatePresence>
              {showCheckout && (
                <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="absolute inset-0 bg-white dark:bg-slate-950 z-[70] flex flex-col">
                  
                  {/* Header */}
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center bg-white dark:bg-slate-950 sticky top-0 z-20">
                     <button onClick={() => setShowCheckout(false)} disabled={bookingStatus === 'processing'} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 active:scale-95 disabled:opacity-50">
                       <X size={20} />
                     </button>
                     <div className="ml-4">
                       <h2 className="font-extrabold dark:text-white text-lg">Secure Payment</h2>
                       <p className="text-xs font-bold text-slate-500 tracking-widest uppercase">Razorpay Gateway</p>
                     </div>
                  </div>

                  {/* Payment Selection Body */}
                  <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900 p-6 flex flex-col space-y-6">
                     
                     <div className="bg-white dark:bg-slate-950 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex justify-between items-center">
                        <span className="font-medium text-slate-600 dark:text-slate-400">Total Amount Payable</span>
                        <span className="text-2xl font-black text-slate-900 dark:text-white">₹{totalPrice}</span>
                     </div>

                     <div className="space-y-3">
                       <h3 className="text-xs font-black tracking-widest uppercase text-slate-400 ml-1">Payment Method</h3>
                       
                       {/* UPI Box */}
                       <label className={clsx("flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all bg-white dark:bg-slate-950", paymentMethod === 'upi' ? "border-primary-500 shadow-[0_0_15px_rgba(14,165,233,0.1)]" : "border-slate-200 dark:border-slate-800")}>
                          <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="w-5 h-5 text-primary-500 accent-primary-500" />
                          <div className="ml-4 flex-1">
                             <div className="flex items-center font-bold text-slate-900 dark:text-white text-lg mb-0.5"><Smartphone size={18} className="mr-2 text-indigo-500" /> UPI Options</div>
                             <p className="text-sm text-slate-500 dark:text-slate-400">Google Pay, PhonePe, Paytm</p>
                          </div>
                       </label>

                       {/* Card Box */}
                       <label className={clsx("flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all bg-white dark:bg-slate-950", paymentMethod === 'card' ? "border-primary-500 shadow-[0_0_15px_rgba(14,165,233,0.1)]" : "border-slate-200 dark:border-slate-800")}>
                          <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="w-5 h-5 text-primary-500 accent-primary-500" />
                          <div className="ml-4 flex-1">
                             <div className="flex items-center font-bold text-slate-900 dark:text-white text-lg mb-0.5"><CreditCard size={18} className="mr-2 text-emerald-500" /> Credit / Debit Card</div>
                             <p className="text-sm text-slate-500 dark:text-slate-400">Visa, Mastercard, RuPay</p>
                          </div>
                       </label>
                     </div>

                     <div className="bg-white dark:bg-slate-950 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        {paymentMethod === 'upi' ? (
                          <>
                            <p className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center"><Smartphone size={16} className="mr-1.5 text-slate-400" /> Enter UPI ID</p>
                            <input type="text" placeholder="username@upi" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-primary-500 text-slate-900 dark:text-white font-medium" />
                          </>
                        ) : (
                          <>
                            <p className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center"><CreditCard size={16} className="mr-1.5 text-slate-400" /> Card Details</p>
                            <input type="text" placeholder="4242 4242 4242 4242" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-primary-500 text-slate-900 dark:text-white font-medium tracking-widest mb-3" />
                            <div className="flex space-x-3">
                               <input type="text" placeholder="MM/YY" className="w-1/2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-primary-500 text-slate-900 dark:text-white font-medium tracking-widest" />
                               <input type="password" placeholder="CVV" maxLength={3} className="w-1/2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-primary-500 text-slate-900 dark:text-white font-medium tracking-widest" />
                            </div>
                          </>
                        )}
                     </div>

                  </div>

                  {/* Pay Footer */}
                  <div className="p-6 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
                     <button 
                       onClick={handlePayClick} 
                       disabled={bookingStatus === 'processing'}
                       className="w-full bg-primary-500 hover:bg-primary-600 text-white py-4 rounded-xl font-black text-lg active:scale-95 transition-all shadow-xl shadow-primary-500/20 disabled:opacity-80 disabled:cursor-not-allowed flex items-center justify-center"
                     >
                       {bookingStatus === 'processing' ? (
                          <><Loader2 className="animate-spin mr-2" size={24}/> Processing Securely...</>
                       ) : (
                          `Pay ₹${totalPrice}`
                       )}
                     </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
