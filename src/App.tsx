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
        <div className="min-h-screen bg-white text-neutral-900 flex items-center justify-center px-6">
          <div className="w-full max-w-lg border border-neutral-200 rounded-2xl p-10 space-y-5">
            <p className="text-[11px] font-medium uppercase tracking-widest text-neutral-400">Application Error</p>
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Something went wrong.</h1>
            <p className="text-sm text-neutral-500 leading-relaxed">
              The app hit an unexpected runtime error and could not finish rendering.
            </p>
            {this.state.errorMessage && (
              <p className="text-xs text-neutral-400 break-words rounded-lg border border-neutral-200 bg-neutral-50 p-4 font-mono">
                {this.state.errorMessage}
              </p>
            )}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-5 py-2.5 text-xs font-medium text-white hover:bg-neutral-800 transition-colors"
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
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-300"></div>
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
