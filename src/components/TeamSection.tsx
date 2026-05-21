import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, Linkedin, Twitter, Users, ChevronRight, User } from 'lucide-react';
import { getTeam, TeamMember } from '../lib/db';

export default function TeamSection() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [hoveredMember, setHoveredMember] = useState<string | null>(null);

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    const data = await getTeam();
    setTeam(data);
  };

  if (team.length === 0) return null;

  return (
    <section id="team" className="py-24 relative overflow-hidden bg-nexus-charcoal/10">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-nexus-cyan/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-nexus-cyan font-mono text-xs mb-4 flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              CORE_OPERATIVES_LIST
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              The <span className="text-nexus-yellow">NEXUS</span> Team
            </motion.h2>
            <p className="text-white/60">
              Meet the high-performance engineers and creative strategists powering your digital transformation.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              onMouseEnter={() => setHoveredMember(member.id || null)}
              onMouseLeave={() => setHoveredMember(null)}
              className="group relative h-[450px] rounded-3xl overflow-hidden glass border-white/5 hover:border-nexus-cyan/40 transition-all duration-700"
            >
              {/* Image Background */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-nexus-dark via-nexus-dark/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              </div>

              {/* Technical Overlay */}
              <div className="absolute inset-0 border-[0.5px] border-white/5 m-4 rounded-2xl pointer-events-none group-hover:border-nexus-cyan/20 transition-colors" />
              
              {/* Content */}
              <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end">
                <motion.div
                  animate={{ y: hoveredMember === member.id ? -10 : 0 }}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-white tracking-tight">{member.name}</h3>
                    <p className="text-nexus-cyan font-mono text-[10px] uppercase tracking-[0.2em]">{member.role}</p>
                  </div>

                  <p className={`text-white/60 text-sm leading-relaxed transition-all duration-500 overflow-hidden ${hoveredMember === member.id ? 'h-auto opacity-100' : 'h-0 opacity-0'}`}>
                    {member.bio}
                  </p>

                  <div className="flex items-center gap-4 pt-2">
                    {member.socials.github && (
                      <a href={member.socials.github} target="_blank" className="text-white/40 hover:text-white transition-colors">
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                    {member.socials.linkedin && (
                      <a href={member.socials.linkedin} target="_blank" className="text-white/40 hover:text-white transition-colors">
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {member.socials.twitter && (
                      <a href={member.socials.twitter} target="_blank" className="text-white/40 hover:text-white transition-colors">
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Corner Accent */}
              <div className="absolute top-0 right-0 p-6">
                <div className="w-10 h-10 rounded-xl bg-nexus-cyan/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="w-5 h-5 text-nexus-cyan" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
