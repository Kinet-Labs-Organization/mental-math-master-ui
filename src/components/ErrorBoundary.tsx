import type { ReactNode } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { useUserStore } from '../store/useUserStore';
import { supabase } from '../libs/supabaseClient';

interface Props {
  children: ReactNode;
}

function ErrorFallback({ error, resetErrorBoundary }: any) {
  const { removeAuthenticatedUser } = useUserStore.getState();

  const handleGotohome = async () => {
    removeAuthenticatedUser();
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1a1a1a',
        color: '#e5e5e5',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '375px',
          padding: '40px',
          textAlign: 'center',
          backgroundColor: '#2a2a2a',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>😔</div>
        <h1
          style={{
            fontSize: '24px',
            marginBottom: '12px',
            color: '#ffffff',
          }}
        >
          Something went wrong
        </h1>
        <p
          style={{
            color: '#a0a0a0',
            marginBottom: '30px',
            fontSize: '14px',
          }}
        >
          {error?.message || 'An unexpected error occurred'}
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={handleGotohome}
            style={{
              padding: '12px 24px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={e => (e.currentTarget.style.backgroundColor = '#2563eb')}
            onMouseOut={e => (e.currentTarget.style.backgroundColor = '#3b82f6')}
          >
            Go to Home
          </button>
          <button
            onClick={resetErrorBoundary}
            style={{
              padding: '12px 24px',
              backgroundColor: '#404040',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={e => (e.currentTarget.style.backgroundColor = '#525252')}
            onMouseOut={e => (e.currentTarget.style.backgroundColor = '#404040')}
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ErrorBoundary({ children }: Props) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Error caught:', error, errorInfo);
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}
