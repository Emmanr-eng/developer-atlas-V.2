import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { Menu, X, Terminal, Code, BookOpen, Mail, FlaskConical, Bug } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-200 relative bg-white text-neutral-900">

      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass-nav px-6 py-3">
        <div className="max-w-6xl mx-auto flex justify-between items-center h-12">
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
            <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center font-semibold text-white text-sm group-hover:rounded-xl transition-all duration-200">
              A
            </div>
            <span className="text-sm font-medium tracking-tight text-neutral-900">Atlas <span className="text-neutral-400 hidden sm:inline">/ Developer</span></span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            <div className="flex border border-neutral-200 rounded-full p-0.5 mr-4 bg-neutral-50">
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
                    "px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
                    location.hash === `#${item.id}` || (location.hash === '' && item.id === 'home' && location.pathname === '/')
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-500 hover:text-neutral-900"
                  )}
                >
                  {item.name}
                </button>
              ))}
              {isAdmin && (
                <Link 
                  to="/admin"
                  className="px-3.5 py-1.5 rounded-full text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-all"
                >
                  Admin
                </Link>
              )}
            </div>
            
            <div className="flex gap-2 items-center">
              <div className="hidden lg:flex items-center gap-2 text-[11px] text-neutral-400 font-medium px-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Available
              </div>
              
              {user ? (
                <button
                  onClick={logout}
                  className="text-neutral-500 px-4 py-1.5 rounded-full text-xs font-medium hover:text-neutral-900 transition-colors border border-neutral-200 hover:border-neutral-300"
                  id="logout-btn"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={login}
                  className="bg-neutral-900 text-white px-4 py-1.5 rounded-full text-xs font-medium hover:bg-neutral-800 transition-colors"
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
              className="p-2 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="md:hidden mt-3 border border-neutral-200 rounded-xl bg-white overflow-hidden"
            >
              <div className="p-2 space-y-0.5">
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
                    className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="font-medium text-sm">{item.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="grow max-w-6xl mx-auto w-full px-6 py-8 overflow-x-hidden relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="max-w-6xl mx-auto w-full px-6 py-8 flex flex-col sm:flex-row justify-between items-center text-xs text-neutral-400 font-medium relative z-10 border-t border-neutral-100">
        <div>&copy; {new Date().getFullYear()} Developer Atlas</div>
        <div className="flex gap-6 mt-3 sm:mt-0">
          <a href="#" className="hover:text-neutral-900 transition-colors">GitHub</a>
          <a href="#" className="hover:text-neutral-900 transition-colors">LinkedIn</a>
          <a href="#" className="hover:text-neutral-900 transition-colors">Twitter</a>
        </div>
      </footer>
    </div>
  );
};
