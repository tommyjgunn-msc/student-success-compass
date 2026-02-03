'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTest } from '@/context/TestContext';
import ResultsDisplay from '@/components/ResultsDisplay';
import { Download, RotateCcw } from 'lucide-react';

export default function ResultsPage() {
  const router = useRouter();
  const { studentInfo, getScores, resetTest, isComplete, setIsComplete } = useTest();
  
  // Mark as complete when reaching this page
  useEffect(() => {
    if (studentInfo.name) {
      setIsComplete(true);
    }
  }, [studentInfo.name, setIsComplete]);
  
  // Redirect if no student info
  useEffect(() => {
    if (!studentInfo.name) {
      router.push('/');
    }
  }, [studentInfo.name, router]);
  
  if (!studentInfo.name) {
    return null;
  }
  
  const scores = getScores();
  
  const handleStartOver = () => {
    resetTest();
    router.push('/');
  };
  
  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <ResultsDisplay scores={scores} studentInfo={studentInfo} />
        
        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.print()}
            className="py-3 px-6 rounded-xl border-2 border-compass-500
                     text-compass-600 font-semibold
                     hover:bg-compass-50 transition-colors
                     flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Save / Print Results
          </button>
          
          <button
            onClick={handleStartOver}
            className="py-3 px-6 rounded-xl border-2 border-surface-tertiary
                     text-ink-secondary font-medium
                     hover:bg-surface-secondary transition-colors
                     flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Start New Assessment
          </button>
        </div>
        
        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-ink-muted">
            Your responses have been submitted to your Student Success team. 
            They will review your profile and may reach out based on your preferences.
          </p>
          <p className="text-sm text-ink-muted mt-2">
            © African Leadership College of Higher Education
          </p>
        </div>
      </div>
      
      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
