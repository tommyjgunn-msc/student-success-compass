'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Lock, Unlock, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';

function AdminContent() {
  const searchParams = useSearchParams();
  const key = searchParams.get('key');
  
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [testStatus, setTestStatus] = useState<'open' | 'closed' | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  // Check authorization and get status
  useEffect(() => {
    async function checkAuth() {
      if (!key) {
        setIsLoading(false);
        return;
      }
      
      try {
        const res = await fetch(`/api/status?key=${encodeURIComponent(key)}`);
        const data = await res.json();
        
        if (data.authorized) {
          setIsAuthorized(true);
          setTestStatus(data.isOpen ? 'open' : 'closed');
        }
      } catch {
        setError('Failed to connect to server');
      } finally {
        setIsLoading(false);
      }
    }
    
    checkAuth();
  }, [key]);
  
  // Toggle test status
  const handleToggle = async () => {
    if (!key) return;
    
    setIsToggling(true);
    setMessage('');
    setError('');
    
    const newStatus = testStatus === 'open' ? 'closed' : 'open';
    
    try {
      const res = await fetch('/api/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, status: newStatus }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setTestStatus(newStatus);
        setMessage(`Test is now ${newStatus.toUpperCase()}`);
      } else {
        setError(data.error || 'Failed to toggle status');
      }
    } catch {
      setError('Failed to connect to server');
    } finally {
      setIsToggling(false);
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-compass-500 animate-spin" />
      </div>
    );
  }
  
  // Unauthorized
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-signal-red-bg mb-6">
            <Shield className="w-10 h-10 text-signal-red" />
          </div>
          <h1 className="text-3xl font-display font-bold text-ink mb-4">
            Access Denied
          </h1>
          <p className="text-ink-secondary mb-6">
            {!key 
              ? 'This page requires an admin key. Please include the key in the URL.'
              : 'Invalid admin key. Access denied.'
            }
          </p>
          <div className="p-4 rounded-xl bg-surface-secondary text-sm text-ink-tertiary">
            <code className="font-mono">/admin?key=your-secret-key</code>
          </div>
        </motion.div>
      </div>
    );
  }
  
  // Admin panel
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-compass-100 mb-4">
            <Shield className="w-8 h-8 text-compass-600" />
          </div>
          <h1 className="text-3xl font-display font-bold text-ink mb-2">
            Admin Panel
          </h1>
          <p className="text-ink-secondary">
            Control the Student Success Compass assessment portal
          </p>
        </div>
        
        {/* Status Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-surface-tertiary">
          {/* Current Status */}
          <div className={`
            p-6 rounded-2xl mb-6 text-center
            ${testStatus === 'open' 
              ? 'bg-signal-green-bg border border-signal-green/20' 
              : 'bg-signal-red-bg border border-signal-red/20'
            }
          `}>
            <div className={`
              inline-flex items-center justify-center w-12 h-12 rounded-full mb-3
              ${testStatus === 'open' ? 'bg-signal-green/20' : 'bg-signal-red/20'}
            `}>
              {testStatus === 'open' ? (
                <Unlock className={`w-6 h-6 text-signal-green`} />
              ) : (
                <Lock className={`w-6 h-6 text-signal-red`} />
              )}
            </div>
            <h2 className={`text-2xl font-bold ${
              testStatus === 'open' ? 'text-signal-green' : 'text-signal-red'
            }`}>
              {testStatus === 'open' ? 'Portal Open' : 'Portal Closed'}
            </h2>
            <p className={`text-sm mt-1 ${
              testStatus === 'open' ? 'text-signal-green/80' : 'text-signal-red/80'
            }`}>
              {testStatus === 'open' 
                ? 'Students can currently take the assessment' 
                : 'Students cannot access the assessment'
              }
            </p>
          </div>
          
          {/* Toggle Button */}
          <button
            onClick={handleToggle}
            disabled={isToggling}
            className={`
              w-full py-4 px-6 rounded-xl font-semibold text-lg
              transition-all flex items-center justify-center gap-2
              ${isToggling
                ? 'bg-surface-tertiary text-ink-muted cursor-not-allowed'
                : testStatus === 'open'
                  ? 'bg-signal-red text-white hover:bg-signal-red/90'
                  : 'bg-signal-green text-white hover:bg-signal-green/90'
              }
            `}
          >
            {isToggling ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Updating...
              </>
            ) : testStatus === 'open' ? (
              <>
                <Lock className="w-5 h-5" />
                Close Portal
              </>
            ) : (
              <>
                <Unlock className="w-5 h-5" />
                Open Portal
              </>
            )}
          </button>
          
          {/* Messages */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-xl bg-signal-green-bg border border-signal-green/20 
                       flex items-center gap-2 text-signal-green"
            >
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              {message}
            </motion.div>
          )}
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-xl bg-signal-red-bg border border-signal-red/20 
                       flex items-center gap-2 text-signal-red"
            >
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              {error}
            </motion.div>
          )}
        </div>
        
        {/* Info */}
        <div className="mt-6 p-4 rounded-xl bg-surface-secondary">
          <p className="text-sm text-ink-secondary">
            <strong className="text-ink">Note:</strong> When the portal is closed, 
            students will see a message that the assessment is not available. 
            Existing responses in the Google Sheet are not affected.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-compass-500 animate-spin" />
      </div>
    }>
      <AdminContent />
    </Suspense>
  );
}
