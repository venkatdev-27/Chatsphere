
import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4 text-center">
                    <h1 className="text-3xl font-bold mb-4 text-red-500">Something went wrong.</h1>
                    <p className="mb-4 text-gray-300">We apologize for the inconvenience. Please refresh the page or try again later.</p>
                    <details className="mt-4 p-4 bg-slate-800 rounded text-left overflow-auto max-w-full text-xs text-gray-400 font-mono">
                        <summary className="cursor-pointer mb-2">Error Details</summary>
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </details>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                    >
                        Refresh Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
