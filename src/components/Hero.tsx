import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Atom, Sparkles, ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-nexus-cyan/20 text-nexus-cyan text-sm font-medium mb-8"
        >
          <Sparkles className="w-4 h-4" />
          <span>Elevate Your Business To The Next Level</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-8xl font-display font-bold leading-tight mb-8"
        >
          Join <span className="neon-text"> us</span> to  <br />
          <span className="text-nexus-yellow">Grow</span>  Your Business.
        </motion.h1>



        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-center gap-6"
        >
          <button
            className="btn-[#FA340F] flex items-center gap-2 group"
            onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Start Your Transformation
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            className="btn-secondary flex items-center gap-2 group border-white/10"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Contact Nexus HQ
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>


      </div>
    </section>
  );
}
