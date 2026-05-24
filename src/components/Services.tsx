import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  Smartphone, 
  MonitorPlay, 
  Palette, 
  Search, 
  BarChart3, 
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
    id: 'app',
    title: 'Android Development',
    description: 'Premium native and cross-platform mobile experiences with flawless performance.',
    detailedInfo: 'We build native Android applications that leverage the full power of hardware. From biometric authentication to seamless background processing, our apps are engineered for the futuristic mobile landscape.',
    icon: Smartphone,
    color: 'nexus-teal',
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800',
    category: 'Engineering',
    tags: ['Kotlin', 'Flutter', 'Firebase', 'Native'],
    pricing: [
      { label: 'UI Mockup + 5 Screens', price: '₹19,999' },
      { label: 'Full App + API Integration', price: '₹29,999' },
      { label: 'Complex Ecosystem (Multi-role)', price: '₹45,999' }
    ],
    features: ['High Performance', 'Biometric Support', 'Push Notifications', 'Offline Storage']
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
  },
  {
    id: 'market',
    title: 'Market Analysis',
    description: 'Data-driven strategic insights to pinpoint your competitive edge and maximize ROI.',
    detailedInfo: 'We analyze the digital grid to find market gaps and opportunities for your startup to exploit, backed by real-time data visualization.',
    icon: BarChart3,
    color: 'nexus-yellow',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    category: 'Growth',
    tags: ['Data', 'Stratgey', 'ROI'],
    pricing: [
      { label: 'Single Market Audit', price: '₹3,999' },
      { label: 'Quarterly Strategic Roadmap', price: '₹8,999' },
      { label: 'Full Competitor Penetration Plan', price: '₹15,999' }
    ],
    features: ['SWOT Sync', 'Trend Forecasting', 'Consumer Intel', 'Risk Analysis']
  }
];

export default function Services() {
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);

  return (
    <section id="services" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Service <span className="neon-text">Nodes</span>
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
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -10 }}
              onClick={() => setSelectedService(service)}
              className="relative group cursor-pointer"
            >
              {/* Card Glow Background */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-nexus-cyan/20 to-nexus-teal/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
              
              <div className="relative glass h-full p-8 rounded-3xl border-white/5 group-hover:border-nexus-cyan/50 flex flex-col transition-all duration-500 overflow-hidden">
                {/* Subtle Domain Background Image */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img 
                    src={service.imageUrl} 
                    alt={service.title} 
                    className="w-full h-full object-cover opacity-[0.15] group-hover:opacity-25 group-hover:scale-110 transition-all duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-nexus-charcoal opacity-90 group-hover:opacity-75 transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-nexus-charcoal via-transparent to-transparent opacity-100" />
                </div>

                {/* Decorative Technical Accents */}
                <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none z-10">
                  <div className="absolute top-4 right-4 w-4 h-[2px] bg-nexus-cyan/30 group-hover:bg-nexus-cyan transition-colors" />
                  <div className="absolute top-4 right-4 w-[2px] h-4 bg-nexus-cyan/30 group-hover:bg-nexus-cyan transition-colors" />
                </div>
                <div className="absolute bottom-0 left-0 w-16 h-16 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <div className="absolute bottom-4 left-4 w-4 h-[2px] bg-nexus-yellow" />
                  <div className="absolute bottom-4 left-4 w-[2px] h-4 bg-nexus-yellow" />
                </div>

                {/* Light Sweep Animation */}
                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none z-10" />

                <div className="mb-8 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative group-hover:border-nexus-cyan/50 transition-colors duration-500">
                    <service.icon className="w-8 h-8 text-white group-hover:text-nexus-cyan group-hover:scale-110 transition-all duration-500" />
                    {/* Icon Aura */}
                    <div className="absolute inset-0 bg-nexus-cyan/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="absolute -top-2 -right-2 text-[10px] font-mono text-white/20 group-hover:text-nexus-cyan transition-colors">
                    0{i + 1}
                  </div>
                </div>

                <div className="mb-4 relative z-10">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold group-hover:text-nexus-yellow transition-colors mb-2 block">
                    {service.category}_PROTOCOL
                  </span>
                  <h3 className="text-2xl font-display font-bold group-hover:text-white transition-colors">
                    {service.title}
                  </h3>
                </div>

                <p className="text-white/90 text-sm leading-relaxed mb-8 flex-grow relative z-10 drop-shadow-sm font-medium">
                  {service.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-8 relative z-10">
                  {service.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[9px] px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white/30 font-mono">
                      #{tag.toUpperCase()}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3 text-nexus-cyan text-sm font-bold group-hover:gap-5 transition-all relative z-10">
                  <div className="h-px flex-grow bg-gradient-to-r from-nexus-cyan/50 to-transparent" />
                  <span className="whitespace-nowrap uppercase tracking-widest text-[11px]">Initiate Node</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
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
              className="glass max-w-3xl w-full rounded-3xl overflow-hidden border-nexus-cyan/30 shadow-[0_0_50px_rgba(0,170,255,0.1)] relative"
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
                  <h3 className="text-2xl font-bold mb-2">{selectedService.title}</h3>
                  <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-nexus-cyan mb-6">PROTOCOL_ANALYSIS</span>
                  
                  <div className="space-y-4 w-full">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 text-left">
                      <Zap className="w-4 h-4 text-nexus-yellow" />
                      <div>
                        <p className="text-[10px] text-white/30 uppercase">Latency</p>
                        <p className="text-xs font-bold font-mono text-white/80">ULTRA_LOW</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 text-left">
                      <Shield className="w-4 h-4 text-nexus-cyan" />
                      <div>
                        <p className="text-[10px] text-white/30 uppercase">Security</p>
                        <p className="text-xs font-bold font-mono text-white/80">QUANTUM_READY</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className="md:col-span-12 lg:col-span-7 p-8 max-h-[70vh] overflow-y-auto">
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
                            <span className="text-xs text-white/60">{tier.label}</span>
                            <span className="text-sm font-bold font-mono text-nexus-cyan">{tier.price}</span>
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
