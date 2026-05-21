import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, User as UserIcon, LogOut, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthModal from './AuthModal';
import { getMe, User } from '../lib/db';
import toast from 'react-hot-toast';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    loadUser();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadUser = async () => {
    const me = await getMe();
    setUser(me);
  };

  const handleLogout = () => {
    localStorage.removeItem('nexus_token');
    setUser(null);
    setIsProfileOpen(false);
    toast.success('Disconnected from nexus');
  };

  const navLinks = [
    { name: 'Services', href: '/#services' },
    { name: 'Portfolio', href: '/#portfolio' },
    { name: 'Reviews', href: '/#reviews' },
    { name: 'Team', href: '/#team' },
    { name: 'Contact', href: '/#contact' },
  ];

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
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
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-12 py-4',
        isScrolled || location.pathname !== '/' ? 'bg-nexus-dark/80 backdrop-blur-lg border-b border-white/5 py-3' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 group cursor-pointer"
          onClick={() => {
            if (location.pathname !== '/') navigate('/');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
         
          <div className="flex flex-col">
            <span className="font-display text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-nexus-cyan to-nexus-teal">
              NEXUS
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-nexus-yellow">
              Digital Solutions
            </span>
          </div>
        </motion.div>
 
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, i) => (
            <motion.button
              key={link.name}
              onClick={() => handleNavClick(link.href)}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-sm font-medium text-white/70 hover:text-nexus-cyan transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-nexus-cyan transition-all duration-300 group-hover:w-full" />
            </motion.button>
          ))}
          
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 glass px-4 py-2 rounded-xl text-sm font-bold border-nexus-cyan/20 hover:border-nexus-cyan transition-all"
              >
                <div className="w-6 h-6 rounded-lg bg-nexus-cyan/10 flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-nexus-cyan" />
                </div>
                {user.name.split(' ')[0]}
                <ChevronDown className={cn("w-4 h-4 transition-transform", isProfileOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 glass rounded-2xl border-white/10 p-2 z-50 overflow-hidden"
                  >
                    <div className="px-4 py-2 border-b border-white/5 mb-1">
                      <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Active Operative</p>
                      <p className="text-xs font-bold truncate">{user.email}</p>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 rounded-xl text-xs text-red-400 hover:bg-red-400/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="btn-primary py-2.5 px-6 text-sm flex items-center gap-2"
              onClick={() => setIsAuthModalOpen(true)}
            >
              Sign In
            </motion.button>
          )}

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="btn-primary py-2.5 px-6 text-sm"
            onClick={() => handleNavClick('/#contact')}
          >
            Contact Us
          </motion.button>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          {user && (
             <div className="w-10 h-10 rounded-xl glass flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-nexus-cyan" />
             </div>
          )}
          <button 
            className="text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={(u) => setUser(u)}
      />

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-nexus-charcoal/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-12 gap-8 text-center text-white">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href)}
                  className="text-2xl font-display font-bold hover:text-nexus-cyan transition-colors"
                >
                  {link.name}
                </button>
              ))}
              
              {!user && (
                <button 
                  className="btn-primary w-full max-w-xs mt-4"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  Sign In
                </button>
              )}

              <button 
                className="btn-primary w-full max-w-xs"
                onClick={() => handleNavClick('/#contact')}
              >
                Contact Us
              </button>

              {user && (
                <button 
                  onClick={handleLogout}
                  className="text-red-400 font-bold uppercase tracking-widest text-xs"
                >
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
