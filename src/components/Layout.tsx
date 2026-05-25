import React, { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { Sun, Moon, Menu, X, Terminal, Code, BookOpen, Mail, User, Shield, FlaskConical, Bug } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin, login, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const isOnline = useOnlineStatus();

  useFocusTrap(mobileMenuRef, isMenuOpen);

  const navItems = [
    { name: 'Home', id: 'home', icon: Terminal },
    { name: 'Ecosystem', id: 'portfolio', icon: Code },
    { name: 'Lab', id: 'lab', icon: FlaskConical },
    { name: 'Bug Timeline', id: 'timeline', icon: Bug },
    { name: 'Guides', id: 'blog', icon: BookOpen },
    { name: 'Connect', id: 'contact', icon: Mail },
  ];

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isActiveNav = (id: string) =>
    location.hash === `#${id}` || (location.hash === '' && id === 'home' && location.pathname === '/');

  return (
    <div className="min-h-screen bg-[#0a0a12] text-neutral-100 flex flex-col font-sans transition-colors duration-300 arcade-scanlines">
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      {/* ─── Top Marquee Bar ─── */}
      <div className="bg-[#0a0a12] border-b border-[#2a2a4a] overflow-hidden">
        <div className="flex items-center justify-center py-1.5 gap-4">
          <span className="text-[8px] font-mono uppercase tracking-[0.3em] text-[#2a2a4a]">
            ★ DEVELOPER ATLAS ★ RETRO ARCADE EDITION ★
          </span>
        </div>
      </div>

      <nav className="sticky top-0 z-50 bg-[#0a0a12]/90 backdrop-blur-md border-b-2 border-[#2a2a4a] px-6 py-3" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto flex justify-between items-center h-14">
          {/* Logo */}
          <button
            onClick={() => {
              if (location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                window.location.href = '/';
              }
            }}
            className="flex items-center space-x-3 group text-left outline-none"
          >
            <div className="w-11 h-11 bg-arcade-cyan rounded-lg flex items-center justify-center font-bold text-[#0a0a12] text-xl group-hover:rotate-12 transition-transform border-2 border-arcade-cyan"
                 style={{ boxShadow: '0 0 15px rgba(0, 240, 255, 0.4), 0 3px 0 #008899' }}>
              🕹️
            </div>
            <div className="flex flex-col">
              <span className="pixel-heading text-[10px] neon-cyan leading-none">ATLAS</span>
              <span className="text-[8px] font-mono text-[#2a2a4a] uppercase tracking-[0.2em] hidden sm:block">Developer Portal</span>
            </div>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="flex bg-[#12121f] p-1 rounded-lg border-2 border-[#2a2a4a] mr-4" role="tablist">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  role="tab"
                  aria-selected={isActiveNav(item.id)}
                  aria-current={isActiveNav(item.id) ? 'page' : undefined}
                  onClick={() => {
                    if (location.pathname !== '/') {
                      window.location.href = `/#${item.id}`;
                    } else {
                      scrollTo(item.id);
                    }
                  }}
                  className={cn(
                    "px-3 py-2 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider transition-all",
                    isActiveNav(item.id)
                      ? "bg-arcade-cyan text-[#0a0a12] shadow-[0_0_10px_rgba(0,240,255,0.3)]"
                      : "text-[#2a2a4a] hover:text-arcade-cyan hover:bg-[#1a1a2e]"
                  )}
                >
                  {item.name}
                </button>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="px-3 py-2 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider text-arcade-purple hover:bg-arcade-purple/10"
                >
                  Admin
                </Link>
              )}
            </div>

            <div className="flex gap-2">
              <div className="hidden lg:flex bg-[#12121f] px-3 py-2 rounded-lg text-[8px] items-center gap-2 border border-[#2a2a4a] font-mono uppercase tracking-widest font-bold">
                <div className="w-2 h-2 rounded-full bg-arcade-green coin-blink" aria-hidden="true"></div>
                <span className="text-arcade-green">P1 Ready</span>
              </div>

              {user ? (
                <button
                  onClick={logout}
                  className="arcade-btn bg-[#1a1a2e] border-arcade-magenta text-arcade-magenta hover:bg-arcade-magenta hover:text-black text-[8px]"
                  id="logout-btn"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={login}
                  className="arcade-btn bg-arcade-magenta border-[#ff44cc] text-white hover:bg-[#ff44cc] text-[8px]"
                  style={{ boxShadow: '0 0 15px rgba(255, 0, 170, 0.3), 0 3px 0 #990066' }}
                  id="login-btn"
                >
                  🔑 Admin Access
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg bg-[#1a1a2e] border-2 border-[#2a2a4a] text-arcade-cyan"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav-menu"
              aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {isMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              ref={mobileMenuRef}
              id="mobile-nav-menu"
              role="menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden mt-4 bg-[#12121f] border-2 border-[#2a2a4a] rounded-xl overflow-hidden shadow-2xl"
            >
              <div className="p-4 space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    role="menuitem"
                    onClick={() => {
                      setIsMenuOpen(false);
                      if (location.pathname !== '/') {
                        window.location.href = `/#${item.id}`;
                      } else {
                        scrollTo(item.id);
                      }
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors hover:bg-[#1a1a2e] text-[#2a2a4a] hover:text-arcade-cyan"
                  >
                    <item.icon className="w-5 h-5" aria-hidden="true" />
                    <span className="font-mono font-bold text-xs uppercase tracking-wider">{item.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {!isOnline && (
        <div className="bg-arcade-yellow/10 border-b-2 border-arcade-yellow/30 px-6 py-2 text-center text-arcade-yellow text-[8px] font-mono font-bold uppercase tracking-[0.3em]" role="alert">
          <span>⚠ CONNECTION LOST — SHOWING CACHED DATA ⚠</span>
        </div>
      )}

      <main id="main-content" className="grow max-w-7xl mx-auto w-full px-6 py-6 overflow-x-hidden" role="main" tabIndex={-1}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="border-t-2 border-[#2a2a4a] bg-[#0a0a12]" role="contentinfo">
        <div className="max-w-7xl mx-auto w-full px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="pixel-heading text-[7px] text-[#2a2a4a] leading-relaxed text-center sm:text-left">
            &copy; {new Date().getFullYear()} DEVELOPER ATLAS
            <br />
            <span className="text-[#2a2a4a]/60">RETRO ARCADE EDITION</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#2a2a4a] hover:text-arcade-cyan transition-colors">GitHub</a>
            <a href="#" className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#2a2a4a] hover:text-arcade-magenta transition-colors">LinkedIn</a>
            <a href="#" className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#2a2a4a] hover:text-arcade-yellow transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
};