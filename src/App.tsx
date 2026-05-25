import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ThemeProvider } from './hooks/useTheme';
import { Layout } from './components/Layout';
import MainAtlas from './pages/MainAtlas';
import PostDetail from './pages/PostDetail';
import Admin from './pages/Admin';
import { useAuth } from './hooks/useAuth';

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    errorMessage: '',
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Application error boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 px-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
          <div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center">
            <div className="w-full rounded-3xl border border-red-200 bg-white p-8 shadow-xl shadow-slate-900/10 dark:border-red-500/20 dark:bg-slate-900 dark:shadow-black/30 md:p-10">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                Application error
              </div>
              <div className="space-y-4">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Something went wrong.</h1>
                <p className="max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                  The application hit an unexpected runtime error. Refresh the page to restore the latest stable state.
                </p>
                {this.state.errorMessage && (
                  <p className="rounded-2xl border border-red-100 bg-red-50/80 p-4 font-mono text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
                    {this.state.errorMessage}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-500"
              >
                Reload application
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-blue-600 dark:bg-blue-400" />
        Loading workspace
      </div>
    </div>
  );

  if (!user) return <Navigate to="/" />;
  if (adminOnly && !isAdmin) return <Navigate to="/" />;

  return <>{children}</>;
};

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<MainAtlas />} />
                <Route path="/blog/:id" element={<PostDetail />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly>
                      <Admin />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Layout>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
