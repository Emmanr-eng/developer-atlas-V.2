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
        <div className="min-h-screen text-white flex items-center justify-center px-6"
          style={{
            background:
              'radial-gradient(ellipse at 20% 0%, rgba(16,185,129,0.08) 0%, transparent 50%),' +
              'radial-gradient(ellipse at 80% 20%, rgba(99,102,241,0.06) 0%, transparent 50%),' +
              '#050508',
          }}
        >
          <div
            className="w-full max-w-lg p-8 space-y-4"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '28px',
              boxShadow: '0 16px 48px rgba(0,0,0,0.2), 0 4px 16px rgba(0,0,0,0.1)',
            }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Application Error</p>
            <h1 className="text-3xl font-bold tracking-tight">Something went wrong.</h1>
            <p className="text-sm text-neutral-400">
              The app hit an unexpected runtime error and could not finish rendering.
            </p>
            {this.state.errorMessage && (
              <p
                className="text-xs text-neutral-500 wrap-break-word p-4"
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                }}
              >
                {this.state.errorMessage}
              </p>
            )}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center px-5 py-3 text-[10px] font-black uppercase tracking-[0.25em] text-black transition-all hover:scale-[1.03] active:scale-95 bg-emerald-500 hover:shadow-[0_0_24px_rgba(16,185,129,0.3)]"
              style={{ borderRadius: '20px' }}
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
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 shadow-[0_0_16px_rgba(16,185,129,0.3)]"></div>
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