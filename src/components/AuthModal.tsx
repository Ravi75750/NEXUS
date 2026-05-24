import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { register, verifyOTP, login } from '../lib/db';
import toast from 'react-hot-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

type AuthMode = 'login' | 'register' | 'otp';

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    otp: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'register') {
        await register({ email: formData.email, password: formData.password, name: formData.name });
        toast.success('OTP sent to your email!');
        setMode('otp');
      } else if (mode === 'otp') {
        const { token, user } = await verifyOTP({ email: formData.email, otp: formData.otp });
        localStorage.setItem('nexus_token', token);
        toast.success(`Welcome aboard, ${user.name}!`);
        onSuccess(user);
        onClose();
      } else {
        const { token, user } = await login({ email: formData.email, password: formData.password });
        localStorage.setItem('nexus_token', token);
        toast.success(`Welcome back, ${user.name}!`);
        onSuccess(user);
        onClose();
      }
    } catch (err: any) {
      toast.error(err.message);
      if (err.message.includes('not verified')) {
        setMode('otp');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="w-full max-w-md glass relative z-10 overflow-hidden rounded-[2.5rem] border-white/10"
      >
        {/* Header */}
        <div className="p-8 pb-0 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-display font-bold text-white">
              {mode === 'login' ? 'Nexus Login' : mode === 'register' ? 'Join Nexus' : 'Verify Identity'}
            </h2>
            <p className="text-white/40 text-sm mt-1">
              {mode === 'login' ? 'Access your digital command center' : 
               mode === 'register' ? 'Initialize your operative profile' : 
               'Enter the code transmitted to your email'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {mode === 'register' && (
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold flex items-center gap-2">
                <User className="w-3 h-3" /> Full Name
              </label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-nexus-cyan transition-colors text-white"
                placeholder="John Doe"
              />
            </div>
          )}

          {mode !== 'otp' && (
            <>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold flex items-center gap-2">
                  <Mail className="w-3 h-3" /> Email Address
                </label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-nexus-cyan transition-colors text-white"
                  placeholder="nexus@io.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold flex items-center gap-2">
                  <Lock className="w-3 h-3" /> Password
                </label>
                <input
                  required
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-nexus-cyan transition-colors text-white"
                  placeholder="••••••••"
                />
              </div>
            </>
          )}

          {mode === 'otp' && (
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold flex items-center gap-2">
                <ShieldCheck className="w-3 h-3" /> Verification Code
              </label>
              <input
                required
                type="text"
                maxLength={6}
                value={formData.otp}
                onChange={e => setFormData({ ...formData, otp: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-nexus-cyan transition-colors text-white font-mono text-center text-3xl tracking-[0.5em]"
                placeholder="000000"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary py-4 rounded-2xl flex items-center justify-center gap-3 group disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {mode === 'login' ? 'Enter Terminal' : mode === 'register' ? 'Initialize Profile' : 'Verify & Enter'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-xs text-white/40 hover:text-nexus-cyan transition-colors"
            >
              {mode === 'login' ? "Don't have a profile? Initialize here" : "Already have a profile? Access terminal"}
            </button>
          </div>
        </form>

        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-nexus-cyan via-nexus-purple to-nexus-cyan animate-shimmer bg-[length:200%_100%]" />
      </motion.div>
    </div>
  );
}
