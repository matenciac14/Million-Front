/** @format */

"use client";

import React from "react";
import { Button } from "./Button";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error!} retry={this.retry} />;
    }

    return this.props.children;
  }
}

// Componente de error por defecto
const DefaultErrorFallback: React.FC<{ error: Error; retry: () => void }> = ({
  error,
  retry,
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
      <div className="flex items-center mb-4">
        <svg
          className="h-6 w-6 text-red-600 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <h2 className="text-lg font-semibold text-gray-900">Algo salió mal</h2>
      </div>
      <p className="text-gray-600 mb-4">
        Ha ocurrido un error inesperado en la aplicación.
      </p>
      <details className="mb-4">
        <summary className="text-sm text-gray-500 cursor-pointer">
          Ver detalles técnicos
        </summary>
        <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
          {error.message}
        </pre>
      </details>
      <div className="flex space-x-3">
        <Button onClick={retry} className="flex-1">
          Reintentar
        </Button>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="flex-1"
        >
          Recargar página
        </Button>
      </div>
    </div>
  </div>
);

// Hook para manejo de errores asincrónicos
export const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const handleError = React.useCallback((error: unknown) => {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    setError(errorObj);
    console.error("Error handled:", errorObj);
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { handleError, clearError, error };
};
