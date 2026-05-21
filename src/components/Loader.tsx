import React from 'react';
import { motion } from 'motion/react';

export default function Loader({ fullPage = false }: { fullPage?: boolean }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="relative w-24 h-24">
        {/* Outer Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-4 border-nexus-cyan/20 border-t-nexus-cyan rounded-full shadow-[0_0_20px_rgba(0,170,255,0.2)]"
        />
        {/* Inner Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 border-4 border-nexus-purple/20 border-t-nexus-purple rounded-full"
        />
        {/* Center Node */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="absolute inset-8 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm"
        >
          <div className="w-2 h-2 bg-nexus-cyan rounded-full animate-ping" />
        </motion.div>
      </div>
      
      <div className="flex flex-col items-center">
        <motion.span 
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-[10px] font-mono font-bold tracking-[0.5em] text-nexus-cyan uppercase"
        >
          Initializing Nexus
        </motion.span>
        <div className="flex gap-1 mt-2">
           <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 h-1 bg-nexus-cyan rounded-full" />
           <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 h-1 bg-nexus-cyan rounded-full" />
           <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 h-1 bg-nexus-cyan rounded-full" />
        </div>
      </div>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-[200] bg-nexus-dark flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}
