import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, ArrowRight, Zap, Globe, Smartphone, Play } from 'lucide-react';
import { getProjects, Project } from '../lib/db';
import Loader from './Loader';

export default function Portfolio() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch live projects.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProjects();
  }, []);

  if (isLoading) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-nexus-charcoal/30">
        <Loader fullPage />
      </div>
    );
  }

  if (projects.length === 0) {
    return null; // Or show a section saying "Coming Soon"
  }

  return (
    <section id="portfolio" className="py-24 bg-nexus-charcoal/30 relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-nexus-cyan font-mono text-sm mb-4"
            >
              PROJECT_DATABASE_v1.0
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              The Nexus <span className="text-nexus-yellow">Archives</span>
            </motion.h2>
            <p className="text-white/60">
              Explore our most impactful case studies and digital transformations from our secure project repository.
            </p>
          </div>
          <button className="btn-secondary group flex items-center gap-2">
            View All Archives
            <AnimatePresence>
              <motion.div
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </AnimatePresence>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          {/* Project List */}
          <div className="lg:col-span-5 flex flex-col gap-4 justify-center">
            {projects.map((project, i) => {
              const isActive = activeProject === i;
              return (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: 'easeOut' }}
                  onClick={() => setActiveProject(i)}
                  className={`p-6 cursor-pointer rounded-2xl transition-all duration-300 border relative overflow-hidden group ${
                    isActive 
                      ? 'bg-nexus-cyan/[0.03] border-nexus-cyan/50 shadow-[0_0_20px_rgba(0,170,255,0.08)]' 
                      : 'border-white/5 bg-transparent hover:bg-white/[0.02] hover:border-white/10'
                  }`}
                >
                  {/* Active Slide Track Line */}
                  <div className={`absolute top-0 left-0 bottom-0 w-[4px] transition-all duration-300 ${isActive ? 'bg-nexus-cyan' : 'bg-transparent'}`} />

                  {/* High Tech ID Tag */}
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-[9px] font-mono tracking-widest ${isActive ? 'text-nexus-cyan font-bold' : 'text-white/20'}`}>
                      {isActive ? `// ACTIVE_NODE` : `// NODE_0${i + 1}`}
                    </span>
                    <span className={`text-[10px] font-sans font-medium px-2 py-0.5 rounded-full border ${
                      isActive 
                        ? 'border-nexus-cyan/20 text-nexus-cyan bg-nexus-cyan/10' 
                        : 'border-white/5 text-white/30 bg-white/5'
                    }`}>
                      {project.category}
                    </span>
                  </div>

                  <h3 className={`text-lg font-bold tracking-tight transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/60 group-hover:text-white/90'}`}>
                    {project.title}
                  </h3>
                </motion.div>
              );
            })}
          </div>

          {/* Project Preview with HUD styling */}
          <div className="lg:col-span-7 min-h-[500px] relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] group bg-nexus-dark">
            
            {/* Precise Cybernetic Layout Brackets */}
            <div className="absolute top-6 left-6 w-3 h-3 border-t-2 border-l-2 border-nexus-cyan/40 pointer-events-none z-20" />
            <div className="absolute top-6 right-6 w-3 h-3 border-t-2 border-r-2 border-nexus-cyan/40 pointer-events-none z-20" />
            <div className="absolute bottom-6 left-6 w-3 h-3 border-b-2 border-l-2 border-nexus-cyan/40 pointer-events-none z-20" />
            <div className="absolute bottom-6 right-6 w-3 h-3 border-b-2 border-r-2 border-nexus-cyan/40 pointer-events-none z-20" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject}
                initial={{ opacity: 0, filter: 'blur(8px)', scale: 1.05 }}
                animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                exit={{ opacity: 0, filter: 'blur(8px)', scale: 1.05 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="absolute inset-0 flex flex-col justify-end"
              >
                <img 
                  src={projects[activeProject].image} 
                  alt={projects[activeProject].title}
                  className="absolute inset-0 w-full h-full object-cover brightness-[0.4] group-hover:scale-105 transition-transform duration-[1200ms]"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual Overlay Shading */}
                <div className="absolute inset-0 bg-gradient-to-t from-nexus-dark via-nexus-dark/40 to-transparent z-10" />

                {/* Cybernetic Tech Details Grid Overlay */}
                <div className="absolute top-8 left-12 right-12 flex justify-between items-center text-white/20 font-mono text-[9px] pointer-events-none z-10">
                  <span>SECURE_ARCHIVE_FILE_R24</span>
                  <span>STATUS: INTEGRATED</span>
                </div>
                
                <div className="relative bottom-0 left-0 p-8 md:p-12 z-20 w-full">
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex flex-wrap gap-2 mb-4">
                      {projects[activeProject].tags.map(tag => (
                        <span key={tag} className="text-[9px] uppercase font-mono tracking-widest px-2.5 py-1 rounded bg-nexus-cyan/10 border border-nexus-cyan/20 text-nexus-cyan backdrop-blur-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <h4 className="text-2xl md:text-3.5xl font-bold mb-3 text-white tracking-tight leading-none">
                      {projects[activeProject].title}
                    </h4>
                    
                    <p className="text-white/65 max-w-xl mb-6 text-sm leading-relaxed">
                      {projects[activeProject].description}
                    </p>
                    
                    <a 
                      href={projects[activeProject].projectUrl || "#"} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-6 py-3 rounded-xl bg-nexus-cyan text-nexus-dark text-[11px] font-extrabold uppercase tracking-widest inline-flex items-center gap-2 hover:bg-nexus-dark hover:text-nexus-cyan border border-nexus-cyan hover:border-nexus-cyan/50 hover:shadow-[0_0_25px_rgba(0,170,255,0.4)] transition-all duration-300"
                    >
                       Full Case Study
                       <ExternalLink className="w-4 h-4" />
                    </a>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
