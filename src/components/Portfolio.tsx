import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, ArrowRight, Zap, Globe, Smartphone, Play, Loader2 } from 'lucide-react';
import { getProjects, Project } from '../lib/db';

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
        <Loader2 className="w-10 h-10 text-nexus-cyan animate-spin" />
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Project List */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {projects.map((project, i) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setActiveProject(i)}
                className={`p-6 cursor-pointer rounded-xl transition-all duration-500 border ${
                  activeProject === i 
                    ? 'glass border-nexus-cyan/50 bg-nexus-cyan/5' 
                    : 'border-transparent hover:bg-white/5'
                }`}
              >
                <span className={`text-[10px] font-mono mb-2 block ${activeProject === i ? 'text-nexus-cyan' : 'text-white/30'}`}>
                  {project.category.toUpperCase()}
                </span>
                <h3 className={`text-xl font-bold ${activeProject === i ? 'text-white' : 'text-white/60'}`}>
                  {project.title}
                </h3>
              </motion.div>
            ))}
          </div>

          {/* Project Preview */}
          <div className="lg:col-span-7 h-[500px] relative rounded-3xl overflow-hidden glass group">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0"
              >
                <img 
                  src={projects[activeProject].image} 
                  alt={projects[activeProject].title}
                  className="w-full h-full object-cover brightness-50 group-hover:scale-105 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-nexus-dark via-transparent to-transparent" />
                
                <div className="absolute bottom-10 left-10 p-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex gap-2 mb-4">
                      {projects[activeProject].tags.map(tag => (
                        <span key={tag} className="text-[10px] uppercase font-bold tracking-widest px-2 py-1 glass rounded text-white/80">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h4 className="text-3xl font-bold mb-4">{projects[activeProject].title}</h4>
                    <p className="text-white/70 max-w-md mb-6">{projects[activeProject].description}</p>
                    <a 
                      href={projects[activeProject].projectUrl || "#"} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-primary py-2 px-6 inline-flex items-center gap-2"
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
