'use client';

import { motion } from 'framer-motion';
import { ScoreProfile, FlagLevel, StudentInfo } from '@/lib/types';
import { 
  getEngagementInterpretation, 
  getFlagInterpretation, 
  getCognitiveInterpretation,
  generateRecommendations 
} from '@/lib/scoring';
import { 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle,
  Brain,
  Heart,
  Target,
  Users,
  Sparkles,
  BookOpen,
  Calculator,
  MessageSquare
} from 'lucide-react';

interface ResultsDisplayProps {
  scores: ScoreProfile;
  studentInfo: StudentInfo;
}

function FlagIndicator({ flag, label }: { flag: FlagLevel; label: string }) {
  const config = {
    GREEN: {
      bg: 'bg-signal-green-bg',
      border: 'border-signal-green/20',
      text: 'text-signal-green',
      icon: CheckCircle2,
      label: 'No concerns',
    },
    YELLOW: {
      bg: 'bg-signal-yellow-bg',
      border: 'border-signal-yellow/20',
      text: 'text-signal-yellow',
      icon: AlertCircle,
      label: 'May benefit from support',
    },
    RED: {
      bg: 'bg-signal-red-bg',
      border: 'border-signal-red/20',
      text: 'text-signal-red',
      icon: AlertTriangle,
      label: 'Recommend follow-up',
    },
  };
  
  const { bg, border, text, icon: Icon, label: statusLabel } = config[flag];
  
  return (
    <div className={`flex items-center justify-between p-3 rounded-lg ${bg} border ${border}`}>
      <span className="text-sm font-medium text-ink-secondary">{label}</span>
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${text}`} />
        <span className={`text-sm font-medium ${text}`}>{statusLabel}</span>
      </div>
    </div>
  );
}

function EngagementDomain({ 
  label, 
  score, 
  icon: Icon,
  color 
}: { 
  label: string; 
  score: number; 
  icon: React.ElementType;
  color: string;
}) {
  const { level, narrative } = getEngagementInterpretation(score, label);
  const percentage = Math.round((score / 30) * 100);
  
  return (
    <div className="p-4 rounded-xl bg-white border border-surface-tertiary">
      <div className="flex items-start gap-3 mb-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-ink">{label}</h4>
            <span className="text-sm font-medium text-ink-secondary">
              {score}/30 ({percentage}%)
            </span>
          </div>
          <span className={`
            text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block
            ${level === 'Strong' ? 'bg-signal-green-bg text-signal-green' :
              level === 'Solid Foundation' ? 'bg-compass-100 text-compass-700' :
              'bg-signal-yellow-bg text-signal-yellow'}
          `}>
            {level}
          </span>
        </div>
      </div>
      <div className="w-full bg-surface-tertiary rounded-full h-2 mb-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`h-2 rounded-full ${
            level === 'Strong' ? 'bg-signal-green' :
            level === 'Solid Foundation' ? 'bg-compass-500' :
            'bg-signal-yellow'
          }`}
        />
      </div>
      <p className="text-sm text-ink-secondary">{narrative}</p>
    </div>
  );
}

function CognitiveScore({ label, score, total, icon: Icon }: { 
  label: string; 
  score: number; 
  total: number;
  icon: React.ElementType;
}) {
  const percentage = Math.round((score / total) * 100);
  const interpretation = getCognitiveInterpretation(score, total, label);
  
  return (
    <div className="p-4 rounded-xl bg-white border border-surface-tertiary">
      <div className="flex items-center gap-3 mb-2">
        <Icon className="w-5 h-5 text-compass-500" />
        <h4 className="font-semibold text-ink">{label}</h4>
      </div>
      <div className="flex items-end gap-2 mb-2">
        <span className="text-3xl font-bold text-ink">{score}</span>
        <span className="text-lg text-ink-tertiary">/ {total}</span>
      </div>
      <div className="w-full bg-surface-tertiary rounded-full h-2 mb-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="h-2 rounded-full bg-growth-500"
        />
      </div>
      <p className="text-sm text-ink-secondary">{interpretation}</p>
    </div>
  );
}

export default function ResultsDisplay({ scores, studentInfo }: ResultsDisplayProps) {
  const recommendations = generateRecommendations(scores);
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-compass-100 mb-4">
          <Sparkles className="w-8 h-8 text-compass-600" />
        </div>
        <h1 className="text-3xl font-display font-bold text-ink mb-2">
          Your Learning Compass
        </h1>
        <p className="text-ink-secondary max-w-xl mx-auto">
          Welcome, <span className="font-semibold">{studentInfo.name}</span>. 
          This report reflects your responses from today's session. It's a starting point for understanding your learning profile — not a final verdict on your abilities.
        </p>
      </motion.div>
      
      {/* Quick Indicators */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-xl font-semibold text-ink mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-compass-500" />
          Support Indicators
        </h2>
        <p className="text-sm text-ink-secondary mb-4">
          These indicators help identify areas where you might benefit from additional resources or support.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FlagIndicator flag={scores.languageFlag} label="Academic English" />
          <FlagIndicator flag={scores.wellbeingFlag} label="Current Wellbeing" />
          <FlagIndicator flag={scores.attentionFlag} label="Focus & Attention" />
          <FlagIndicator flag={scores.readingFlag} label="Reading & Processing" />
          <FlagIndicator flag={scores.numericalProcessingFlag} label="Numerical Processing" />
        </div>
        
        {/* Show interpretations for non-green flags */}
        {(scores.languageFlag !== 'GREEN' || 
          scores.wellbeingFlag !== 'GREEN' || 
          scores.attentionFlag !== 'GREEN' || 
          scores.readingFlag !== 'GREEN' || 
          scores.numericalProcessingFlag !== 'GREEN') && (
          <div className="mt-4 p-4 rounded-xl bg-surface-secondary">
            <h3 className="font-medium text-ink mb-2">What this means</h3>
            <div className="space-y-2 text-sm text-ink-secondary">
              {scores.languageFlag !== 'GREEN' && (
                <p>• <strong>Academic English:</strong> {getFlagInterpretation(scores.languageFlag, 'Language')}</p>
              )}
              {scores.wellbeingFlag !== 'GREEN' && (
                <p>• <strong>Wellbeing:</strong> {getFlagInterpretation(scores.wellbeingFlag, 'Wellbeing')}</p>
              )}
              {scores.attentionFlag !== 'GREEN' && (
                <p>• <strong>Focus:</strong> {getFlagInterpretation(scores.attentionFlag, 'Attention')}</p>
              )}
              {scores.readingFlag !== 'GREEN' && (
                <p>• <strong>Reading:</strong> {getFlagInterpretation(scores.readingFlag, 'Reading')}</p>
              )}
              {scores.numericalProcessingFlag !== 'GREEN' && (
                <p>• <strong>Numerical:</strong> {getFlagInterpretation(scores.numericalProcessingFlag, 'Numerical')}</p>
              )}
            </div>
          </div>
        )}
      </motion.section>
      
      {/* Engagement Profile */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold text-ink mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-compass-500" />
          Engagement Profile
        </h2>
        <p className="text-sm text-ink-secondary mb-4">
          Your overall engagement score is <strong>{scores.totalEngagement}/150</strong>. 
          Here's how it breaks down across five key domains.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <EngagementDomain 
            label="Academic Preparedness" 
            score={scores.academicPreparedness}
            icon={BookOpen}
            color="bg-compass-500"
          />
          <EngagementDomain 
            label="Classroom Engagement" 
            score={scores.classroomEngagement}
            icon={MessageSquare}
            color="bg-growth-600"
          />
          <EngagementDomain 
            label="Receptivity to Support" 
            score={scores.receptivityToSupport}
            icon={Users}
            color="bg-purple-500"
          />
          <EngagementDomain 
            label="Future Orientation" 
            score={scores.futureOrientation}
            icon={Target}
            color="bg-amber-500"
          />
          <EngagementDomain 
            label="Belonging & Wellbeing" 
            score={scores.belongingWellbeing}
            icon={Heart}
            color="bg-rose-500"
          />
        </div>
        
        {/* Grit indicator */}
        <div className="mt-4 p-4 rounded-xl bg-compass-50 border border-compass-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-ink">Grit Indicator</h4>
              <p className="text-sm text-ink-secondary">Perseverance and consistency of interest</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-compass-700">{scores.gritIndicator}</span>
              <span className="text-ink-tertiary">/30</span>
            </div>
          </div>
        </div>
      </motion.section>
      
      {/* Thinking Patterns */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-xl font-semibold text-ink mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-compass-500" />
          Thinking Patterns
        </h2>
        <p className="text-sm text-ink-secondary mb-4">
          These scores reflect a brief snapshot of your reasoning approaches. 
          Total score: <strong>{scores.totalCognitive}/12</strong>
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CognitiveScore 
            label="Abstract Reasoning" 
            score={scores.abstractReasoning}
            total={4}
            icon={Sparkles}
          />
          <CognitiveScore 
            label="Numerical Reasoning" 
            score={scores.numericalReasoning}
            total={4}
            icon={Calculator}
          />
          <CognitiveScore 
            label="Critical Thinking" 
            score={scores.criticalThinking}
            total={4}
            icon={Brain}
          />
        </div>
      </motion.section>
      
      {/* Self-Assessment */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-xl font-semibold text-ink mb-4">Your Self-Assessment</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-signal-green-bg border border-signal-green/20">
            <h4 className="font-semibold text-signal-green mb-2">Your Identified Strengths</h4>
            <div className="flex flex-wrap gap-2">
              {scores.selfIdentifiedStrengths.map((strength) => (
                <span key={strength} className="px-3 py-1 bg-white rounded-full text-sm text-ink">
                  {strength.replace(/-/g, ' ')}
                </span>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-compass-50 border border-compass-200">
            <h4 className="font-semibold text-compass-700 mb-2">Areas You'd Like Support</h4>
            <div className="flex flex-wrap gap-2">
              {scores.requestedSupport.map((area) => (
                <span key={area} className="px-3 py-1 bg-white rounded-full text-sm text-ink">
                  {area.replace(/-/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Success vision */}
        {scores.successVision && (
          <div className="mt-4 p-4 rounded-xl bg-surface-secondary">
            <h4 className="font-medium text-ink mb-2">Your Success Vision</h4>
            <p className="text-ink-secondary italic">"{scores.successVision}"</p>
          </div>
        )}
      </motion.section>
      
      {/* Recommendations */}
      {recommendations.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-ink mb-4">Suggested Next Steps</h2>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div 
                key={index}
                className={`p-4 rounded-xl border ${
                  rec.priority === 'HIGH' 
                    ? 'bg-signal-red-bg border-signal-red/20' 
                    : 'bg-surface-secondary border-surface-tertiary'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`
                    px-2 py-0.5 rounded text-xs font-semibold
                    ${rec.priority === 'HIGH' ? 'bg-signal-red text-white' : 'bg-compass-200 text-compass-800'}
                  `}>
                    {rec.priority}
                  </span>
                  <div>
                    <h4 className="font-semibold text-ink">{rec.domain}</h4>
                    <p className="text-sm text-ink-secondary">{rec.action}</p>
                    <p className="text-sm text-compass-600 mt-1">Resource: {rec.resource}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      )}
      
      {/* Closing */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center p-6 rounded-2xl bg-gradient-to-br from-compass-50 to-growth-50 border border-compass-200"
      >
        <p className="text-ink-secondary max-w-xl mx-auto">
          <strong>Remember:</strong> This is a compass, not a map. It points in useful directions, 
          but you're the one navigating your journey. Your potential isn't captured in any 
          assessment — it unfolds through what you do next.
        </p>
      </motion.div>
    </div>
  );
}
