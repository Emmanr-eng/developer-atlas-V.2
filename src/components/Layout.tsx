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
    <div className="min-h-screen bg-transparent text-neutral-100 flex flex-col font-sans transition-colors duration-300">
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      <nav
        className="sticky top-0 z-50 px-6 py-4 border-b border-white/8"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center h-12">
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
            <div className="w-10 h-10 bg-emerald-500 rounded-[14px] flex items-center justify-center font-bold text-black text-xl group-hover:rotate-12 transition-transform shadow-lg shadow-emerald-500/20" aria-hidden="true">A</div>
            <span className="text-lg font-medium tracking-tight">Atlas <span className="text-neutral-500 hidden sm:inline">/ Developer Portal</span></span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-2">
            <div
              className="flex p-1 mr-4"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
              }}
              role="tablist"
            >
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
                    "px-4 py-1.5 rounded-full text-xs font-semibold transition-all",
                    isActiveNav(item.id)
                      ? "bg-emerald-500/15 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                      : "text-neutral-400 hover:text-neutral-200 hover:bg-white/6"
                  )}
                >
                  {item.name}
                </button>
              ))}
              {isAdmin && (
                <Link 
                  to="/admin"
                  className="px-4 py-1.5 rounded-full text-xs font-semibold text-neutral-400 hover:text-neutral-200 hover:bg-white/6"
                >
                  Admin
                </Link>
              )}
            </div>
            
            <div className="flex gap-2">
              <div
                className="hidden lg:flex px-4 py-2 rounded-full text-[10px] items-center gap-2 uppercase tracking-widest font-bold"
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true"></div> Available
              </div>
              
              {user ? (
                <button
                  onClick={logout}
                  className="bg-neutral-100 text-black px-4 py-2 rounded-full text-xs font-bold hover:bg-white transition-colors hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                  id="logout-btn"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={login}
                  className="bg-emerald-500 text-black px-4 py-2 rounded-full text-xs font-bold hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20 hover:shadow-[0_0_24px_rgba(16,185,129,0.3)]"
                  id="login-btn"
                >
                  Admin Access
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-[14px]"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
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
              className="md:hidden mt-4 overflow-hidden shadow-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(40px) saturate(180%)',
                WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '28px',
                boxShadow: '0 16px 48px rgba(0, 0, 0, 0.2)',
              }}
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
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-colors hover:bg-white/6 text-neutral-400"
                  >
                    <item.icon className="w-5 h-5" aria-hidden="true" />
                    <span className="font-semibold text-sm">{item.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      
      {!isOnline && (
        <div
          className="px-6 py-2 text-center text-amber-400 text-xs font-bold uppercase tracking-widest"
          style={{
            background: 'rgba(245, 158, 11, 0.08)',
            backdropFilter: 'blur(8px)',
            borderBottom: '1px solid rgba(245, 158, 11, 0.2)',
          }}
          role="alert"
        >
          <span>📡 You're offline — showing cached data</span>
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

      <footer
        className="max-w-7xl mx-auto w-full px-6 py-8 flex flex-col sm:flex-row justify-between items-center text-[10px] text-neutral-500 uppercase tracking-[0.2em] font-bold border-t border-white/6"
        role="contentinfo"
      >
        <div>&copy; {new Date().getFullYear()} Developer Atlas. Navigating the tech landscape.</div>
        <div className="flex gap-8 mt-4 sm:mt-0">
          <a href="#" className="hover:text-emerald-400 transition-colors">GitHub</a>
          <a href="#" className="hover:text-emerald-400 transition-colors">LinkedIn</a>
          <a href="#" className="hover:text-emerald-400 transition-colors">Twitter</a>
        </div>
      </footer>
    </div>
  );
};