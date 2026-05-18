import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { Sun, Moon, Menu, X, Terminal, Code, BookOpen, Mail, User, Shield, FlaskConical, Bug } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin, login, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

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

  if (isAdmin) {
    // Admin stays as a separate route usually, but for internal portal it might be a section.
    // I'll keep it as a link for now or handle it specially.
  }

  return (
    <div className="min-h-screen bg-#0A0A0A text-neutral-100 flex flex-col font-sans transition-colors duration-300">
      <nav className="sticky top-0 z-50 bg-#0A0A0A/80 backdrop-blur-md px-6 py-4">
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
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center font-bold text-black text-xl group-hover:rotate-12 transition-transform shadow-lg shadow-emerald-500/20">A</div>
            <span className="text-lg font-medium tracking-tight">Atlas <span className="text-neutral-500 hidden sm:inline">/ Developer Portal</span></span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="flex bg-neutral-800/50 p-1 rounded-full border border-neutral-700/50 mr-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (location.pathname !== '/') {
                      window.location.href = `/#${item.id}`;
                    } else {
                      scrollTo(item.id);
                    }
                  }}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-semibold transition-all",
                    location.hash === `#${item.id}` || (location.hash === '' && item.id === 'home' && location.pathname === '/')
                      ? "bg-neutral-700 text-white shadow-sm"
                      : "text-neutral-400 hover:text-neutral-200"
                  )}
                >
                  {item.name}
                </button>
              ))}
              {isAdmin && (
                <Link 
                  to="/admin"
                  className="px-4 py-1.5 rounded-full text-xs font-semibold text-neutral-400 hover:text-neutral-200"
                >
                  Admin
                </Link>
              )}
            </div>
            
            <div className="flex gap-2">
              <div className="hidden lg:flex bg-neutral-800 px-4 py-2 rounded-full text-[10px] items-center gap-2 border border-neutral-700 uppercase tracking-widest font-bold">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Available
              </div>
              
              {user ? (
                <button
                  onClick={logout}
                  className="bg-neutral-100 text-black px-4 py-2 rounded-full text-xs font-bold hover:bg-white transition-colors"
                  id="logout-btn"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={login}
                  className="bg-emerald-500 text-black px-4 py-2 rounded-full text-xs font-bold hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/10"
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
              className="p-2 rounded-xl bg-neutral-800 border border-neutral-700"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden mt-4 bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-4 space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setIsMenuOpen(false);
                      if (location.pathname !== '/') {
                        window.location.href = `/#${item.id}`;
                      } else {
                        scrollTo(item.id);
                      }
                    }}
                    className={cn(
                      "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors hover:bg-neutral-800 text-neutral-400"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-semibold text-sm">{item.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="grow max-w-7xl mx-auto w-full px-6 py-6 overflow-x-hidden">
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

      <footer className="max-w-7xl mx-auto w-full px-6 py-8 flex flex-col sm:flex-row justify-between items-center text-[10px] text-neutral-500 uppercase tracking-[0.2em] font-bold">
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
