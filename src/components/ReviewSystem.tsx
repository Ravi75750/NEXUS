import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Quote, Send, User, MessageSquare, LogIn } from 'lucide-react';
import { getReviews, createReview, Review, getMe, User as UserType } from '../lib/db';
import toast from 'react-hot-toast';
import Loader from './Loader';

export default function ReviewSystem() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [formData, setFormData] = useState({
    service: '',
    content: '',
    rating: 5,
  });

  useEffect(() => {
    loadReviews();
    checkUser();
  }, []);

  const checkUser = async () => {
    const me = await getMe();
    setUser(me);
  };

  const loadReviews = async () => {
    const data = await getReviews();
    setReviews(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Identity required for transmission. Log in first.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await createReview({
        ...formData,
        clientName: user.name,
        role: 'Verified Operative',
        avatar: user.avatar,
      });
      setFormData({
        service: '',
        content: '',
        rating: 5,
      });
      setShowForm(false);
      toast.success('Review synchronized to Nexus public log');
      loadReviews();
    } catch (err) {
      toast.error('Sync failed. Secure link dropped.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="py-24 relative overflow-hidden bg-nexus-dark/50">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nexus-cyan/10 text-nexus-cyan text-xs font-bold uppercase tracking-widest mb-4"
          >
            <Star className="w-4 h-4" />
            <span>Digital Legacy</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Client <span className="text-nexus-cyan">Transmissions</span>
          </motion.h2>
          <p className="text-white/60 max-w-2xl mx-auto mb-8">
            Verbatim logs from our successful digital deployments across the global network.
          </p>
          
          <button 
            onClick={() => {
              if (!user) {
                toast('Auth required. Please sign in via the top terminal.', {
                  icon: '🛡️',
                });
                return;
              }
              setShowForm(!showForm);
            }}
            className="btn-secondary text-sm px-8 py-3 flex items-center gap-2 mx-auto"
          >
            {user ? (
               showForm ? 'Abort Sync' : 'Transmit Feedback'
            ) : (
               <><LogIn className="w-4 h-4" /> Auth Required for Feedback</>
            )}
          </button>
        </div>

        <AnimatePresence>
          {showForm && user && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, height: 0 }}
              animate={{ opacity: 1, scale: 1, height: 'auto' }}
              exit={{ opacity: 0, scale: 0.9, height: 0 }}
              className="max-w-xl mx-auto mb-16 glass p-8 rounded-[2.5rem] border-nexus-cyan/20"
            >
              <div className="flex items-center gap-4 mb-8 p-4 bg-white/5 rounded-2xl">
                 <div className="w-12 h-12 rounded-xl bg-nexus-cyan/10 flex items-center justify-center font-bold text-nexus-cyan text-xl">
                   {user.name.charAt(0)}
                 </div>
                 <div>
                    <h4 className="text-white font-bold">{user.name}</h4>
                    <p className="text-xs text-white/40 uppercase tracking-widest font-mono">Authenticated Operative</p>
                 </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase ml-2 tracking-widest">Protocol (Service Deployed)</label>
                  <input 
                    required
                    placeholder="e.g. Video Production / MERN Architecture"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-nexus-cyan outline-none transition-all text-white"
                    value={formData.service}
                    onChange={e => setFormData({...formData, service: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase ml-2 tracking-widest">Signal Quality (Rating)</label>
                  <div className="flex items-center gap-3 p-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star 
                        key={star}
                        className={`w-8 h-8 cursor-pointer transition-all hover:scale-110 ${formData.rating >= star ? 'text-nexus-cyan fill-nexus-cyan shadow-[0_0_15px_rgba(0,170,255,0.3)]' : 'text-white/10'}`}
                        onClick={() => setFormData({...formData, rating: star})}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase ml-2 tracking-widest">Technical Statement (Review)</label>
                  <textarea 
                    required
                    placeholder="Describe the performance metrics and success trajectory..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-nexus-cyan outline-none transition-all min-h-[120px] text-white resize-none"
                    value={formData.content}
                    onChange={e => setFormData({...formData, content: e.target.value})}
                  />
                </div>

                <button disabled={isSubmitting} type="submit" className="w-full btn-primary py-4 rounded-2xl flex items-center justify-center gap-3 group relative overflow-hidden">
                  {isSubmitting ? (
                    <div className="scale-50 origin-center py-2 h-8 flex items-center">
                      <Loader />
                    </div>
                  ) : (
                    <>
                      <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      Initialize Synchronous Write
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-8 rounded-3xl relative flex flex-col group hover:border-nexus-cyan/30 transition-all duration-500"
            >
              <div className="absolute top-8 right-8 text-nexus-cyan/20 group-hover:text-nexus-cyan/40 transition-colors">
                <Quote className="w-8 h-8 rotate-180" />
              </div>
              
              <div className="flex items-center gap-1 mb-6">
                {[...Array(review.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-nexus-cyan fill-nexus-cyan shadow-[0_0_10px_rgba(0,170,255,0.2)]" />
                ))}
              </div>

              <p className="text-white/80 leading-relaxed italic mb-8 flex-grow">
                "{review.content}"
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-nexus-cyan/10 flex items-center justify-center border border-nexus-cyan/20 overflow-hidden">
                   {review.avatar ? (
                     <img src={review.avatar} className="w-full h-full object-cover" />
                   ) : (
                     <span className="text-nexus-cyan font-bold text-lg">{review.clientName.charAt(0)}</span>
                   )}
                </div>
                <div>
                  <h4 className="font-bold text-white leading-tight">{review.clientName}</h4>
                  <p className="text-nexus-cyan text-[10px] font-mono uppercase tracking-widest">{review.service}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
