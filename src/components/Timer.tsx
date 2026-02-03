'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle } from 'lucide-react';

interface TimerProps {
  duration: number; // in seconds
  onTimeUp: () => void;
  isRunning: boolean;
}

export default function Timer({ duration, onTimeUp, isRunning }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  
  useEffect(() => {
    if (!isRunning) return;
    
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }
    
    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timeLeft, isRunning, onTimeUp]);
  
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = (timeLeft / duration) * 100;
  const isLow = timeLeft <= 60;
  const isCritical = timeLeft <= 30;
  
  return (
    <div className={`
      fixed top-4 right-4 z-50 
      flex items-center gap-3 
      px-4 py-3 rounded-xl 
      shadow-lg border
      ${isCritical 
        ? 'bg-signal-red-bg border-signal-red/30' 
        : isLow 
          ? 'bg-signal-yellow-bg border-signal-yellow/30'
          : 'bg-white border-surface-tertiary'
      }
    `}>
      <div className="relative">
        <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-surface-tertiary"
          />
          <motion.circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={100}
            strokeDashoffset={100 - progress}
            strokeLinecap="round"
            className={isCritical ? 'text-signal-red' : isLow ? 'text-signal-yellow' : 'text-compass-500'}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {isCritical ? (
            <AlertTriangle className="w-4 h-4 text-signal-red" />
          ) : (
            <Clock className={`w-4 h-4 ${isLow ? 'text-signal-yellow' : 'text-compass-500'}`} />
          )}
        </div>
      </div>
      <div className="text-right">
        <div className={`
          text-2xl font-mono font-bold tracking-tight
          ${isCritical ? 'text-signal-red' : isLow ? 'text-signal-yellow' : 'text-ink'}
        `}>
          {minutes}:{seconds.toString().padStart(2, '0')}
        </div>
        <div className="text-xs text-ink-tertiary">remaining</div>
      </div>
    </div>
  );
}
