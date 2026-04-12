import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Utensils, Star, Clock, MapPin, Search, ChevronLeft, ShoppingBag, Plus, Minus, CheckCircle, Smartphone, CreditCard, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { addItem, decrementItem, setDeliveryMode, clearCart } from '../../../store/cartSlice';
import type { RootState } from '../../../store/store';

// Mock Data
const STALLS = [
  { id: 1, name: 'Stadium Grill', category: 'Fast Food', famousItem: 'Burger', queue: 5, rating: 4.8, distance: '120m away', tag: 'Fastest', image: 'https://placehold.co/800x400/0ea5e9/ffffff?text=Stadium+Grill&font=Montserrat' },
  { id: 2, name: 'Vegan Bowl Co.', category: 'Healthy Diet', famousItem: 'Tofu Quinoa', queue: 12, rating: 4.5, distance: '200m away', tag: 'Trending', image: 'https://dummyimage.com/800x400/10b981/ffffff?text=Vegan+Bowl' },
  { id: 3, name: 'Pizza Corner', category: 'Italian', famousItem: 'Pizza', queue: 25, rating: 4.2, distance: '50m away', tag: 'Busy', image: 'https://dummyimage.com/800x400/f59e0b/ffffff?text=Pizza+Corner' },
  { id: 4, name: 'Cinematic Snacks', category: 'Snacks', famousItem: 'Popcorn & Coke', queue: 3, rating: 4.9, distance: '30m away', tag: 'Quick', image: 'https://dummyimage.com/800x400/0f172a/ffffff?text=Cinematic+Snacks' },
  { id: 5, name: 'Taco Fiesta', category: 'Mexican', famousItem: 'Spicy Nachos', queue: 8, rating: 4.6, distance: '150m away', tag: 'Hot', image: 'https://dummyimage.com/800x400/ef4444/ffffff?text=Taco+Fiesta' },
  { id: 6, name: 'Tandoori Tales', category: 'Indian', famousItem: 'Chicken Biryani', queue: 15, rating: 4.7, distance: '80m away', tag: 'Spicy', image: 'https://placehold.co/800x400/8b5cf6/ffffff?text=Tandoori+Tales&font=Montserrat' },
  { id: 7, name: 'Gourmet Brew', category: 'Cafe', famousItem: 'Cold Coffee', queue: 4, rating: 4.9, distance: '100m away', tag: 'Fresh', image: 'https://placehold.co/800x400/64748b/ffffff?text=Gourmet+Brew&font=Montserrat' },
  { id: 8, name: 'Sweet Tooth', category: 'Desserts', famousItem: 'Chocolate Muffin', queue: 2, rating: 4.6, distance: '40m away', tag: 'Sweet', image: 'https://placehold.co/800x400/ec4899/ffffff?text=Sweet+Tooth&font=Montserrat' },
];

const MENU_ITEMS = {
  1: [
    { id: 'm1', name: 'Classic Smash Burger', price: 250, available: 42, desc: 'Double patty of fresh beef with secret sauce', bestSeller: true },
    { id: 'm2', name: 'Crispy Fries', price: 100, available: 100, desc: 'Golden and salted to perfection', bestSeller: false },
    { id: 'm3', name: 'Cola Large', price: 80, available: 50, desc: 'Chilled soft drink', bestSeller: false },
    { id: 'm4', name: 'Onion Rings', price: 120, available: 30, desc: 'Beer battered rings', bestSeller: false },
  ],
  2: [
    { id: 'v1', name: 'Spicy Tofu Quinoa', price: 350, available: 15, desc: 'Organic bowl with spicy lime dressing', bestSeller: true },
    { id: 'v2', name: 'Green Detox Smoothie', price: 200, available: 30, desc: 'Spinach, apple, ginger', bestSeller: true },
    { id: 'v3', name: 'Avocado Toast', price: 280, available: 20, desc: 'Mashed avocado on sourdough', bestSeller: false },
  ],
  3: [
    { id: 'p1', name: 'Margherita Slice', price: 150, available: 8, desc: 'Fresh mozzarella and basil', bestSeller: true },
    { id: 'p2', name: 'Pepperoni Slice', price: 180, available: 5, desc: 'Spicy pepperoni cups', bestSeller: false },
    { id: 'p3', name: 'Garlic Knots', price: 100, available: 40, desc: 'Cheesy garlic bread knots', bestSeller: true },
  ],
  4: [
    { id: 's1', name: 'Jumbo Popcorn Bucket', price: 200, available: 150, desc: 'Buttered and salted perfectly', bestSeller: true },
    { id: 's2', name: 'Coke (Large)', price: 100, available: 500, desc: 'Ice cold carbonated drink', bestSeller: true },
    { id: 's3', name: 'Caramel Popcorn', price: 250, available: 40, desc: 'Sweet cinematic treat', bestSeller: false },
  ],
  5: [
    { id: 't1', name: 'Loaded Beef Nachos', price: 300, available: 20, desc: 'Jalapenos, cheese, salsa, guacamole', bestSeller: true },
    { id: 't2', name: 'Chicken Taco Duo', price: 250, available: 40, desc: 'Soft shell tacos', bestSeller: false },
    { id: 't3', name: 'Churros', price: 150, available: 50, desc: 'Cinnamon sugar churros', bestSeller: false },
  ],
  6: [
    { id: 'i1', name: 'Chicken Biryani', price: 450, available: 120, desc: 'Authentic basmati rice with chicken', bestSeller: true },
    { id: 'i2', name: 'Paneer Tikka', price: 300, available: 50, desc: 'Grilled cottage cheese', bestSeller: false },
    { id: 'i3', name: 'Garlic Naan', price: 60, available: 200, desc: 'Soft bread with garlic butter', bestSeller: false },
  ],
  7: [
    { id: 'c1', name: 'Cold Coffee', price: 250, available: 80, desc: 'Iced blended coffee with cream', bestSeller: true },
    { id: 'c2', name: 'Espresso', price: 150, available: 150, desc: 'Strong black coffee', bestSeller: false },
    { id: 'c3', name: 'Blueberry Croissant', price: 180, available: 30, desc: 'Freshly baked', bestSeller: false },
  ],
  8: [
    { id: 'd1', name: 'Chocolate Muffin', price: 120, available: 60, desc: 'Double chocolate chip', bestSeller: true },
    { id: 'd2', name: 'Vanilla Ice Cream', price: 100, available: 200, desc: 'Two scoops with chocolate syrup', bestSeller: false },
  ]
};

export default function Food() {
  const dispatch = useDispatch();
  const globalCart = useSelector((state: RootState) => state.cart.items);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStall, setSelectedStall] = useState<typeof STALLS[0] | null>(null);
  const [showGlobalCheckout, setShowGlobalCheckout] = useState(false);
  const [showSwiggyCheckout, setShowSwiggyCheckout] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaProblem] = useState({ a: Math.floor(Math.random() * 10) + 1, b: Math.floor(Math.random() * 10) + 1 });
  const [captchaError, setCaptchaError] = useState(false);
  
  const [orderComplete, setOrderComplete] = useState(false);
  const [checkoutDeliveryMode] = useState<'pickup'|'seat'>('pickup');
  const [paymentMethod, setPaymentMethod] = useState<'upi'|'card'>('upi');
  const [bookingStatus, setBookingStatus] = useState<'idle'|'processing'|'success'>('idle');

  const globalCartTotal = globalCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Filter stalls
  const filteredStalls = useMemo(() => {
    if (!searchQuery) return STALLS;
    return STALLS.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.famousItem.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleOpenStall = (stall: typeof STALLS[0]) => {
    setSelectedStall(stall);
    setOrderComplete(false);
  };

  const handleAddToCart = (item: any, size: 'S'|'M'|'L' = 'M') => {
    let sizeMultiplier = size === 'L' ? 1.4 : size === 'S' ? 0.7 : 1;
    const finalItemId = size !== 'M' ? `${item.id}-${size}` : item.id;
    const finalName = size !== 'M' ? `${item.name} (${size})` : item.name;
    const finalPrice = Math.round(item.price * sizeMultiplier);
    
    dispatch(addItem({ id: finalItemId, name: finalName, price: finalPrice, quantity: 1, stallName: selectedStall!.name }));
  };

  const handleRemoveFromCart = (itemId: string, size: 'S'|'M'|'L' = 'M') => {
    const finalItemId = size !== 'M' ? `${itemId}-${size}` : itemId;
    dispatch(decrementItem(finalItemId));
  };

  const getQuantity = (id: string) => {
    return globalCart.filter(i => i.id === id || i.id.startsWith(`${id}-`)).reduce((acc, curr) => acc + curr.quantity, 0);
  };

  const verifyCaptchaAndProceed = () => {
    if (parseInt(captchaAnswer) === captchaProblem.a + captchaProblem.b) {
      setShowCaptcha(false);
      setCaptchaError(false);
      setShowSwiggyCheckout(true);
    } else {
      setCaptchaError(true);
    }
  };

  const processSwiggyPayment = () => {
     setBookingStatus('processing');
     setTimeout(() => {
         setShowSwiggyCheckout(false);
         setShowGlobalCheckout(false);
         dispatch(setDeliveryMode(checkoutDeliveryMode));
         setBookingStatus('success');
         setOrderComplete(true);
         dispatch(clearCart());
         setTimeout(() => {
           setSelectedStall(null);
         }, 4000);
     }, 2500);
  };


  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 transition-colors relative">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg px-6 pt-6 pb-4 border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-10 transition-colors">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Food Near Me</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Order ahead and skip the lines.</p>
        
        <div className="mt-4 flex items-center space-x-2 bg-slate-100 dark:bg-slate-800/50 rounded-2xl px-4 py-3 border border-transparent focus-within:border-primary-500/50 transition-colors">
          <Search size={18} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search popcorn, coke, burgers..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-sm font-medium dark:text-white placeholder-slate-400"
          />
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {filteredStalls.length === 0 ? (
           <div className="text-center py-20 text-slate-500 dark:text-slate-400 font-medium">No food stalls found for "{searchQuery}".</div>
        ) : (
          filteredStalls.map((stall, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              key={stall.id} 
              onClick={() => handleOpenStall(stall)}
              className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col relative overflow-hidden cursor-pointer group hover:shadow-md hover:border-primary-200 dark:hover:border-primary-500/30 transition-all active:scale-[0.98]"
            >
              <div className="flex space-x-4">
                <div className="w-24 h-24 rounded-2xl overflow-hidden relative shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-500 shadow-inner" style={{ background: `linear-gradient(135deg, hsl(${stall.id * 55}, 80%, 55%), hsl(${stall.id * 55 + 30}, 80%, 40%))` }}>
                  <Utensils size={36} className="text-white/40 absolute drop-shadow-md" />
                  <div className="absolute top-1 right-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-1.5 py-0.5 rounded-lg flex items-center shadow-sm">
                    <Star size={10} className="text-amber-400 fill-amber-400 mr-1" />
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200">{stall.rating}</span>
                  </div>
                </div>
                
                <div className="flex-1 py-1">
                   <div className="flex justify-between items-start">
                     <h3 className="font-extrabold text-lg text-slate-900 dark:text-white leading-tight">{stall.name}</h3>
                   </div>
                   <p className="text-xs font-semibold text-slate-400 mb-2">{stall.category}</p>
                   <p className="text-xs font-medium text-slate-600 dark:text-slate-400 line-clamp-1">{stall.famousItem}</p>
                   
                   <div className="flex items-center space-x-3 mt-3 text-xs font-semibold">
                     <span className={clsx("flex items-center bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md", stall.queue > 20 ? 'text-red-500' : stall.queue > 10 ? 'text-amber-500' : 'text-green-500')}>
                       <Clock size={12} className="mr-1" /> {stall.queue} min
                     </span>
                     <span className="flex items-center text-slate-500 dark:text-slate-400">
                       <MapPin size={12} className="mr-1" /> {stall.distance}
                     </span>
                   </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Global Bottom Cart Banner (Floats Globally) */}
      <AnimatePresence>
        {globalCart.length > 0 && !showGlobalCheckout && !showCaptcha && !showSwiggyCheckout && !orderComplete && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-0 left-0 right-0 p-4 bg-transparent z-[200]">
            <div className="bg-primary-600 dark:bg-primary-500 text-white p-4 rounded-2xl shadow-2xl flex justify-between items-center pointer-events-auto cursor-pointer active:scale-[0.98] transition-transform w-full md:max-w-md md:mx-auto" onClick={() => setShowGlobalCheckout(true)}>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary-200 mb-0.5">{globalCart.length} Item{globalCart.length > 1 ? 's' : ''} mixed</p>
                <p className="font-extrabold text-lg flex items-center">₹{globalCartTotal} <span className="text-primary-300 text-xs ml-2 font-medium">plus taxes</span></p>
              </div>
              <div className="flex items-center space-x-2 font-bold text-sm bg-white text-primary-600 px-4 py-2 rounded-xl">
                <span>View Cart</span> <ShoppingBag size={16} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Swiggy Checkout Overlay */}
      <AnimatePresence>
        {showGlobalCheckout && (
           <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="fixed inset-0 bg-white dark:bg-slate-950 z-[110] flex flex-col md:max-w-md md:mx-auto md:shadow-2xl">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center bg-white dark:bg-slate-950 z-20">
                <button onClick={() => setShowGlobalCheckout(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500">
                  <X size={20} />
                </button>
                <h2 className="ml-4 font-bold dark:text-white text-lg">Global Cart</h2>
              </div>
              
              <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900/50 p-6 space-y-6">
                 <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                   <h3 className="font-bold text-sm tracking-widest uppercase text-slate-500 mb-4">Your Unified Order</h3>
                   {globalCart.map((item, i) => (
                     <div key={`${item.id}-${i}`} className="flex justify-between items-center mb-3 text-sm text-slate-800 dark:text-slate-200">
                       <span className="flex items-center">
                         <span className="border border-slate-200 dark:border-slate-700 w-5 h-5 flex items-center justify-center rounded text-xs text-slate-500 mr-2">{item.quantity}</span> 
                         {item.name}
                       </span>
                       <span className="font-medium">₹{item.price * item.quantity}</span>
                     </div>
                   ))}
                 </div>

                 <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-3 text-sm text-slate-600 dark:text-slate-400">
                   <div className="flex justify-between">
                     <span>Item Total</span>
                     <span className="font-medium text-slate-900 dark:text-white">₹{globalCartTotal}</span>
                   </div>
                   <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between font-extrabold text-lg text-slate-900 dark:text-white">
                     <span>To Pay</span>
                     <span>₹{globalCartTotal}</span>
                   </div>
                 </div>
              </div>

              <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex space-x-4">
                 <button onClick={() => { setShowGlobalCheckout(false); setShowCaptcha(true); }} className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white text-lg rounded-xl font-extrabold active:scale-95 transition-transform shadow-xl shadow-primary-500/20">
                   Proceed to Pay ₹{globalCartTotal}
                 </button>
              </div>
           </motion.div>
        )}
      </AnimatePresence>

      {/* Swiggy-Style Detail Modal */}
      <AnimatePresence>
        {selectedStall && (
          <motion.div 
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white dark:bg-slate-950 z-[100] flex flex-col overflow-hidden"
          >
            {/* Header Image Area */}
            <div className="relative h-64 shrink-0 flex items-center justify-center overflow-hidden" style={{ background: `linear-gradient(135deg, hsl(${selectedStall.id * 55}, 80%, 55%), hsl(${selectedStall.id * 55 + 30}, 80%, 40%))` }}>
               <Utensils size={120} className="text-white/20 absolute -rotate-12 scale-150" />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
               <button onClick={() => setSelectedStall(null)} className="absolute top-6 left-6 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors">
                 <ChevronLeft size={24} />
               </button>
               <div className="absolute bottom-6 left-6 right-6 text-white">
                 <h2 className="text-3xl font-extrabold shadow-sm">{selectedStall.name}</h2>
                 <p className="text-sm font-medium opacity-90 mt-1">{selectedStall.category} • {selectedStall.distance}</p>
                 <div className="flex items-center space-x-3 mt-3 text-sm font-bold">
                   <div className="flex items-center bg-white/20 backdrop-blur-md px-3 py-1 rounded-full"><Star size={14} className="text-amber-400 fill-amber-400 mr-1.5" /> {selectedStall.rating}</div>
                   <div className="flex items-center bg-white/20 backdrop-blur-md px-3 py-1 rounded-full"><Clock size={14} className="mr-1.5" /> {selectedStall.queue} m wait</div>
                 </div>
               </div>
            </div>

            {/* Menu Area */}
            <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-6 relative">
               <h3 className="font-extrabold text-slate-900 dark:text-white text-xl mb-4 flex items-center">
                 <Utensils className="mr-2 text-primary-500" size={20} /> Recommended
               </h3>
               
               <div className="space-y-6">
                 {/*@ts-ignore */}
                  {MENU_ITEMS[selectedStall.id]?.map((item) => {
                    const qty = getQuantity(item.id);
                    return (
                      <div key={item.id} className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-6 last:border-0">
                        <div className="flex-1 pr-4">
                          {item.bestSeller && <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 flex items-center mb-1"><Star size={10} className="fill-amber-500 mr-1" /> Best Seller</span>}
                          <h4 className="font-bold text-slate-900 dark:text-white text-base">{item.name}</h4>
                          <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm mt-1">₹{item.price}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{item.desc}</p>
                          <p className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 inline-block px-2 py-0.5 rounded mt-2">
                             {item.available} available
                          </p>
                        </div>
                        <div className="relative pt-4">
                           {qty === 0 ? (
                             <div className="flex flex-col items-end space-y-2">
                               <div className="flex bg-slate-200 dark:bg-slate-700/50 rounded-lg p-1">
                                 <button onClick={() => handleAddToCart(item, 'S')} className="px-2 text-xs font-bold rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm mx-0.5 hover:bg-slate-300 transition-colors">S</button>
                                 <button onClick={() => handleAddToCart(item, 'M')} className="px-2 text-xs font-bold rounded bg-primary-500 text-white shadow-sm mx-0.5 px-3 py-1">M</button>
                                 <button onClick={() => handleAddToCart(item, 'L')} className="px-2 text-xs font-bold rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm mx-0.5 hover:bg-slate-300 transition-colors">L</button>
                               </div>
                             </div>
                           ) : (
                             <div className="flex items-center space-x-3 bg-primary-50 dark:bg-primary-900/20 px-3 py-1.5 rounded-xl border border-primary-200 dark:border-primary-800 mt-2">
                               <button onClick={() => handleRemoveFromCart(item.id)} className="text-primary-600 dark:text-primary-400"><Minus size={16} /></button>
                               <span className="font-bold text-primary-700 dark:text-primary-300">{qty}</span>
                               <button onClick={() => handleAddToCart(item, 'M')} className="text-primary-600 dark:text-primary-400"><Plus size={16} /></button>
                             </div>
                           )}
                        </div>
                      </div>
                    )
                  })}
               </div>
               {/* Spacer for cart */}
               <div className="h-24" />
            </div>



            {/* CAPTCHA Modal Overlay */}
            <AnimatePresence>
              {showCaptcha && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[115] flex items-center justify-center p-6">
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-200 dark:border-slate-800 text-center">
                    <h2 className="text-xl font-extrabold mb-2">Human Verification</h2>
                    <p className="text-sm text-slate-500 mb-6 font-medium">Please solve this quick problem to verify your purchase intention.</p>

                    <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 mb-6 inline-block w-full border border-slate-100 dark:border-slate-700">
                       <span className="text-4xl font-black tracking-widest block mb-4">{captchaProblem.a} + {captchaProblem.b} = ?</span>
                       <input 
                         type="number" 
                         value={captchaAnswer} 
                         onChange={(e) => setCaptchaAnswer(e.target.value)} 
                         placeholder="Answer"
                         className="w-full text-center text-xl font-bold bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl py-3 outline-none focus:border-primary-500"
                       />
                       {captchaError && <p className="text-red-500 text-xs font-bold mt-2">Incorrect answer. Please try again.</p>}
                    </div>

                    <div className="flex space-x-3">
                       <button onClick={() => setShowCaptcha(false)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 font-bold rounded-xl text-slate-700 dark:text-slate-300">Cancel</button>
                       <button onClick={verifyCaptchaAndProceed} disabled={!captchaAnswer} className="flex-1 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 font-bold rounded-xl text-white shadow-md active:scale-95">Verify & Pay</button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Swiggy-Style Secure Payment Overlay */}
            <AnimatePresence>
              {showSwiggyCheckout && (
                <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="absolute inset-0 bg-white dark:bg-slate-950 z-[120] flex flex-col">
                  
                  {/* Header */}
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center bg-white dark:bg-slate-950 sticky top-0 z-20">
                     <button onClick={() => setShowSwiggyCheckout(false)} disabled={bookingStatus === 'processing'} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 active:scale-95 disabled:opacity-50">
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
                        <span className="text-2xl font-black text-slate-900 dark:text-white">₹{globalCartTotal + (checkoutDeliveryMode === 'seat' ? 50 : 0) + Math.round(globalCartTotal * 0.05)}</span>
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
                       onClick={processSwiggyPayment} 
                       disabled={bookingStatus === 'processing'}
                       className="w-full bg-primary-500 hover:bg-primary-600 text-white py-4 rounded-xl font-black text-lg active:scale-95 transition-all shadow-xl shadow-primary-500/20 disabled:opacity-80 disabled:cursor-not-allowed flex items-center justify-center"
                     >
                       {bookingStatus === 'processing' ? (
                          <><Loader2 className="animate-spin mr-2" size={24}/> Processing Securely...</>
                       ) : (
                          `Pay ₹${globalCartTotal + (checkoutDeliveryMode === 'seat' ? 50 : 0) + Math.round(globalCartTotal * 0.05)}`
                       )}
                     </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Overlay */}
            <AnimatePresence>
              {orderComplete && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-white dark:bg-slate-950 z-[120] flex flex-col items-center justify-center p-8 text-center text-slate-900 dark:text-white">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
                    <CheckCircle size={80} className="text-green-500 mb-2 mx-auto" />
                  </motion.div>
                  <h2 className="text-3xl font-extrabold mb-1">Payment Successful!</h2>
                  <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm">Paid with Google Pay securely.</p>
                  
                  <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm w-full mb-8">
                    <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-2">Transaction ID</p>
                    <p className="font-mono font-medium opacity-80 mb-6">TXN-9{Math.floor(Math.random() * 10000)}B-OK</p>
                    <p className="text-sm font-semibold opacity-90">
                      {checkoutDeliveryMode === 'seat' 
                        ? "Your food is being prepared and will be delivered to your seat in approximately 12 mins."
                        : "Your food is being prepared. We will notify you when it's ready for pickup."}
                    </p>
                  </div>

                  <div className="animate-pulse flex items-center text-sm font-bold text-primary-500">
                    Routing you back...
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
