import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../store/userSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { Hexagon, Mail, Lock, User, Cloud } from 'lucide-react';
import { storageService } from '../../services/storageService';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [cloudSyncing, setCloudSyncing] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (isSignUp && !name)) return;
    performLogin(name || email.split('@')[0], 'email');
  };

  const handleGoogleClick = () => {
    setShowGoogleModal(true);
  };

  const handleGoogleAccountSelect = (userName: string) => {
    setShowGoogleModal(false);
    performLogin(userName, 'google');
  };

  const performLogin = async (userName: string, method: 'email' | 'google') => {
    setIsLoading(true);
    
    // Simulate Cloud Storage sync for Google login
    if (method === 'google') {
      setCloudSyncing(true);
      const googleId = `google_${userName.toLowerCase().replace(/\s+/g, '_')}`;
      await storageService.initializeBucket(googleId);
      await new Promise(r => setTimeout(r, 1000));
      setCloudSyncing(false);
    }

    setTimeout(() => {
      dispatch(login({
        name: userName,
        avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${userName}`,
        favoriteTeam: 'Home Team',
        diet: 'None',
        followingIds: []
      }));
      navigate('/', { replace: true });
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-500">
      
      {/* Super-Model Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary-500/20 dark:bg-primary-600/30 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/20 dark:bg-purple-600/30 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-sm px-8 py-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-[40px] shadow-2xl relative z-10 mx-4"
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-16 h-16 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30 mb-6"
          >
            <Hexagon size={32} className="text-white fill-white/20" />
          </motion.div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2 text-center">
            {isSignUp ? "Create an Account" : "Welcome Back"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center font-medium">
            {isSignUp ? "Join the premium stadium experience." : "Sign in to access your dashboard."}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4 mb-6">
          <AnimatePresence>
            {isSignUp && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex items-center bg-slate-100 dark:bg-slate-800/50 rounded-xl px-4 py-3 border border-transparent focus-within:border-primary-500/50 transition-colors">
                  <User size={18} className="text-slate-400 mr-3" />
                  <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required={isSignUp} className="bg-transparent border-none outline-none w-full text-sm text-slate-900 dark:text-white placeholder-slate-400" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800/50 rounded-xl px-4 py-3 border border-transparent focus-within:border-primary-500/50 transition-colors">
            <Mail size={18} className="text-slate-400 mr-3" />
            <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-transparent border-none outline-none w-full text-sm text-slate-900 dark:text-white placeholder-slate-400" />
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800/50 rounded-xl px-4 py-3 border border-transparent focus-within:border-primary-500/50 transition-colors">
            <Lock size={18} className="text-slate-400 mr-3" />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-transparent border-none outline-none w-full text-sm text-slate-900 dark:text-white placeholder-slate-400" />
          </div>

          <button 
            type="submit"
            disabled={isLoading || !email || !password || (isSignUp && !name)}
            className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-bold transition-all active:scale-95 shadow-md shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">OR</span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
        </div>

        <button 
          type="button"
          onClick={handleGoogleClick}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-white px-6 py-3.5 rounded-xl font-semibold shadow-sm transition-all hover:shadow-md active:scale-95 disabled:opacity-50 group relative overflow-hidden"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.8 15.71 17.58V20.34H19.28C21.36 18.42 22.56 15.58 22.56 12.25Z" fill="#4285F4"/>
            <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.58C14.73 18.24 13.47 18.66 12 18.66C9.16 18.66 6.75 16.74 5.86 14.16H2.18V17C4.01 20.64 7.69 23 12 23Z" fill="#34A853"/>
            <path d="M5.86 14.16C5.63 13.48 5.5 12.76 5.5 12C5.5 11.24 5.63 10.52 5.86 9.84V6.99H2.18C1.43 8.49 1 10.19 1 12C1 13.81 1.43 15.51 2.18 17L5.86 14.16Z" fill="#FBBC05"/>
            <path d="M12 5.34C13.62 5.34 15.06 5.89 16.2 6.98L19.35 3.83C17.45 2.06 14.96 1 12 1C7.69 1 4.01 3.36 2.18 6.99L5.86 9.84C6.75 7.26 9.16 5.34 12 5.34Z" fill="#EA4335"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="flex justify-center mt-6">
          <button 
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs font-bold text-slate-500 hover:text-primary-500 transition-colors uppercase tracking-widest"
          >
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </button>
        </div>

        <AnimatePresence>
          {cloudSyncing && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-[50] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-[40px] flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="relative mb-6">
                <Cloud size={48} className="text-primary-500 animate-pulse" />
                <motion.div 
                  animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-2 border-t-primary-500 border-r-transparent border-b-transparent border-l-transparent rounded-full"
                />
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-white mb-2">Syncing Cloud Bucket</h3>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Attaching your secure stadium storage via Google Cloud...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Realistic Google Mock Modal */}
      <AnimatePresence>
        {showGoogleModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden"
            >
              <div className="p-6 pb-4 border-b border-gray-100 flex items-center justify-center relative">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="absolute left-6"><path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.8 15.71 17.58V20.34H19.28C21.36 18.42 22.56 15.58 22.56 12.25Z" fill="#4285F4"/><path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.58C14.73 18.24 13.47 18.66 12 18.66C9.16 18.66 6.75 16.74 5.86 14.16H2.18V17C4.01 20.64 7.69 23 12 23Z" fill="#34A853"/><path d="M5.86 14.16C5.63 13.48 5.5 12.76 5.5 12C5.5 11.24 5.63 10.52 5.86 9.84V6.99H2.18C1.43 8.49 1 10.19 1 12C1 13.81 1.43 15.51 2.18 17L5.86 14.16Z" fill="#FBBC05"/><path d="M12 5.34C13.62 5.34 15.06 5.89 16.2 6.98L19.35 3.83C17.45 2.06 14.96 1 12 1C7.69 1 4.01 3.36 2.18 6.99L5.86 9.84C6.75 7.26 9.16 5.34 12 5.34Z" fill="#EA4335"/></svg>
                 <span className="font-medium text-gray-800">Sign in with Google</span>
              </div>
              <div className="p-4 bg-slate-50 text-center border-b border-gray-100">
                 <p className="text-sm font-medium text-gray-700">Choose an account</p>
                 <p className="text-xs text-gray-500 mt-1">to continue to SmartStadium</p>
              </div>
              <div className="py-2">
                 {[
                   { name: 'Alex Johnson', email: 'alex.johnson22@gmail.com', img: 'https://api.dicebear.com/7.x/notionists/svg?seed=Alex' },
                   { name: 'Developer Account', email: 'dev.test@company.com', img: 'https://api.dicebear.com/7.x/notionists/svg?seed=Dev' },
                 ].map(acc => (
                   <div 
                     key={acc.email}
                     onClick={() => handleGoogleAccountSelect(acc.name)}
                     className="flex items-center px-6 py-3 hover:bg-slate-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                   >
                     <img src={acc.img} className="w-10 h-10 rounded-full bg-slate-200 border border-slate-300" alt={acc.name} />
                     <div className="ml-4 text-left">
                        <p className="font-semibold text-gray-900 text-sm">{acc.name}</p>
                        <p className="text-xs text-gray-500">{acc.email}</p>
                     </div>
                   </div>
                 ))}
                 <div onClick={() => setShowGoogleModal(false)} className="flex items-center px-6 py-3 hover:bg-slate-50 cursor-pointer transition-colors">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 bg-slate-100"><User size={20} /></div>
                    <span className="ml-4 font-medium text-gray-700 text-sm">Use another account</span>
                 </div>
              </div>
              <div className="p-4 bg-slate-50 border-t border-gray-100 text-right">
                <button onClick={() => setShowGoogleModal(false)} className="text-sm font-medium text-primary-600 hover:text-primary-700 uppercase tracking-wider px-2 py-1">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
