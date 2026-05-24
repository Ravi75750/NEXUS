import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle2, MessageSquare, Loader2 } from 'lucide-react';
import { createContactInquiry } from '../lib/db';
import toast from 'react-hot-toast';

export default function ContactForm() {
  const [formState, setFormState] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    try {
      await createContactInquiry({
        name: formState.name,
        email: formState.email,
        phone: formState.phone,
        message: formState.message,
      });
      setIsSubmitted(true);
      setFormState({ name: '', email: '', phone: '', message: '' });
      toast.success('Inquiry transmitted to Nexus HQ');
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error('Transmission failed. Check connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-nexus-cyan/5 blur-[150px] -z-10 rounded-full" />
      
      <div className="max-w-4xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass p-8 md:p-14 rounded-[3rem] relative overflow-hidden border-white/10"
        >
          <div className="flex flex-col md:flex-row items-center gap-6 mb-12 border-b border-white/5 pb-8">
            <div className="w-16 h-16 rounded-[1.5rem] bg-nexus-cyan/10 flex items-center justify-center">
              <MessageSquare className="text-nexus-cyan w-8 h-8" />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-display font-bold text-white">Contact <span className="text-nexus-cyan">Nexus</span></h2>
              <p className="text-white/40 uppercase tracking-[0.3em] text-[10px] font-bold mt-1">Initiate Technical Sync</p>
            </div>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Identified Name</label>
                  <input
                    required
                    type="text"
                    value={formState.name}
                    onChange={e => setFormState({ ...formState, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-nexus-cyan transition-all text-white placeholder:text-white/10"
                    placeholder="E.g. Agent Smith"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Comm Link (Email)</label>
                  <input
                    required
                    type="email"
                    value={formState.email}
                    onChange={e => setFormState({ ...formState, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-nexus-cyan transition-all text-white placeholder:text-white/10"
                    placeholder="contact@hq.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Secure Mobile Node</label>
                  <input
                    required
                    type="tel"
                    value={formState.phone}
                    onChange={e => setFormState({ ...formState, phone: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-nexus-cyan transition-all text-white placeholder:text-white/10"
                    placeholder="+1 000 000 000"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Mission Brief (Message)</label>
                <textarea
                  rows={5}
                  required
                  value={formState.message}
                  onChange={e => setFormState({ ...formState, message: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-nexus-cyan transition-all text-white placeholder:text-white/10 resize-none"
                  placeholder="Elaborate on your digital architectural requirements..."
                />
              </div>

              <button 
                disabled={isSubmitting}
                type="submit" 
                className="w-full btn-primary py-5 rounded-2xl flex items-center justify-center gap-4 group disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>TRANSMITTING... <Loader2 className="w-5 h-5 animate-spin" /></>
                ) : (
                  <>INITIALIZE SYNC <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                )}
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-nexus-cyan/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(0,170,255,0.1)]">
                <CheckCircle2 className="w-12 h-12 text-nexus-cyan" />
              </div>
              <h3 className="text-3xl font-display font-bold text-white mb-4">Sync Successful</h3>
              <p className="text-white/40 max-w-sm mx-auto mb-10 leading-relaxed">
                Transmission received at HQ. A Nexus Operative will initiate contact within 12 standard business cycles.
              </p>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="btn-secondary px-10 py-4 rounded-xl border-white/10 hover:border-nexus-cyan"
              >
                Establish New Link
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
