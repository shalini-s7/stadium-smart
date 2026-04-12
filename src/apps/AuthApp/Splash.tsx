import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronRight, Activity } from 'lucide-react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

const SLIDES = [
  {
    hero: 'https://placehold.co/800x1200/0f172a/ffffff?text=Experience+The+Match&font=Montserrat',
    title: 'Experience The Match.',
    subtitle: 'Book premium stadium seats right from your phone before they sell out.'
  },
  {
    hero: 'https://placehold.co/800x1200/0f172a/0ea5e9?text=Skip+The+Queues&font=Montserrat',
    title: 'Skip the Queues.',
    subtitle: 'Pre-order food from elite stadium stalls and have it delivered to your seat.'
  },
  {
    hero: 'https://placehold.co/800x1200/0f172a/10b981?text=Navigate+Smarter&font=Montserrat',
    title: 'Navigate Smarter.',
    subtitle: 'Live AI-generated heatmaps keep you away from crowded areas safely.'
  }
];

export default function Splash() {
  const navigate = useNavigate();
  const [slideStatus, setSlideStatus] = useState<'animating'|'ready'>('animating');
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setSlideStatus('ready'), 2000);
    return () => clearTimeout(t);
  }, []);

  const nextSlide = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(s => s + 1);
    } else {
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 overflow-hidden relative">
      
      {/* Intro Geometric Animation Overlay (Only plays once) */}
      <AnimatePresence>
        {slideStatus === 'animating' && (
          <motion.div 
            initial={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950"
          >
            <div className="relative w-32 h-32 flex items-center justify-center">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 rounded-full border-4 border-slate-800 border-t-primary-500" />
              <Activity className="text-white w-12 h-12 animate-pulse" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col relative z-20">
         {/* Carousel Image Backgrounds */}
         <div className="flex-1 relative overflow-hidden">
            <AnimatePresence initial={false}>
              <motion.img
                key={currentSlide}
                src={SLIDES[currentSlide].hero}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
         </div>

         {/* Text and Controls */}
         <div className="pb-16 px-8 pt-8 flex flex-col relative z-20 h-[40vh] bg-slate-950">
            {/* Dots */}
            <div className="flex space-x-2 mb-8">
               {SLIDES.map((_, idx) => (
                 <div key={idx} className={clsx("h-1.5 rounded-full transition-all duration-300", currentSlide === idx ? "w-8 bg-white" : "w-1.5 bg-slate-700")} />
               ))}
            </div>

            <motion.div
              key={currentSlide + 'text'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl font-black text-white mb-3 tracking-tight">{SLIDES[currentSlide].title}</h1>
              <p className="text-slate-400 font-medium leading-relaxed">{SLIDES[currentSlide].subtitle}</p>
            </motion.div>

            <div className="mt-auto flex justify-between items-center">
               <button onClick={() => navigate('/login', { replace: true })} className="text-sm font-bold text-slate-500 uppercase tracking-widest active:scale-95">Skip</button>
               <button onClick={nextSlide} className="flex items-center space-x-2 bg-white text-slate-950 px-6 py-4 rounded-2xl font-black active:scale-95 transition-transform hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                 <span>{currentSlide === SLIDES.length - 1 ? "Get Started" : "Next"}</span>
                 {currentSlide === SLIDES.length - 1 ? <ArrowRight size={20} /> : <ChevronRight size={20} />}
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
