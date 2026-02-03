'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
  sectionName?: string;
}

export default function ProgressBar({ current, total, sectionName }: ProgressBarProps) {
  const progress = (current / total) * 100;
  
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-ink-secondary">
          {sectionName && <span className="text-compass-600">{sectionName}</span>}
        </span>
        <span className="text-sm text-ink-tertiary">
          {current} of {total}
        </span>
      </div>
      <div className="h-2 bg-surface-tertiary rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-compass-500 to-compass-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
