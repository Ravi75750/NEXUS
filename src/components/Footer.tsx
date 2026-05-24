import React from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Instagram, Twitter, Linkedin, Facebook, Atom, MessageCircle } from 'lucide-react';

import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (href: string) => {
    if (href.startsWith('/#')) {
      const id = href.replace('/#', '');
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="pt-24 pb-12 bg-nexus-charcoal relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="Nexus Logo" 
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  (e.target as any).style.display = 'none';
                }}
              />
              <div className="flex flex-col">
                <span className="font-display text-xl font-bold tracking-tight">NEXUS</span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-nexus-yellow">Digital Solutions</span>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              Elevating visionary businesses through interconnected digital engineering and futuristic creative strategies.
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Linkedin, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:text-nexus-cyan hover:border-nexus-cyan/50 transition-all">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-6 text-nexus-cyan uppercase tracking-widest text-sm">Nexus_Nodes</h4>
            <ul className="space-y-4">
              {[
                { name: 'Services', href: '/#services' },
                { name: 'Portfolio', href: '/#portfolio' },
                { name: 'Reviews', href: '/#reviews' },
                { name: 'Team', href: '/#team' },
                { name: 'Contact', href: '/#contact' },
                { name: 'Admin Login', href: '/admin' }
              ].map((link) => (
                <li key={link.name}>
                  {link.href.startsWith('/#') ? (
                    <button 
                      onClick={() => handleNavClick(link.href)}
                      className="text-white/40 hover:text-white transition-colors text-sm text-left w-full"
                    >
                      {link.name}
                    </button>
                  ) : (
                    <a 
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/40 hover:text-white transition-colors text-sm text-left w-full block"
                    >
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold mb-6 text-nexus-cyan uppercase tracking-widest text-sm">Technologies</h4>
            <ul className="space-y-4">
              {['Full-Stack Web', 'Android Engineering', 'SEO Systems', 'Creative Media', 'Brand Identity'].map((tech) => (
                <li key={tech}>
                  <span className="text-white/40 text-sm">{tech}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold mb-6 text-nexus-cyan uppercase tracking-widest text-sm">Direct_Connect</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg glass flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-nexus-yellow" />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-white/30 mb-1">CALL/WHATSAPP</p>
                  <a href="tel:+917575088632" className="text-sm font-bold hover:text-nexus-cyan transition-colors">7575088632</a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg glass flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-nexus-yellow" />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-white/30 mb-1">TRANSMIT_EMAIL</p>
                  <a href="mailto:mrbadshaff@gmail.com" className="text-sm font-bold hover:text-nexus-cyan transition-colors">mrbadshaff@gmail.com</a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg glass flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-[#25D366]" />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-white/30 mb-1">WHATSAPP_CONNECT</p>
                  <a href="https://wa.me/917575088632" target="_blank" rel="noopener noreferrer" className="text-sm font-bold hover:text-[#25D366] transition-colors">Connect on WhatsApp</a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg glass flex items-center justify-center flex-shrink-0">
                  <Instagram className="w-5 h-5 text-[#E4405F]" />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-white/30 mb-1">INSTAGRAM_FEED</p>
                  <a href="https://www.instagram.com/nexus_websolutions_?igsh=ZXRhNHFobjZhNzJy" target="_blank" rel="noopener noreferrer" className="text-sm font-bold hover:text-[#E4405F] transition-colors">Follow on Instagram</a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/30 text-xs">
            © {currentYear} Nexus Digital Solutions. All system protocols active.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-white/20 hover:text-white text-[10px] uppercase tracking-widest transition-colors font-bold">Privacy_Protocol</a>
            <a href="#" className="text-white/20 hover:text-white text-[10px] uppercase tracking-widest transition-colors font-bold">Terms_of_Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
