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
        <div className="min-h-screen bg-[#0a0a12] text-white flex items-center justify-center px-6 arcade-scanlines">
          <div className="w-full max-w-lg border-2 border-arcade-red bg-[#1a1a2e] p-8 space-y-6 rounded-xl"
               style={{ boxShadow: '0 0 30px rgba(255, 51, 51, 0.2), inset 0 0 60px rgba(255, 51, 51, 0.05)' }}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">💀</span>
              <p className="pixel-heading text-[10px] text-arcade-red uppercase">GAME OVER</p>
            </div>
            <h1 className="pixel-heading text-lg leading-relaxed">CRITICAL ERROR</h1>
            <p className="text-sm text-neutral-400 font-mono">
              The system encountered a fatal runtime exception.
            </p>
            {this.state.errorMessage && (
              <p className="text-xs text-arcade-red/70 font-mono wrap-break-word rounded-lg border border-arcade-red/30 bg-black/50 p-4">
                &gt; {this.state.errorMessage}
              </p>
            )}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="arcade-btn bg-arcade-red border-[#ff0000] text-white hover:bg-[#ff5555] w-full text-center"
            >
              🔄 INSERT COIN TO CONTINUE
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
      <div className="pixel-heading text-[10px] text-arcade-cyan coin-blink">LOADING...</div>
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