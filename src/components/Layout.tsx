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
    <div className="arcade-scanlines flex min-h-screen flex-col font-sans text-slate-700 transition-colors duration-300 dark:text-slate-200">
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 px-4 py-4 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/72" role="navigation" aria-label="Main navigation">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-6">
          <button
            onClick={() => {
              if (location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                window.location.href = '/';
              }
            }}
            className="flex items-center gap-4 rounded-2xl text-left outline-none transition hover:opacity-90"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-600 shadow-sm dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">
              <Terminal className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-[-0.03em] text-slate-950 dark:text-white">Developer Atlas</span>
              <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Product engineering portfolio</span>
            </div>
          </button>

          <div className="hidden items-center gap-3 md:flex">
            <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50/90 p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900/90" role="tablist">
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
                    'rounded-full px-4 py-2 text-sm font-medium transition-all',
                    isActiveNav(item.id)
                      ? 'bg-white text-blue-600 shadow-sm shadow-slate-900/8 dark:bg-slate-800 dark:text-blue-300 dark:shadow-black/25'
                      : 'text-slate-500 hover:bg-white hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                  )}
                >
                  {item.name}
                </button>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="rounded-full px-4 py-2 text-sm font-medium text-slate-500 transition hover:bg-white hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                >
                  Admin
                </Link>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700 lg:flex dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
                Available
              </div>

              {user ? (
                <button
                  onClick={logout}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  id="logout-btn"
                >
                  Sign out
                </button>
              ) : (
                <button
                  onClick={login}
                  className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-500"
                  id="login-btn"
                >
                  Admin access
                </button>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav-menu"
              aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {isMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              ref={mobileMenuRef}
              id="mobile-nav-menu"
              role="menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mx-auto mt-4 max-w-7xl rounded-3xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/30 md:hidden"
            >
              <div className="space-y-1">
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
                    className="flex w-full items-center space-x-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                  >
                    <item.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                    <span>{item.name}</span>
                  </button>
                ))}
                {user ? (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      logout();
                    }}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    id="logout-btn-mobile"
                  >
                    Sign out
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      login();
                    }}
                    className="mt-2 w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20"
                    id="login-btn-mobile"
                  >
                    Admin access
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {!isOnline && (
        <div className="border-b border-amber-200 bg-amber-50/90 px-6 py-3 text-center text-sm font-medium text-amber-800 backdrop-blur dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300" role="alert">
          You’re offline. Showing the most recently cached content.
        </div>
      )}

      <main id="main-content" className="mx-auto flex grow w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8" role="main" tabIndex={-1}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1] }}
            className="h-full w-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="border-t border-slate-200/80 bg-white/80 dark:border-slate-800/80 dark:bg-slate-950/75" role="contentinfo">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1 text-center sm:text-left">
            <p className="text-sm font-semibold text-slate-950 dark:text-white">Developer Atlas</p>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Designing resilient digital products</p>
          </div>
          <div className="flex justify-center gap-6 text-sm text-slate-500 dark:text-slate-400">
            <a href="#" className="transition-colors hover:text-blue-600 dark:hover:text-blue-300">GitHub</a>
            <a href="#" className="transition-colors hover:text-blue-600 dark:hover:text-blue-300">LinkedIn</a>
            <a href="#" className="transition-colors hover:text-blue-600 dark:hover:text-blue-300">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
