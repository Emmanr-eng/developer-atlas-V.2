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
    // Admin stays as a separate route
  }

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300 relative" style={{ color: 'var(--text-primary)' }}>
      {/* Floating Orbs Background - Futuristic neon */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-15%] left-[-5%] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px] animate-float" />
        <div className="absolute bottom-[-15%] right-[-5%] w-[450px] h-[450px] rounded-full bg-violet-500/10 blur-[120px] animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-[50%] left-[50%] w-[350px] h-[350px] rounded-full bg-blue-500/8 blur-[100px] animate-float" style={{ animationDelay: '6s' }} />
        <div className="absolute top-[10%] right-[20%] w-[250px] h-[250px] rounded-full bg-pink-500/6 blur-[80px] animate-float" style={{ animationDelay: '9s' }} />
      </div>

      {/* Glass Navigation */}
      <nav className="sticky top-0 z-50 glass-nav px-6 py-4">
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
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center font-bold text-white text-xl group-hover:rotate-12 transition-transform shadow-lg shadow-cyan-500/30 animate-glow">
              A
            </div>
            <span className="text-lg font-medium tracking-tight text-slate-200">Atlas <span className="text-slate-500 hidden sm:inline">/ Developer Portal</span></span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="flex glass-btn p-1 mr-4">
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
                    "px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300",
                    location.hash === `#${item.id}` || (location.hash === '' && item.id === 'home' && location.pathname === '/')
                      ? "bg-cyan-500/20 text-cyan-300 shadow-sm border border-cyan-500/30 shadow-cyan-500/10"
                      : "text-slate-400 hover:text-cyan-300 hover:bg-white/5"
                  )}
                >
                  {item.name}
                </button>
              ))}
              {isAdmin && (
                <Link 
                  to="/admin"
                  className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-400 hover:text-cyan-300 hover:bg-white/5 transition-all"
                >
                  Admin
                </Link>
              )}
            </div>
            
            <div className="flex gap-2">
              <div className="hidden lg:flex glass-btn px-4 py-2 text-[10px] items-center gap-2 uppercase tracking-widest font-bold text-slate-400">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-lg shadow-cyan-400/50"></div> Available
              </div>
              
              {user ? (
                <button
                  onClick={logout}
                  className="bg-slate-800 text-slate-200 px-4 py-2 rounded-full text-xs font-bold hover:bg-slate-700 transition-all border border-slate-700 hover:border-slate-600"
                  id="logout-btn"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={login}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-full text-xs font-bold hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50"
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
              className="p-2 rounded-xl glass-btn text-slate-300"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="md:hidden mt-4 glass-card overflow-hidden"
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
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/5"
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

      <main className="grow max-w-7xl mx-auto w-full px-6 py-6 overflow-x-hidden relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="max-w-7xl mx-auto w-full px-6 py-8 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold relative z-10 border-t border-cyan-500/10">
        <div>&copy; {new Date().getFullYear()} Developer Atlas. Navigating the tech landscape.</div>
        <div className="flex gap-8 mt-4 sm:mt-0">
          <a href="#" className="hover:text-cyan-400 transition-colors">GitHub</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">LinkedIn</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Twitter</a>
        </div>
      </footer>
    </div>
  );
};
