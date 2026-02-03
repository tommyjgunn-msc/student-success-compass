'use client';

import { motion } from 'framer-motion';
import { TestQuestion } from '@/lib/types';
import PatternQuestion from './PatternQuestion';

interface QuestionCardProps {
  question: TestQuestion;
  value: string | number | string[] | undefined;
  onChange: (value: string | number | string[]) => void;
  questionNumber: number;
  maxSelections?: number;
}

export default function QuestionCard({ 
  question, 
  value, 
  onChange, 
  questionNumber,
  maxSelections = 3 
}: QuestionCardProps) {
  
  // Handle scale questions
  if (question.type === 'scale') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-surface-tertiary"
      >
        <div className="flex gap-3 mb-4">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-compass-100 text-compass-700 flex items-center justify-center text-sm font-semibold">
            {questionNumber}
          </span>
          <p className="text-lg text-ink leading-relaxed">{question.text}</p>
        </div>
        
        <div className="mt-6">
          {question.scaleLabels && (
            <div className="flex justify-between text-sm text-ink-tertiary mb-3 px-1">
              <span>{question.scaleLabels.low}</span>
              <span>{question.scaleLabels.high}</span>
            </div>
          )}
          <div className="flex gap-2 justify-between">
            {question.options?.map((option) => (
              <button
                key={option.value}
                onClick={() => onChange(option.value)}
                className={`
                  flex-1 py-3 px-2 rounded-xl font-medium text-lg transition-all
                  ${value === option.value
                    ? 'bg-compass-500 text-white shadow-md scale-105'
                    : 'bg-surface-secondary text-ink-secondary hover:bg-surface-tertiary'
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }
  
  // Handle select questions
  if (question.type === 'select' || question.type === 'cognitive') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-surface-tertiary"
      >
        <div className="flex gap-3 mb-4">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-compass-100 text-compass-700 flex items-center justify-center text-sm font-semibold">
            {questionNumber}
          </span>
          <p className="text-lg text-ink leading-relaxed whitespace-pre-line">{question.text}</p>
        </div>
        
        <div className="mt-4 space-y-2">
          {question.options?.map((option) => (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`
                w-full text-left p-4 rounded-xl transition-all border-2
                ${value === option.value
                  ? 'border-compass-500 bg-compass-50 text-ink'
                  : 'border-transparent bg-surface-secondary text-ink-secondary hover:bg-surface-tertiary hover:border-surface-tertiary'
                }
              `}
            >
              <span className="font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </motion.div>
    );
  }
  
  // Handle pattern questions
  if (question.type === 'pattern' && question.patternData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-surface-tertiary"
      >
        <div className="flex gap-3 mb-4">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-compass-100 text-compass-700 flex items-center justify-center text-sm font-semibold">
            {questionNumber}
          </span>
          <p className="text-lg text-ink leading-relaxed">{question.text}</p>
        </div>
        
        <PatternQuestion
          patternData={question.patternData}
          options={question.options || []}
          value={value as string}
          onChange={(v) => onChange(v)}
        />
      </motion.div>
    );
  }
  
  // Handle multiselect questions
  if (question.type === 'multiselect') {
    const selectedValues = (value as string[]) || [];
    
    const handleToggle = (optionValue: string) => {
      if (selectedValues.includes(optionValue)) {
        onChange(selectedValues.filter(v => v !== optionValue));
      } else if (selectedValues.length < maxSelections) {
        onChange([...selectedValues, optionValue]);
      }
    };
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-surface-tertiary"
      >
        <div className="flex gap-3 mb-2">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-compass-100 text-compass-700 flex items-center justify-center text-sm font-semibold">
            {questionNumber}
          </span>
          <p className="text-lg text-ink leading-relaxed">{question.text}</p>
        </div>
        
        <p className="text-sm text-ink-tertiary ml-11 mb-4">
          Selected: {selectedValues.length} / {maxSelections}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {question.options?.map((option) => {
            const isSelected = selectedValues.includes(option.value as string);
            const isDisabled = !isSelected && selectedValues.length >= maxSelections;
            
            return (
              <button
                key={option.value}
                onClick={() => handleToggle(option.value as string)}
                disabled={isDisabled}
                className={`
                  text-left p-3 rounded-xl transition-all border-2
                  ${isSelected
                    ? 'border-compass-500 bg-compass-50 text-ink'
                    : isDisabled
                      ? 'border-transparent bg-surface-secondary text-ink-muted cursor-not-allowed opacity-50'
                      : 'border-transparent bg-surface-secondary text-ink-secondary hover:bg-surface-tertiary'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0
                    ${isSelected ? 'border-compass-500 bg-compass-500' : 'border-ink-muted'}
                  `}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm">{option.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>
    );
  }
  
  // Handle text questions
  if (question.type === 'text') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-surface-tertiary"
      >
        <div className="flex gap-3 mb-4">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-compass-100 text-compass-700 flex items-center justify-center text-sm font-semibold">
            {questionNumber}
          </span>
          <p className="text-lg text-ink leading-relaxed">{question.text}</p>
        </div>
        
        <textarea
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your response here..."
          className="w-full p-4 rounded-xl border-2 border-surface-tertiary bg-surface-secondary 
                     focus:border-compass-500 focus:bg-white focus:outline-none
                     text-ink placeholder:text-ink-muted resize-none transition-colors"
          rows={4}
          maxLength={500}
        />
        <p className="text-xs text-ink-muted mt-2 text-right">
          {((value as string) || '').length} / 500
        </p>
      </motion.div>
    );
  }
  
  return null;
}
