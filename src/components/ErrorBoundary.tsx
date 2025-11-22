import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-white rounded-xl border border-red-100 shadow-sm animate-fade-in">
          <div className="bg-red-50 p-4 rounded-full mb-4">
             <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h2>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">
            We encountered an error while displaying the results. This might be due to a browser extension conflict or a data formatting issue.
          </p>
          <div className="bg-slate-100 p-4 rounded-lg mb-6 w-full max-w-lg overflow-auto text-left mx-auto">
            <code className="text-xs text-slate-600 font-mono break-all block">
              {this.state.error?.message || "Unknown Error"}
            </code>
          </div>
          <button
            onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
            }}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}