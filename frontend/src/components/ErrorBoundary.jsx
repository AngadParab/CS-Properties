import React from 'react';
import { ShieldAlert, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error
    console.error("ErrorBoundary caught an unhandled error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6 selection:bg-brand-gold/30">
          {/* Glassmorphic card */}
          <div className="max-w-md w-full bg-white/80 border border-brand-sandDark backdrop-blur-md rounded-3xl p-8 shadow-2xl text-center space-y-6 animate-fadeIn">
            <div className="inline-flex p-4 bg-red-50 text-red-600 rounded-full">
              <ShieldAlert className="w-10 h-10" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-black text-brand-navy tracking-tight">
                Something went wrong
              </h1>
              <p className="text-xs text-brand-text-muted leading-relaxed font-semibold">
                An unexpected error occurred while rendering the page layout. We apologize for the inconvenience.
              </p>
            </div>

            {/* Error detail box if in development/debug mode */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-left overflow-x-auto max-h-32">
              <p className="text-[10px] font-mono text-red-600 font-bold leading-tight">
                {this.state.error?.toString() || 'Unknown Error'}
              </p>
              {this.state.errorInfo?.componentStack && (
                <pre className="text-[9px] font-mono text-slate-500 leading-normal mt-2">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
              <button
                onClick={this.handleReload}
                className="flex items-center justify-center gap-2 bg-brand-navy text-white text-xs font-bold px-6 py-3 rounded-xl hover:bg-brand-gold hover:text-brand-navy transition-all duration-200 w-full sm:w-auto shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </button>
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 bg-white text-brand-navy border border-brand-sandDark text-xs font-bold px-6 py-3 rounded-xl hover:bg-slate-50 transition-all duration-200 w-full sm:w-auto shadow-sm"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Go Back Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
