'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTest } from '@/context/TestContext';
import { allSections } from '@/lib/questions';
import ProgressBar from '@/components/ProgressBar';
import QuestionCard from '@/components/QuestionCard';
import Timer from '@/components/Timer';
import { ArrowRight, ArrowLeft, Clock, AlertTriangle, Loader2 } from 'lucide-react';

export default function TestPage() {
  const router = useRouter();
  const {
    studentInfo,
    sectionA,
    sectionB,
    sectionC,
    sectionD,
    sectionE,
    updateSectionA,
    updateSectionB,
    updateSectionC,
    updateSectionD,
    updateSectionE,
    getAllResponses,
    getScores,
  } = useTest();
  
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showSectionIntro, setShowSectionIntro] = useState(true);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const currentSection = allSections[currentSectionIndex];
  const currentQuestion = currentSection?.questions[currentQuestionIndex];
  const totalQuestions = allSections.reduce((acc, s) => acc + s.questions.length, 0);
  const completedQuestions = allSections
    .slice(0, currentSectionIndex)
    .reduce((acc, s) => acc + s.questions.length, 0) + currentQuestionIndex;
  
  // Redirect if no student info
  useEffect(() => {
    if (!studentInfo.name || !studentInfo.intakeYear || !studentInfo.program) {
      router.push('/');
    }
  }, [studentInfo, router]);
  
  // Get current response value
  const getCurrentValue = useCallback(() => {
    if (!currentQuestion) return undefined;
    const id = currentQuestion.id;
    
    if (id.startsWith('A')) {
      return (sectionA as Record<string, unknown>)[id];
    } else if (id.startsWith('B')) {
      return (sectionB as Record<string, unknown>)[id];
    } else if (id.startsWith('C')) {
      return (sectionC as Record<string, unknown>)[id];
    } else if (id.startsWith('D')) {
      return (sectionD as Record<string, unknown>)[id];
    } else if (id.startsWith('E')) {
      return (sectionE as Record<string, unknown>)[id];
    }
    return undefined;
  }, [currentQuestion, sectionA, sectionB, sectionC, sectionD, sectionE]);
  
  // Handle response update
  const handleResponse = useCallback((value: string | number | string[]) => {
    if (!currentQuestion) return;
    const id = currentQuestion.id;
    
    if (id.startsWith('A')) {
      updateSectionA({ [id]: value } as Record<string, unknown>);
    } else if (id.startsWith('B')) {
      updateSectionB({ [id]: value } as Record<string, unknown>);
    } else if (id.startsWith('C')) {
      updateSectionC({ [id]: value } as Record<string, unknown>);
    } else if (id.startsWith('D')) {
      updateSectionD({ [id]: value } as Record<string, unknown>);
    } else if (id.startsWith('E')) {
      updateSectionE({ [id]: value } as Record<string, unknown>);
    }
  }, [currentQuestion, updateSectionA, updateSectionB, updateSectionC, updateSectionD, updateSectionE]);
  
  // Check if current question has an answer
  const hasAnswer = useCallback(() => {
    const value = getCurrentValue();
    if (value === undefined || value === null) return false;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'string') return value.trim() !== '';
    return true;
  }, [getCurrentValue]);
  
  // Check if current question is optional (text questions in section E)
  const isOptional = currentQuestion?.type === 'text' && currentQuestion.id.startsWith('E');
  
  // Handle next
  const handleNext = useCallback(async () => {
    // If on last question of last section, submit
    if (currentSectionIndex === allSections.length - 1 && 
        currentQuestionIndex === currentSection.questions.length - 1) {
      // Submit results
      setIsSubmitting(true);
      setSubmitError('');
      
      try {
        const responses = getAllResponses();
        const scores = getScores();
        
        const res = await fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ responses, scores }),
        });
        
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to submit');
        }
        
        router.push('/results');
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : 'Failed to submit. Please try again.');
        setIsSubmitting(false);
      }
      return;
    }
    
    // If on last question of current section, move to next section intro
    if (currentQuestionIndex === currentSection.questions.length - 1) {
      setCurrentSectionIndex(prev => prev + 1);
      setCurrentQuestionIndex(0);
      setShowSectionIntro(true);
      setIsTimerRunning(false);
    } else {
      // Move to next question
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentSectionIndex, currentQuestionIndex, currentSection, getAllResponses, getScores, router]);
  
  // Handle previous
  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else if (currentSectionIndex > 0) {
      // Go back to previous section
      const prevSection = allSections[currentSectionIndex - 1];
      setCurrentSectionIndex(prev => prev - 1);
      setCurrentQuestionIndex(prevSection.questions.length - 1);
      setShowSectionIntro(false);
    }
  }, [currentQuestionIndex, currentSectionIndex]);
  
  // Handle time up
  const handleTimeUp = useCallback(() => {
    setIsTimerRunning(false);
    // Move to next section if in timed section
    if (currentSection.isTimed) {
      if (currentSectionIndex < allSections.length - 1) {
        setCurrentSectionIndex(prev => prev + 1);
        setCurrentQuestionIndex(0);
        setShowSectionIntro(true);
      }
    }
  }, [currentSection?.isTimed, currentSectionIndex]);
  
  // Start section (hide intro, possibly start timer)
  const startSection = () => {
    setShowSectionIntro(false);
    if (currentSection.isTimed) {
      setIsTimerRunning(true);
    }
  };
  
  if (!studentInfo.name) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-surface">
      {/* Timer for timed sections */}
      {currentSection?.isTimed && isTimerRunning && !showSectionIntro && (
        <Timer
          duration={currentSection.timeLimit || 300}
          onTimeUp={handleTimeUp}
          isRunning={isTimerRunning}
        />
      )}
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress */}
        <ProgressBar
          current={completedQuestions + 1}
          total={totalQuestions}
          sectionName={`Section ${currentSection?.id}: ${currentSection?.title}`}
        />
        
        <AnimatePresence mode="wait">
          {/* Section Intro */}
          {showSectionIntro && currentSection && (
            <motion.div
              key={`intro-${currentSection.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-3xl shadow-xl p-8 border border-surface-tertiary"
            >
              <div className="text-center mb-6">
                <div className={`
                  inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4
                  ${currentSection.isTimed ? 'bg-amber-100' : 'bg-compass-100'}
                `}>
                  {currentSection.isTimed ? (
                    <Clock className="w-8 h-8 text-amber-600" />
                  ) : (
                    <span className="text-3xl font-display font-bold text-compass-600">
                      {currentSection.id}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-display font-bold text-ink mb-2">
                  {currentSection.title}
                </h2>
                <p className="text-ink-secondary">
                  {currentSection.description}
                </p>
              </div>
              
              {/* Time estimate */}
              <div className="flex items-center justify-center gap-2 text-ink-tertiary mb-6">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Estimated time: {currentSection.timeEstimate}</span>
              </div>
              
              {/* Instructions */}
              {currentSection.instructions && (
                <div className="p-4 rounded-xl bg-surface-secondary mb-6">
                  <p className="text-sm text-ink-secondary">
                    {currentSection.instructions}
                  </p>
                </div>
              )}
              
              {/* Timed section warning */}
              {currentSection.isTimed && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 mb-6">
                  <div className="flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-amber-800">Timed Section</p>
                      <p className="text-sm text-amber-700">
                        You will have {Math.floor((currentSection.timeLimit || 300) / 60)} minutes 
                        to complete this section. The timer will start when you click "Start Section". 
                        It's normal not to finish all questions.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <button
                onClick={startSection}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-compass-500 to-compass-600
                         text-white font-semibold text-lg
                         hover:from-compass-600 hover:to-compass-700
                         focus:outline-none focus:ring-2 focus:ring-compass-500 focus:ring-offset-2
                         transition-all shadow-lg hover:shadow-xl"
              >
                {currentSection.isTimed ? 'Start Timed Section' : 'Start Section'}
              </button>
            </motion.div>
          )}
          
          {/* Question */}
          {!showSectionIntro && currentQuestion && (
            <motion.div
              key={`question-${currentQuestion.id}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <QuestionCard
                question={currentQuestion}
                value={getCurrentValue() as string | number | string[] | undefined}
                onChange={handleResponse}
                questionNumber={currentQuestionIndex + 1}
              />
              
              {/* Submit error */}
              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 rounded-xl bg-signal-red-bg border border-signal-red/20 text-signal-red"
                >
                  {submitError}
                </motion.div>
              )}
              
              {/* Navigation */}
              <div className="mt-6 flex gap-3">
                {/* Back button - hidden on first question of first section or in timed sections */}
                {(currentQuestionIndex > 0 || currentSectionIndex > 0) && !currentSection.isTimed && (
                  <button
                    onClick={handlePrevious}
                    className="py-3 px-4 rounded-xl border-2 border-surface-tertiary
                             text-ink-secondary font-medium
                             hover:bg-surface-secondary hover:border-compass-200
                             transition-colors flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                )}
                
                {/* Next/Submit button */}
                <button
                  onClick={handleNext}
                  disabled={(!hasAnswer() && !isOptional) || isSubmitting}
                  className={`
                    flex-1 py-3 px-6 rounded-xl font-semibold
                    transition-all flex items-center justify-center gap-2
                    ${(!hasAnswer() && !isOptional) || isSubmitting
                      ? 'bg-surface-tertiary text-ink-muted cursor-not-allowed'
                      : 'bg-gradient-to-r from-compass-500 to-compass-600 text-white hover:from-compass-600 hover:to-compass-700 shadow-md hover:shadow-lg'
                    }
                  `}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : currentSectionIndex === allSections.length - 1 && 
                       currentQuestionIndex === currentSection.questions.length - 1 ? (
                    <>
                      Complete Assessment
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      {isOptional && !hasAnswer() ? 'Skip' : 'Next'}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
              
              {/* Question counter for section */}
              <p className="text-center text-sm text-ink-muted mt-4">
                Question {currentQuestionIndex + 1} of {currentSection.questions.length} in this section
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
