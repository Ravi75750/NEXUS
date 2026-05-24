import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getAIStrategyResponse } from '../services/geminiService';

export default function AIStrategyBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'model' | 'user', text: string }[]>([
    { role: 'model', text: 'Initiating Nexus AI Strategy Node. How can I facilitate your digital transformation today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const predefinedQuestions = [
    { 
      q: "Contact us on WhatsApp", 
      a: "You can initiate a secure communication line directly via [WhatsApp](https://wa.me/917575088632?text=Hi%20Nexus%20Team,%20I%20am%20interested%20in%20a%20digital%20transformation.)." 
    },
    { 
      q: "What services does Nexus provide?", 
      a: "Nexus Digital Solutions provides high-end digital services including **Full-Stack Web Development (MERN)**, **Android App Building**, **SEO Strategy**, **Video Editing**, and **Professional Logo Design/Branding**." 
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
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-nexus-cyan rounded-2xl shadow-[0_0_30px_rgba(0,170,255,0.4)] flex items-center justify-center text-nexus-dark z-40 hover:scale-110 transition-all duration-300 active:scale-95 group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative">
          <Bot className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-nexus-cyan animate-pulse" />
        </div>
      </button>

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
                    <div className="w-12 h-12 rounded-2xl bg-nexus-cyan/10 flex items-center justify-center relative">
                      <Bot className="w-6 h-6 text-nexus-cyan" />
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-nexus-charcoal animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-white">Nexus Intelligence</h3>
                      <p className="text-[10px] text-nexus-cyan uppercase tracking-widest font-bold">Strategy Node Active</p>
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
                    initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-nexus-cyan text-nexus-dark font-medium rounded-tr-none shadow-[0_4px_15px_rgba(0,170,255,0.2)]' 
                        : 'bg-white/5 border border-white/10 rounded-tl-none prose prose-invert prose-sm'
                    }`}>
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none flex gap-2">
                      <span className="w-2 h-2 bg-nexus-cyan rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-2 h-2 bg-nexus-cyan rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-2 h-2 bg-nexus-cyan rounded-full animate-bounce" />
                    </div>
                  </div>
                )}
              </div>

              {/* Predefined Questions */}
              <div className="px-6 py-3 border-t border-white/5 flex flex-wrap gap-2 bg-nexus-charcoal/50">
                {predefinedQuestions.map((pq, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(pq.q)}
                    disabled={isLoading}
                    className="text-[10px] font-bold uppercase tracking-wider bg-white/5 hover:bg-nexus-cyan/10 hover:text-nexus-cyan px-3 py-2 rounded-xl border border-white/10 transition-all whitespace-nowrap"
                  >
                    {pq.q.replace("Nexus ", "")}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="p-6 bg-nexus-charcoal border-t border-white/10">
                <div className="relative">
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSend()}
                    placeholder="Consult the strategy node..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-5 pr-14 py-4 focus:outline-none focus:border-nexus-cyan text-sm transition-colors text-white"
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={isLoading || !input.trim()}
                    className="absolute right-2 top-2 p-2.5 text-nexus-cyan hover:bg-nexus-cyan/10 rounded-xl transition-colors disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
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
