import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronRight, Activity, Clock, ShieldCheck, Zap, AlertTriangle } from 'lucide-react';
import { getProjectByTrackKey } from '../lib/db';
import toast from 'react-hot-toast';

export default function ProjectTracker() {
  const [key, setKey] = useState('');
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (key.length < 8) {
      toast.error('Protocol keys must be 8 characters');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await getProjectByTrackKey(key);
      if (data.error) throw new Error(data.error);
      setProject(data);
    } catch (err: any) {
      setError(err.message);
      setProject(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-nexus-dark overflow-hidden relative">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-nexus-cyan to-transparent" />
        <div className="h-full w-full bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nexus-cyan/10 border border-nexus-cyan/20 text-nexus-cyan text-[10px] font-bold uppercase tracking-[0.2em] mb-6"
          >
            <Activity className="w-3 h-3" /> Secure Project Access
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-display font-bold mb-6"
          >
            Project <span className="neon-text">Nexus</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/40 max-w-lg mx-auto"
          >
            Enter your 8-digit secure alphanumeric key to decrypt project status and real-time development progress.
          </motion.p>
        </div>

        {!project ? (
          <motion.form
            layout
            onSubmit={handleTrack}
            className="max-w-md mx-auto"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-nexus-cyan/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
              <input
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value.toUpperCase())}
                placeholder="PROTOC_01"
                maxLength={8}
                className="w-full bg-nexus-dark/50 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-5 text-center text-2xl font-mono tracking-[0.5em] focus:outline-none focus:border-nexus-cyan focus:ring-1 focus:ring-nexus-cyan transition-all uppercase relative z-10"
              />
            </div>
            
            <button
              disabled={isLoading}
              className="w-full mt-6 btn-primary flex items-center justify-center gap-3 py-5 text-sm font-bold tracking-widest relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              {isLoading ? 'DECRYPTING PROTOCOL...' : 'INITIATE TRACKING'}
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center flex items-center justify-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" /> {error}
              </motion.div>
            )}
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-[2rem] border-white/10 p-8 md:p-12 relative overflow-hidden"
          >
            {/* HUD Scan Line */}
            <div className="absolute inset-x-0 h-0.5 bg-nexus-cyan/20 animate-scan top-0 pointer-events-none" />
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
              <div>
                <span className="text-[10px] font-mono text-nexus-cyan tracking-widest uppercase block mb-2">Project_ID: {key}</span>
                <h2 className="text-3xl font-display font-bold">{project.projectName}</h2>
                <p className="text-white/40 text-sm">{project.clientName} // Operative Profile</p>
              </div>
              <div className="flex flex-col items-end">
                <span className={cn(
                  "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border mb-2",
                  project.status === 'active' ? 'bg-nexus-teal/10 text-nexus-teal border-nexus-teal/20' : 'bg-nexus-yellow/10 text-nexus-yellow border-nexus-yellow/20'
                )}>
                  {project.status} STATUS
                </span>
                <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Stage: {project.stage}</div>
              </div>
            </div>

            <div className="space-y-12">
              <div>
                <div className="flex justify-between items-end mb-4">
                  <span className="text-sm font-bold uppercase tracking-widest text-white/60">Development Progress</span>
                  <span className="text-4xl font-display font-bold text-nexus-cyan">{project.progress}%</span>
                </div>
                <div className="h-4 w-full bg-white/5 rounded-full border border-white/10 p-1">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-nexus-cyan to-nexus-teal rounded-full shadow-[0_0_15px_rgba(0,229,255,0.4)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-nexus-purple/10 border border-nexus-purple/20">
                    <Clock className="w-5 h-5 text-nexus-purple" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-white/20 uppercase block mb-1">Initiated</span>
                    <p className="font-bold">{new Date(project.startDate).toLocaleDateString()}</p>
                  </div>
                </div>
                {project.deadline && (
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-nexus-cyan/10 border border-nexus-cyan/20">
                      <ShieldCheck className="w-5 h-5 text-nexus-cyan" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-white/20 uppercase block mb-1">Deployment Targeted</span>
                      <p className="font-bold">{new Date(project.deadline).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-8 border-t border-white/5 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-nexus-cyan/10 border border-nexus-cyan/20 rounded-xl text-[10px] font-bold text-nexus-cyan uppercase tracking-widest">
                  <Zap className="w-3 h-3" /> Continuous Deployment Active
                </div>
                <button 
                  onClick={() => { setProject(null); setKey(''); }}
                  className="px-4 py-2 text-[10px] font-bold text-white/40 hover:text-white uppercase tracking-widest transition-colors ml-auto"
                >
                  Disconnect Session
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
