import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  MonitorPlay, 
  Palette, 
  Search, 
  Database,
  X, 
  CheckCircle2, 
  ArrowRight,
  Zap,
  Shield
} from 'lucide-react';

const services = [
  {
    id: 'web',
    title: 'Web Engineering',
    description: 'Bespoke MERN stack applications built for ultra-performance and infinite scalability.',
    detailedInfo: 'Our web engineering node focuses on high-performance architectures using Next.js and the MERN stack. We specialize in server-side rendering, real-time data synchronization, and military-grade security protocols.',
    icon: Globe,
    color: 'nexus-cyan',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800',
    category: 'Engineering',
    tags: ['Next.js', 'React', 'Node.js', 'MongoDB'],
    pricing: [
      { label: 'Basic Design + 3 Pages', price: '₹7,999' },
      { label: 'Dynamic Design + 7 Pages', price: '₹15,999' },
      { label: 'Enterprise Stack + Custom CMS', price: '₹25,000' }
    ],
    features: ['SEO Optimized', 'Mobile Responsive', 'Cloud Infrastructure', 'SSL Certified']
  },
  {
    id: 'video',
    title: 'Video Editing',
    description: 'Cinematic storytelling and motion graphics that captivate and convert audiences.',
    detailedInfo: 'Nexus creative media lab utilizes high-end CGI and motion design to produce cinematic brand films. We handle everything from color grading to complex 3D tracking.',
    icon: MonitorPlay,
    color: 'nexus-yellow',
    imageUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=800',
    category: 'Media',
    tags: ['After Effects', 'Premiere Pro', 'Motion'],
    pricing: [
      { label: 'Short Ad (30s) + Motion Graphics', price: '₹2,999' },
      { label: 'Corporate Brand Film (2m)', price: '₹7,999' },
      { label: 'Premium 3D Visual Effects', price: '₹14,999' }
    ],
    features: ['4K Rendering', 'Custom SFX', 'Color Grading', 'Stock Sync']
  },
  {
    id: 'branding',
    title: 'Logo & Branding',
    description: 'Visual identities that define market leaders and resonate with the futuristic pulse.',
    detailedInfo: 'Our branding protocol goes beyond aesthetics. We create symbols that represent the core node of your business, ensuring visual consistency across all digital frontiers.',
    icon: Palette,
    color: 'nexus-cyan',
    imageUrl: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=800',
    category: 'Media',
    tags: ['Minimalist', 'Tech-Noir', 'Logo Design'],
    pricing: [
      { label: 'Classic Logo (3 Concepts)', price: '₹1,499' },
      { label: 'Complete Brand Identity Kit', price: '₹4,999' },
      { label: 'Futuristic 3D Identity System', price: '₹9,999' }
    ],
    features: ['Vector Formats', 'Brand Guidelines', 'Social Media Kit', 'Source Files']
  },
  {
    id: 'seo',
    title: 'SEO Mastery',
    description: 'Aggressive search engine optimization to dominate local and global market rankings.',
    detailedInfo: 'Nexus Growth Engine utilizes proprietary algorithms and semantic analysis to ensure your business stays at the zenith of search results.',
    icon: Search,
    color: 'nexus-teal',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    category: 'Growth',
    tags: ['Optimization', 'Ranking', 'Audits'],
    pricing: [
      { label: 'Local SEO Booster (3 Months)', price: '₹5,999' },
      { label: 'Enterprise Growth Campaign', price: '₹12,999' },
      { label: 'Global Ranking Domination', price: '₹19,999' }
    ],
    features: ['Keyword Analysis', 'Backlink Engine', 'Speed Optimization', 'Competitor Sync']
  }
];

export default function Services() {
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);

  useEffect(() => {
    if (selectedService) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedService]);

  return (
    <section id="services" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Our <span className="neon-text">Services</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/60 max-w-2xl mx-auto"
          >
            Our core nodes functionalize through intersectional expertise in engineering, creative media, and strategic growth engines.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => {
            const isCyan = service.color === 'nexus-cyan';
            const isYellow = service.color === 'nexus-yellow';
            const accentClass = isCyan ? 'text-nexus-cyan border-nexus-cyan/20 bg-nexus-cyan/5' : isYellow ? 'text-nexus-yellow border-nexus-yellow/20 bg-nexus-yellow/5' : 'text-nexus-teal border-nexus-teal/20 bg-nexus-teal/5';
            const glowClass = isCyan ? 'shadow-[0_0_20px_rgba(0,255,255,0.1)]' : isYellow ? 'shadow-[0_0_20px_rgba(255,215,0,0.1)]' : 'shadow-[0_0_20px_rgba(20,240,200,0.1)]';

            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -10 }}
                onClick={() => setSelectedService(service)}
                className="group relative h-full cursor-pointer"
              >
                {/* Modern Glass Background */}
                <div className={`relative h-full glass border border-white/10 rounded-3xl p-8 transition-all duration-500 group-hover:border-white/30 group-hover:bg-white/[0.05] overflow-hidden ${glowClass}`}>
                  
                  {/* Subtle Image Backdrop */}
                  <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-10 transition-opacity duration-1000">
                    <img 
                      src={service.imageUrl} 
                      alt="" 
                      className="w-full h-full object-cover scale-150"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Header: Icon & Tier */}
                  <div className="flex justify-between items-start mb-10 relative z-10">
                    <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:border-nexus-cyan/50 transition-colors duration-500`}>
                      <service.icon className="w-8 h-8 text-white group-hover:text-nexus-cyan transition-colors" />
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em] block mb-1">Service_Node</span>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${isCyan ? 'text-nexus-cyan' : isYellow ? 'text-nexus-yellow' : 'text-nexus-teal'}`}>0{i + 1}</span>
                    </div>
                  </div>

                  {/* Body: Title & Descr */}
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-4 tracking-tight group-hover:text-nexus-cyan transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed mb-10 line-clamp-3">
                      {service.description}
                    </p>
                  </div>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-2 mb-10 relative z-10">
                    {service.tags.map(tag => (
                      <span key={tag} className="text-[9px] px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white/40 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer Action */}
                  <div className="mt-auto border-t border-white/5 pt-6 flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full bg-nexus-cyan animate-pulse`} />
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Pricing starts {service.pricing[0].price}</span>
                    </div>
                    <div className="flex items-center gap-2 text-nexus-cyan text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Explore</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-[1.5s] bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Service Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-nexus-dark/95 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass max-w-3xl w-full rounded-3xl overflow-y-auto scrollbar-hide max-h-[90vh] border-nexus-cyan/30 shadow-[0_0_50px_rgba(0,170,255,0.1)] relative"
            >
              <button 
                onClick={() => setSelectedService(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12">
                {/* Visual Side */}
                <div className="md:col-span-12 lg:col-span-5 bg-nexus-cyan/5 p-8 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r border-white/10">
                  <div className="w-20 h-20 rounded-2xl bg-nexus-cyan flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,170,255,0.3)]">
                    <selectedService.icon className="w-10 h-10 text-nexus-dark" />
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{selectedService.title}</h3>
                  <span className="text-xs uppercase tracking-widest font-semibold text-nexus-cyan mb-6">Service Analysis</span>
                  
                  <div className="space-y-4 w-full">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 text-left">
                      <Zap className="w-4 h-4 text-nexus-yellow" />
                      <div>
                        <p className="text-[10px] text-white/40 uppercase font-semibold">Performance</p>
                        <p className="text-xs font-bold text-white/90">Ultra-High Speed</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 text-left">
                      <Shield className="w-4 h-4 text-nexus-cyan" />
                      <div>
                        <p className="text-[10px] text-white/40 uppercase font-semibold">Security</p>
                        <p className="text-xs font-bold text-white/90">Enterprise Grade</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className="md:col-span-12 lg:col-span-7 p-8">
                  <div className="space-y-8">
                    <section>
                      <h4 className="text-nexus-cyan text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                        <ArrowRight className="w-3 h-3" /> System Brief
                      </h4>
                      <p className="text-white/70 leading-relaxed text-sm">
                        {selectedService.detailedInfo}
                      </p>
                    </section>

                    <section>
                      <h4 className="text-nexus-cyan text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3" /> Core Capabilities
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedService.features.map(feature => (
                          <div key={feature} className="flex items-center gap-2 text-xs text-white/60">
                            <CheckCircle2 className="w-3.5 h-3.5 text-nexus-cyan" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </section>

                    <section className="bg-white/5 p-6 rounded-2xl border border-white/10">
                      <h4 className="text-nexus-yellow text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Database className="w-3.5 h-3.5" /> Pricing Structures
                      </h4>
                      <div className="space-y-3">
                        {selectedService.pricing.map((tier) => (
                          <div key={tier.label} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                            <span className="text-xs text-white/70">{tier.label}</span>
                            <span className="text-sm font-bold text-nexus-cyan">{tier.price}</span>
                          </div>
                        ))}
                      </div>
                    </section>

                    <button 
                      onClick={() => {
                        setSelectedService(null);
                        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="btn-primary w-full py-4 flex items-center justify-center gap-2"
                    >
                      Initialize This Protocol
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
