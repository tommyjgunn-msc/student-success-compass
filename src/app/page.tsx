'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTest } from '@/context/TestContext';
import { Compass, AlertCircle, Loader2 } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { setStudentInfo, resetTest } = useTest();
  const [name, setName] = useState('');
  const [isOpen, setIsOpen] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState('');
  
  // Check if test is open
  useEffect(() => {
    resetTest(); // Reset any previous test state
    
    async function checkStatus() {
      try {
        const res = await fetch('/api/status');
        const data = await res.json();
        setIsOpen(data.isOpen);
      } catch {
        setError('Unable to connect to server. Please try again later.');
      } finally {
        setIsChecking(false);
      }
    }
    
    checkStatus();
  }, [resetTest]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Please enter your name to continue.');
      return;
    }
    
    setStudentInfo({ name: name.trim() });
    router.push('/intake');
  };
  
  // Loading state
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-compass-500 animate-spin mx-auto mb-4" />
          <p className="text-ink-secondary">Checking availability...</p>
        </div>
      </div>
    );
  }
  
  // Test is closed
  if (isOpen === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-surface-tertiary mb-6">
            <Compass className="w-10 h-10 text-ink-tertiary" />
          </div>
          <h1 className="text-3xl font-display font-bold text-ink mb-4">
            Assessment Currently Closed
          </h1>
          <p className="text-ink-secondary mb-6">
            The Student Success Compass is not accepting responses at this time. 
            Please check back later or contact your Student Success team for more information.
          </p>
          <div className="p-4 rounded-xl bg-surface-secondary text-sm text-ink-tertiary">
            If you believe this is an error, please reach out to your program administrator.
          </div>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-surface relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 pattern-bg pointer-events-none" />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg w-full"
        >
          {/* Logo/Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-compass-400 to-compass-600 shadow-lg mb-6">
              <Compass className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-display font-bold text-ink mb-3">
              Student Success Compass
            </h1>
            <p className="text-lg text-ink-secondary">
              Discover your learning profile in 15 minutes
            </p>
          </div>
          
          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-surface-tertiary">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label 
                  htmlFor="name" 
                  className="block text-sm font-medium text-ink-secondary mb-2"
                >
                  What's your name?
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 rounded-xl border-2 border-surface-tertiary bg-surface-secondary
                           text-ink placeholder:text-ink-muted
                           focus:border-compass-500 focus:bg-white focus:outline-none
                           transition-colors text-lg"
                  autoComplete="name"
                  autoFocus
                />
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-signal-red flex items-center gap-1"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </motion.p>
                )}
              </div>
              
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-compass-500 to-compass-600
                         text-white font-semibold text-lg
                         hover:from-compass-600 hover:to-compass-700
                         focus:outline-none focus:ring-2 focus:ring-compass-500 focus:ring-offset-2
                         transition-all shadow-lg hover:shadow-xl"
              >
                Get Started
              </button>
            </form>
            
            {/* Info */}
            <div className="mt-6 p-4 rounded-xl bg-surface-secondary">
              <p className="text-sm text-ink-secondary leading-relaxed">
                <strong className="text-ink">Before you begin:</strong> This assessment takes 
                approximately 15 minutes and must be completed in one sitting. Please ensure 
                you have uninterrupted time before starting.
              </p>
            </div>
          </div>
          
          {/* Footer */}
          <p className="text-center text-sm text-ink-muted mt-6">
            African Leadership College of Higher Education
          </p>
        </motion.div>
      </div>
    </div>
  );
}
