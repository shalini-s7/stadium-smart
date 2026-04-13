import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, MessageCircle, Heart, Share2, Plus, 
  MapPin, Calendar, CheckCircle2, Search,
  Send, X, Image as ImageIcon, Sparkles, Trophy,
  ChevronLeft, Info
} from 'lucide-react';
import type { RootState } from '../../../store/store';
import { addPost, likePost } from '../../../store/networkSlice';
import type { NetworkPost } from '../../../store/networkSlice';
import { followUser, unfollowUser } from '../../../store/userSlice';
import clsx from 'clsx';

export default function Network() {
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.user.profile);
  const { posts, legends } = useSelector((state: RootState) => state.network);
  const followingIds = profile?.followingIds || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'feed' | 'mentors'>('feed');
  const [showPostModal, setShowPostModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  
  // Interactive UI state
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [showDM, setShowDM] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    if (!searchQuery) return posts;
    return posts.filter(p => 
      p.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [posts, searchQuery]);

  const handleLike = (postId: string) => {
    if (!likedPosts.includes(postId)) {
      setLikedPosts([...likedPosts, postId]);
      dispatch(likePost(postId));
    }
  };

  const handleFollow = (legendId: string) => {
    if (followingIds.includes(legendId)) {
      dispatch(unfollowUser(legendId));
    } else {
      dispatch(followUser(legendId));
    }
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;
    
    const newPost: NetworkPost = {
      id: `p-${Date.now()}`,
      userName: profile?.name || 'Super Fan',
      userAvatar: profile?.avatar || 'https://api.dicebear.com/7.x/notionists/svg?seed=Fan',
      content: newPostContent,
      timestamp: Date.now(),
      likes: 0,
      comments: 0
    };

    dispatch(addPost(newPost));
    setNewPostContent('');
    setShowPostModal(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 transition-colors">
      {/* Premium Sticky Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-6 pt-6 pb-4 border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center tracking-tight">
            Network <Users className="ml-2 text-primary-500" size={24} />
          </h1>
          <button 
            onClick={() => setShowPostModal(true)}
            className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-lg shadow-primary-500/30 active:scale-90 transition-transform"
          >
            <Plus size={24} />
          </button>
        </div>

        <div className="flex items-center space-x-1 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 mb-4 font-bold text-sm">
          <button 
            onClick={() => setActiveTab('feed')}
            className={clsx("flex-1 py-2.5 rounded-xl transition-all", activeTab === 'feed' ? "bg-white dark:bg-slate-700 text-primary-500 shadow-sm" : "text-slate-500")}
          >
            Community
          </button>
          <button 
            onClick={() => setActiveTab('mentors')}
            className={clsx("flex-1 py-2.5 rounded-xl transition-all", activeTab === 'mentors' ? "bg-white dark:bg-slate-700 text-primary-500 shadow-sm" : "text-slate-500")}
          >
            Pro Mentors
          </button>
        </div>

        <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800/40 rounded-xl px-4 py-2 border border-transparent focus-within:border-primary-500/50 transition-colors">
          <Search size={16} className="text-slate-400" />
          <input 
            type="text" placeholder="Search people, posts, legends..." 
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-sm font-medium dark:text-white"
          />
        </div>
      </div>

      <div className="flex-1 p-4 space-y-6">
        {activeTab === 'feed' ? (
          <>
            {/* Story Bar: Sports Legends */}
            <div className="overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
              <div className="flex space-x-4">
                {legends.map(legend => (
                  <motion.div 
                    key={legend.id} 
                    className="flex flex-col items-center space-y-2 shrink-0 group cursor-pointer"
                    onClick={() => setShowDM(legend.id)}
                  >
                    <div className={clsx("w-16 h-16 rounded-3xl p-1 bg-gradient-to-tr transition-transform group-hover:scale-105", followingIds.includes(legend.id) ? "from-primary-500 via-purple-500 to-pink-500" : "from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800")}>
                      <div className="w-full h-full rounded-[1.2rem] bg-white dark:bg-slate-900 p-0.5">
                        <img src={legend.avatar} className="w-full h-full rounded-[1.1rem] object-cover" alt={legend.name} />
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300 w-16 text-center truncate">{legend.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Post Feed */}
            <div className="space-y-4">
              {filteredPosts.map((post, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  key={post.id}
                  className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-5 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden group"
                >
                  <div className="flex items-start space-x-3 mb-4">
                    <img src={post.userAvatar} className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800" alt={post.userName} />
                    <div className="flex-1">
                      <div className="flex items-center space-x-1">
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">{post.userName}</h3>
                        <CheckCircle2 size={12} className="text-primary-500" />
                        <span className="text-[10px] font-bold text-slate-400 block ml-auto">2h ago</span>
                      </div>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{post.userName === 'Virat K.' ? 'Sports Pro' : 'Stadium VIP'}</p>
                    </div>
                  </div>

                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed mb-4">
                    {post.content}
                  </p>

                  {post.image && (
                    <div className="rounded-3xl overflow-hidden mb-4 border border-slate-100 dark:border-slate-800 shadow-inner">
                      <img src={post.image} className="w-full h-auto object-cover max-h-64" alt="Post visual" />
                    </div>
                  )}

                  {post.eventCard && (
                    <div className="bg-primary-50 dark:bg-primary-950/30 rounded-2xl p-4 border border-primary-100 dark:border-primary-900/50 mb-4 flex justify-between items-center group/card cursor-pointer hover:bg-primary-100 transition-colors">
                      <div className="flex items-center space-x-3">
                         <div className="w-10 h-10 rounded-xl bg-primary-500 text-white flex items-center justify-center">
                            <Calendar size={18} />
                         </div>
                         <div>
                            <p className="text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest">Attended Event</p>
                            <h4 className="text-xs font-black text-slate-900 dark:text-white">{post.eventCard.title}</h4>
                         </div>
                      </div>
                      <ChevronRight size={16} className="text-primary-400 group-hover/card:translate-x-1 transition-transform" />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex space-x-6">
                      <button 
                        onClick={() => handleLike(post.id)}
                        className={clsx("flex items-center space-x-1.5 transition-all text-xs font-bold", likedPosts.includes(post.id) ? "text-pink-500" : "text-slate-500")}
                      >
                        <Heart size={18} className={likedPosts.includes(post.id) ? "fill-pink-500" : ""} /> <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1.5 text-slate-500 text-xs font-bold">
                        <MessageCircle size={18} /> <span>{post.comments}</span>
                      </button>
                    </div>
                    <button className="text-slate-500"><Share2 size={18} /></button>
                  </div>
                </motion.div>
              ))}

              {/* Special Mentorship Insert */}
              {followingIds.length > 0 && (
                <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[3rem] p-8 text-white shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 rounded-full blur-3xl" />
                   <h3 className="text-xl font-black mb-4 flex items-center"><Sparkles className="mr-2 text-amber-400" size={20} /> Legend’s Take</h3>
                   <div className="space-y-4">
                      {legends.filter(l => followingIds.includes(l.id)).slice(0, 1).map(legend => (
                        <div key={legend.id}>
                           <div className="flex items-center space-x-3 mb-3">
                              <img src={legend.avatar} className="w-8 h-8 rounded-full border border-white/20" alt={legend.name} />
                              <span className="font-bold text-sm text-primary-300">{legend.name} • {legend.role}</span>
                           </div>
                           <p className="text-base font-medium leading-relaxed italic text-slate-200">
                             "{legend.tips[Math.floor(Math.random() * legend.tips.length)]}"
                           </p>
                        </div>
                      ))}
                   </div>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Mentors Discovery View */
          <div className="grid grid-cols-1 gap-4 overflow-y-auto">
            {legends.map(legend => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                key={legend.id}
                className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-primary-500/10 via-purple-500/5 to-transparent" />
                
                <div className="relative mt-2">
                   <img src={legend.avatar} className="w-24 h-24 rounded-[2rem] border-4 border-white dark:border-slate-800 shadow-xl" alt={legend.name} />
                   {legend.verified && <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-1 shadow-md"><CheckCircle2 className="text-primary-500" size={20} /></div>}
                </div>

                <div className="mt-4 mb-6">
                   <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{legend.name}</h3>
                   <p className="text-sm font-bold text-primary-500 uppercase tracking-widest mt-1">{legend.role}</p>
                </div>

                <div className="w-full bg-slate-50 dark:bg-slate-800/40 rounded-3xl p-5 mb-6 text-left border border-slate-100 dark:border-slate-800">
                   <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center">
                     <Sparkles size={14} className="mr-2 text-amber-500" /> Pro Takes
                   </h4>
                   <div className="space-y-3">
                      {legend.tips.map((tip, i) => (
                         <div key={i} className="flex items-start space-x-3 group">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 shrink-0 group-hover:scale-150 transition-transform" />
                            <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed italic">"{tip}"</p>
                         </div>
                      ))}
                   </div>
                </div>

                <div className="flex space-x-3 w-full">
                   <button 
                     onClick={() => handleFollow(legend.id)}
                     className={clsx("flex-1 py-4 rounded-2xl font-black text-sm active:scale-95 transition-all shadow-md", followingIds.includes(legend.id) ? "bg-slate-100 dark:bg-slate-800 text-slate-600" : "bg-primary-500 text-white shadow-primary-500/20")}
                   >
                     {followingIds.includes(legend.id) ? "Following" : "Follow Pro"}
                   </button>
                   {followingIds.includes(legend.id) && (
                      <button onClick={() => setShowDM(legend.id)} className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-primary-500 active:scale-90 transition-transform shadow-sm">
                         <Send size={20} />
                      </button>
                   )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Post Modal Section */}
      <AnimatePresence>
        {showPostModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
            <motion.div 
               initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
               className="bg-white dark:bg-slate-900 rounded-[3rem] w-full max-w-sm shadow-2xl overflow-hidden flex flex-col"
            >
               <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <h2 className="font-extrabold text-lg text-slate-900 dark:text-white">New Momentum</h2>
                  <button onClick={() => setShowPostModal(false)} className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500"><X size={20} /></button>
               </div>
               <div className="p-6 flex-1">
                  <textarea 
                    autoFocus
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Share your stadium momentum..." 
                    className="w-full h-32 bg-transparent text-lg font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none resize-none"
                  />
                  <div className="flex items-center space-x-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                     <button className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 text-[10px] font-bold whitespace-nowrap"><MapPin size={14} className="text-red-500" /> <span>Gate A, South Box</span></button>
                     <button className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 text-[10px] font-bold whitespace-nowrap"><Trophy size={14} className="text-amber-500" /> <span>Final Match</span></button>
                  </div>
               </div>
               <div className="p-6 pt-0 flex items-center justify-between">
                  <button className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400"><ImageIcon size={24} /></button>
                  <button 
                    onClick={handleCreatePost}
                    disabled={!newPostContent.trim()}
                    className="bg-primary-500 disabled:opacity-50 text-white px-8 py-3 rounded-2xl font-black text-base shadow-lg shadow-primary-500/20 active:scale-95 transition-all flex items-center space-x-2"
                  >
                    <span>Post Now</span> <Send size={18} />
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mock DM Overlay */}
      <AnimatePresence>
         {showDM && (
           <div className="fixed inset-0 bg-white dark:bg-slate-950 z-[110] flex flex-col md:max-w-md md:mx-auto">
             <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center bg-white dark:bg-slate-950 sticky top-0 z-20">
               <button onClick={() => setShowDM(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500"><ChevronLeft size={24} /></button>
               <div className="ml-3 flex-1">
                  <h2 className="font-extrabold dark:text-white text-base">Direct Contact: {legends.find(l => l.id === showDM)?.name}</h2>
                  <div className="text-[10px] font-bold text-green-500 flex items-center uppercase tracking-widest"><div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" /> Online</div>
               </div>
               <button className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400"><Info size={20} /></button>
             </div>
             <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                <MessageCircle size={64} className="text-slate-300" />
                <div>
                   <h3 className="font-bold text-slate-900 dark:text-white">Start the conversation</h3>
                   <p className="text-xs font-medium text-slate-500">Ask for advice or share your recent performance stats.</p>
                </div>
             </div>
             <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-4">
                <div className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-2xl px-4 py-3 flex items-center">
                   <input type="text" placeholder="Type a message..." className="bg-transparent border-none outline-none w-full text-sm dark:text-white" />
                </div>
                <button className="w-12 h-12 bg-primary-500 text-white rounded-2xl shadow-lg flex items-center justify-center active:scale-90"><Send size={20} /></button>
             </div>
           </div>
         )}
      </AnimatePresence>
    </div>
  );
}

function ChevronRight({ size, className }: { size: number, className: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
