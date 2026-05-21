import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles, Zap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getAIStrategyResponse } from '../services/geminiService';
import Loader from './Loader';

export default function AIStrategyBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'model' | 'user', text: string }[]>([
    { role: 'model', text: 'Greetings. I am **NOVA**, your Nexus strategic intelligence node. How can I facilitate your digital evolution today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const predefinedQuestions = [
    { 
      q: "What services does Nexus provide?", 
      a: "Nexus Digital Solutions provides high-end digital services including **Full-Stack Web Development (MERN)**, **SEO Strategy**, **Video Editing**, and **Professional Logo Design/Branding**." 
    },
    { 
      q: "How can I start a project with you?", 
      a: "Initiating a project is simple. You can use our **Contact Form** on this site or reach out via WhatsApp/Email. Our team will then reach out to establish a technical sync." 
    },
    { 
      q: "What makes Nexus different?", 
      a: "Nexus stands at the intersection of technical precision and creative vision. We don't just build websites; we build 'Digital Assets' that are performance-optimized, SEO-ready, and aesthetically futuristic." 
    },
    { 
      q: "Do you offer AI-driven solutions?", 
      a: "Yes! We specialize in integrating AI models into business workflows, from automated customer service bots to intelligent data processing nodes." 
    },
    { 
      q: "How do I get in touch?", 
      a: "The most efficient way is to scroll to the **Contact Us** section below. You can leave your details, and our system will generate a preliminary roadmap for your project." 
    }
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (customMessage?: string) => {
    const userMessage = customMessage || input.trim();
    if (!userMessage || isLoading) return;

    if (!customMessage) setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    // Check for pre-prepared answers first
    const prepared = predefinedQuestions.find(p => p.q === userMessage);
    if (prepared) {
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'model', text: prepared.a }]);
        setIsLoading(false);
      }, 500);
      return;
    }

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    try {
      const response = await getAIStrategyResponse(userMessage, history);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Signal lost. Please retry link." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 w-16 h-16 bg-nexus-cyan rounded-2xl shadow-[0_0_30px_rgba(0,170,255,0.4)] flex items-center justify-center text-nexus-dark z-40 group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative flex items-center justify-center">
          <motion.div
             animate={{ 
               scale: [1, 1.4, 1],
               opacity: [0.1, 0.3, 0.1],
             }}
             transition={{ duration: 3, repeat: Infinity }}
             className="absolute w-16 h-16 bg-nexus-cyan/40 rounded-full blur-xl"
          />
          <motion.div
             animate={{ 
               scale: [1, 1.3, 1],
               opacity: [0.2, 0.5, 0.2],
               rotate: [0, 180, 360]
             }}
             transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
             className="absolute w-12 h-12 border-2 border-dashed border-nexus-cyan/40 rounded-full"
          />
          <motion.div
             animate={{ 
               scale: [1, 1.1, 1],
               opacity: [0.3, 0.6, 0.3],
               rotate: [360, 180, 0]
             }}
             transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
             className="absolute w-10 h-10 border border-nexus-cyan/30 rounded-full"
          />
          <motion.div
             animate={{ 
               y: [0, -4, 0],
             }}
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
             className="relative z-10 filter drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]"
          >
            <Bot className="w-8 h-8" />
          </motion.div>
        </div>
        <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-nexus-dark">
          <div className="w-full h-full bg-green-400 rounded-full animate-ping opacity-75" />
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-[95%] md:w-full md:max-w-[450px] h-[80vh] md:h-[650px] bg-nexus-dark rounded-[2.5rem] relative z-10 flex flex-col overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10 bg-nexus-charcoal relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-nexus-cyan/10 flex items-center justify-center relative group">
                      <div className="absolute inset-0 bg-nexus-cyan/20 rounded-2xl blur-md animate-pulse" />
                      <Bot className="w-6 h-6 text-nexus-cyan relative z-10" />
                      <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-nexus-yellow animate-bounce" />
                      <span className="absolute -bottom-1 -left-1 w-3 h-3 bg-green-500 rounded-full border-2 border-nexus-charcoal shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-white group flex items-center gap-2">
                        NOVA AI
                        <div className="px-1.5 py-0.5 rounded text-[8px] bg-nexus-cyan/20 text-nexus-cyan border border-nexus-cyan/30 tracking-tighter uppercase font-black">Core</div>
                      </h3>
                      <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-medium">Strategic Analytics Unit</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white/40 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Chat Content */}
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth scrollbar-hide"
              >
                {messages.map((msg, i) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] px-5 py-4 rounded-3xl text-sm leading-relaxed shadow-sm transition-all ${
                      msg.role === 'user' 
                        ? 'bg-nexus-cyan text-nexus-dark font-semibold rounded-tr-none border-b-2 border-r-2 border-black/10' 
                        : 'bg-white/[0.03] border border-white/10 rounded-tl-none backdrop-blur-md prose prose-invert prose-sm'
                    }`}>
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none flex items-center gap-3">
                      <div className="scale-50 origin-left">
                        <Loader />
                      </div>
                      <span className="text-[10px] font-mono text-nexus-cyan/40 uppercase tracking-widest animate-pulse">Processing...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Predefined Questions */}
              <div className="px-6 py-4 border-t border-white/5 flex flex-nowrap overflow-x-auto gap-2 bg-black/20 no-scrollbar">
                {predefinedQuestions.map((pq, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(pq.q)}
                    disabled={isLoading}
                    className="text-[9px] font-bold uppercase tracking-widest bg-white/[0.02] hover:bg-nexus-cyan hover:text-nexus-dark px-4 py-2.5 rounded-full border border-white/5 transition-all whitespace-nowrap shadow-sm active:scale-95"
                  >
                    {pq.q.replace("Nexus ", "")}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="p-6 bg-nexus-charcoal border-t border-white/10 relative">
                <div className="absolute -top-4 left-0 w-full h-4 bg-gradient-to-t from-nexus-charcoal to-transparent pointer-events-none" />
                <div className="relative group">
                  <div className="absolute inset-0 bg-nexus-cyan/5 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity" />
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSend()}
                    placeholder="Inquire Nova core..."
                    className="relative w-full bg-white/5 border border-white/10 rounded-2xl pl-6 pr-14 py-4 focus:outline-none focus:border-nexus-cyan focus:bg-white/[0.08] text-sm transition-all text-white placeholder:text-white/20"
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={isLoading || !input.trim()}
                    className="absolute right-2 top-2 p-2.5 text-nexus-cyan hover:bg-nexus-cyan hover:text-nexus-dark rounded-xl transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <Send className="w-5 h-5 shadow-inner" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
