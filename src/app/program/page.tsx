'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTest } from '@/context/TestContext';
import { ArrowRight, ArrowLeft, AlertCircle, GraduationCap } from 'lucide-react';
import { degreePrograms } from '@/lib/questions';

export default function ProgramPage() {
  const router = useRouter();
  const { studentInfo, setStudentInfo } = useTest();
  const [selectedProgram, setSelectedProgram] = useState('');
  const [error, setError] = useState('');
  
  // Redirect if no name or intake year
  if (!studentInfo.name || !studentInfo.intakeYear) {
    if (typeof window !== 'undefined') {
      router.push('/');
    }
    return null;
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProgram) {
      setError('Please select your degree program to continue.');
      return;
    }
    
    setStudentInfo({ program: selectedProgram });
    router.push('/test');
  };
  
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-growth-100 mb-4">
            <GraduationCap className="w-8 h-8 text-growth-600" />
          </div>
          <h1 className="text-3xl font-display font-bold text-ink mb-3">
            Choose Your Program
          </h1>
          <p className="text-ink-secondary">
            Select the degree program you will be pursuing.
          </p>
        </div>
        
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-surface-tertiary">
          <form onSubmit={handleSubmit}>
            <div className="mb-6 space-y-3">
              {degreePrograms.map((program) => (
                <button
                  key={program.value}
                  type="button"
                  onClick={() => {
                    setSelectedProgram(program.value);
                    setError('');
                  }}
                  className={`
                    w-full text-left p-4 rounded-xl transition-all border-2
                    ${selectedProgram === program.value
                      ? 'border-compass-500 bg-compass-50 shadow-md'
                      : 'border-surface-tertiary bg-surface-secondary hover:border-compass-200 hover:bg-surface-tertiary'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                      ${selectedProgram === program.value 
                        ? 'border-compass-500 bg-compass-500' 
                        : 'border-ink-muted'
                      }
                    `}>
                      {selectedProgram === program.value && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <span className={`font-medium ${
                      selectedProgram === program.value ? 'text-ink' : 'text-ink-secondary'
                    }`}>
                      {program.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 text-sm text-signal-red flex items-center gap-1"
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.p>
            )}
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.push('/intake')}
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
                Begin Assessment
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
        
        {/* Progress indicator */}
        <div className="mt-6 flex justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-compass-500" />
          <div className="w-2 h-2 rounded-full bg-compass-500" />
          <div className="w-2 h-2 rounded-full bg-surface-tertiary" />
        </div>
      </motion.div>
    </div>
  );
}
