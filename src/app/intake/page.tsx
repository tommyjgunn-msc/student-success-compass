'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTest } from '@/context/TestContext';
import { ArrowRight, ArrowLeft, AlertCircle, HelpCircle } from 'lucide-react';

export default function IntakePage() {
  const router = useRouter();
  const { studentInfo, setStudentInfo } = useTest();
  const [intakeYear, setIntakeYear] = useState('');
  const [error, setError] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  
  // Redirect if no name
  if (!studentInfo.name) {
    if (typeof window !== 'undefined') {
      router.push('/');
    }
    return null;
  }
  
  // Validate intake year format (F or O followed by 2 digits)
  const validateIntakeYear = (value: string): boolean => {
    const pattern = /^[FO]\d{2}$/i;
    return pattern.test(value);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const normalized = intakeYear.toUpperCase();
    
    if (!validateIntakeYear(normalized)) {
      setError('Please enter a valid intake year (e.g., F24, O25)');
      return;
    }
    
    setStudentInfo({ intakeYear: normalized });
    router.push('/program');
  };
  
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full"
      >
        {/* Welcome message */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-ink mb-3">
            Welcome, {studentInfo.name}!
          </h1>
          <p className="text-ink-secondary">
            Let's get a bit more information before we begin.
          </p>
        </div>
        
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-surface-tertiary">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label 
                  htmlFor="intakeYear" 
                  className="block text-sm font-medium text-ink-secondary"
                >
                  What is your intake year?
                </label>
                <button
                  type="button"
                  onClick={() => setShowHelp(!showHelp)}
                  className="text-ink-tertiary hover:text-ink-secondary transition-colors"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
              </div>
              
              {showHelp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-3 p-3 rounded-lg bg-compass-50 text-sm text-compass-800"
                >
                  <p className="font-medium mb-1">Format: Letter + Year</p>
                  <ul className="text-compass-700 space-y-1">
                    <li>• <strong>F</strong> = Foundation year (e.g., F24)</li>
                    <li>• <strong>O</strong> = Other intake (e.g., O25)</li>
                    <li>• Number = Last two digits of year</li>
                  </ul>
                </motion.div>
              )}
              
              <input
                type="text"
                id="intakeYear"
                value={intakeYear}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();
                  // Only allow valid characters and limit length
                  if (/^[FO]?\d{0,2}$/i.test(value) || value === '') {
                    setIntakeYear(value);
                    setError('');
                  }
                }}
                placeholder="e.g., F24"
                maxLength={3}
                className="w-full px-4 py-3 rounded-xl border-2 border-surface-tertiary bg-surface-secondary
                         text-ink placeholder:text-ink-muted
                         focus:border-compass-500 focus:bg-white focus:outline-none
                         transition-colors text-lg uppercase tracking-wider font-mono"
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
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="flex-1 py-3 px-4 rounded-xl border-2 border-surface-tertiary
                         text-ink-secondary font-medium
                         hover:bg-surface-secondary hover:border-compass-200
                         transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                type="submit"
                className="flex-[2] py-3 px-6 rounded-xl bg-gradient-to-r from-compass-500 to-compass-600
                         text-white font-semibold
                         hover:from-compass-600 hover:to-compass-700
                         focus:outline-none focus:ring-2 focus:ring-compass-500 focus:ring-offset-2
                         transition-all flex items-center justify-center gap-2"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
        
        {/* Progress indicator */}
        <div className="mt-6 flex justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-compass-500" />
          <div className="w-2 h-2 rounded-full bg-surface-tertiary" />
          <div className="w-2 h-2 rounded-full bg-surface-tertiary" />
        </div>
      </motion.div>
    </div>
  );
}
