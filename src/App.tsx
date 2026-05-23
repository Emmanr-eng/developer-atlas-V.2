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
        <div className="min-h-screen bg-[#050510] text-white flex items-center justify-center px-6">
          <div className="w-full max-w-lg rounded-3xl border border-cyan-500/20 bg-[#0a0a1a]/90 backdrop-blur-xl p-8 space-y-4 shadow-2xl shadow-cyan-500/5">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Application Error</p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-100">Something went wrong.</h1>
            <p className="text-sm text-slate-400">
              The app hit an unexpected runtime error and could not finish rendering.
            </p>
            {this.state.errorMessage && (
              <p className="text-xs text-slate-500 wrap-break-word rounded-2xl border border-cyan-500/10 bg-black/30 p-4">
                {this.state.errorMessage}
              </p>
            )}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-[10px] font-black uppercase tracking-[0.25em] text-white transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:scale-105"
            >
              Reload
            </button>
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
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
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
