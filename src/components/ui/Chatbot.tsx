import { useState, useRef, useEffect } from 'react';
import { Send, Bot, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateAIResponse } from '../../services/aiService';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import clsx from 'clsx';

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{id: string, text: string, isBot: boolean}[]>([
    { id: '1', text: "Hi! I'm your AI Stadium Assist. Ask me anything about the match, food, or traffic!", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const globalDensity = useSelector((state: RootState) => state.crowd.globalDensity);
  const zones = useSelector((state: RootState) => state.crowd.zones);
  const liveMatchContext = useSelector((state: RootState) => state.liveMatch);
  const cartState = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = { id: Date.now().toString(), text: input, isBot: false };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const eventsContext = liveMatchContext.events.length > 0 ? liveMatchContext.events.map((e: any) => e.text).join(' | ') : 'No recent events.';
    const zoneDataContext = Object.values(zones as Record<string, any>).map((z: any) => `Zone ${z.name}: ${z.densityPercent}%`).join(', ');
    const liveMatchData = `Playing: ${liveMatchContext.sport}. Score: ${liveMatchContext.currentScore}. Over: ${liveMatchContext.currentOver}.`;

    const foodOrderContext = cartState.items.length > 0 
      ? `Ordered: [${cartState.items.map((i: any) => `${i.quantity}x ${i.name}`).join(', ')}]. Delivery: ${cartState.deliveryMode}.`
      : `No active food orders.`;

    const systemPrompt = `You are SmartStadium Bot. Be highly concise. Context: Venue is ${globalDensity}. Match: ${liveMatchData}. Events Constraints: ${eventsContext}. Orders: ${foodOrderContext}. Zones: ${zoneDataContext}`;

    try {
      const responseText = await generateAIResponse(systemPrompt, userMsg.text);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: responseText, isBot: true }]);
    } catch {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: "I'm having trouble connecting right now.", isBot: true }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-24 right-5 md:bottom-10 md:right-10 w-14 h-14 bg-gradient-to-tr from-primary-600 to-indigo-600 rounded-full shadow-2xl flex items-center justify-center text-white z-50 overflow-hidden ring-4 ring-primary-500/30"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
            <Bot size={28} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-0 right-0 md:bottom-6 md:right-6 w-full md:w-[380px] h-[75vh] md:h-[600px] max-h-[800px] z-[100] bg-white dark:bg-slate-900 md:rounded-[2rem] rounded-t-[2rem] shadow-2xl border border-slate-200/50 dark:border-slate-800/50 flex flex-col overflow-hidden"
          >
             {/* Header */}
             <div className="p-4 bg-gradient-to-r from-primary-600 to-indigo-600 text-white flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-[-50%] right-[-10%] w-32 h-32 bg-white/10 blur-2xl rounded-full" />
                <div className="flex items-center z-10">
                   <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mr-3 border border-white/20">
                     <Bot size={22} />
                   </div>
                   <div>
                     <h3 className="font-extrabold text-lg leading-tight">AI Champ</h3>
                     <p className="text-[10px] font-bold tracking-widest uppercase text-primary-200">Live Context Assistant</p>
                   </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"><X size={20} /></button>
             </div>

             {/* Messages Area */}
             <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950">
               {messages.map((msg) => (
                 <motion.div 
                   initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                   key={msg.id} 
                   className={clsx("max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm", msg.isBot ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 self-start rounded-tl-none" : "bg-primary-500 text-white self-end rounded-tr-none ml-auto")}
                 >
                   {msg.text}
                 </motion.div>
               ))}
               {isTyping && (
                 <div className="bg-white dark:bg-slate-800 max-w-[60px] rounded-2xl rounded-tl-none px-4 py-3 border border-slate-100 dark:border-slate-700 shadow-sm flex space-x-1">
                   <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></div>
                   <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{animationDelay: '150ms'}}></div>
                   <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{animationDelay: '300ms'}}></div>
                 </div>
               )}
               <div ref={messagesEndRef} />
             </div>

             {/* Input Area */}
             <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
               <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 rounded-full px-2 py-1.5 focus-within:ring-2 focus-within:ring-primary-500/50 transition-all border border-transparent dark:border-slate-700">
                 <input 
                   type="text" 
                   value={input}
                   onChange={e => setInput(e.target.value)}
                   onKeyDown={e => e.key === 'Enter' && handleSend()}
                   placeholder="Ask about live scores..."
                   className="flex-1 bg-transparent border-none outline-none px-3 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400"
                 />
                 <button onClick={handleSend} disabled={!input || isTyping} className="w-10 h-10 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 dark:disabled:bg-slate-700 dark:disabled:text-slate-500 rounded-full flex items-center justify-center text-white transition-all active:scale-95 shadow-md">
                   <Send size={18} className="translate-x-0.5" />
                 </button>
               </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
