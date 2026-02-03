// Types for the Student Success Compass

export interface StudentInfo {
  name: string;
  intakeYear: string;
  program: string;
}

export interface SectionAResponses {
  A1: number; // Language comfort (1-5)
  A2: number; // Excitement about studies (1-5)
  A3: number; // Stress level (1-5)
  A4: number; // Energy level (1-5)
  A5: number; // Prior academic performance (1-5)
  A6: string[]; // Education system background (multi-select)
}

export interface SectionBResponses {
  // Attention/Focus (B1-B6)
  B1: number;
  B2: number;
  B3: number;
  B4: number;
  B5: number;
  B6: number;
  // Reading/Processing (B7-B11)
  B7: number;
  B8: number;
  B9: number;
  B10: number;
  B11: number;
  // Numerical Processing (B12-B15)
  B12: number;
  B13: number;
  B14: number;
  B15: number;
}

export interface SectionCResponses {
  // Academic Preparedness (C1-C6)
  C1: number;
  C2: number;
  C3: number;
  C4: number;
  C5: number;
  C6: number;
  // Classroom Engagement (C7-C12)
  C7: number;
  C8: number;
  C9: number;
  C10: number;
  C11: number;
  C12: number;
  // Receptivity to Support (C13-C18)
  C13: number;
  C14: number;
  C15: number;
  C16: number;
  C17: number;
  C18: number;
  // Future Orientation (C19-C24)
  C19: number;
  C20: number;
  C21: number;
  C22: number;
  C23: number;
  C24: number;
  // Belonging & Wellbeing (C25-C30)
  C25: number;
  C26: number;
  C27: number;
  C28: number;
  C29: number;
  C30: number;
}

export interface SectionDResponses {
  D1: string;
  D2: string;
  D3: string;
  D4: string;
  D5: string;
  D6: string;
  D7: string;
  D8: string;
  D9: string;
  D10: string;
  D11: string;
  D12: string;
}

export interface SectionEResponses {
  E1: string[]; // Self-identified strengths (multi-select)
  E2: string[]; // Requested support areas (multi-select)
  E3: string; // Support preference
  E4: string; // Communication preference
  E5: string; // Open response - anything to share
  E6: string; // Success vision
}

export interface AllResponses {
  studentInfo: StudentInfo;
  sectionA: SectionAResponses;
  sectionB: SectionBResponses;
  sectionC: SectionCResponses;
  sectionD: SectionDResponses;
  sectionE: SectionEResponses;
}

export type FlagLevel = 'GREEN' | 'YELLOW' | 'RED';

export interface ScoreProfile {
  // Flags
  languageFlag: FlagLevel;
  wellbeingFlag: FlagLevel;
  attentionFlag: FlagLevel;
  readingFlag: FlagLevel;
  numericalProcessingFlag: FlagLevel;
  
  // Raw scores
  wellbeingBaseline: number;
  attentionScore: number;
  readingScore: number;
  numericalProcessingScore: number;
  
  // Engagement domain scores (each out of 30)
  academicPreparedness: number;
  classroomEngagement: number;
  receptivityToSupport: number;
  futureOrientation: number;
  belongingWellbeing: number;
  totalEngagement: number;
  gritIndicator: number;
  
  // Cognitive scores (each out of 4)
  abstractReasoning: number;
  numericalReasoning: number;
  criticalThinking: number;
  totalCognitive: number;
  
  // Self-assessment
  selfIdentifiedStrengths: string[];
  requestedSupport: string[];
  supportPreference: string;
  communicationPreference: string;
  studentNotes: string;
  successVision: string;
}

export interface TestQuestion {
  id: string;
  text: string;
  type: 'scale' | 'multiselect' | 'select' | 'text' | 'cognitive' | 'pattern';
  options?: { value: string | number; label: string }[];
  scaleLabels?: { low: string; high: string };
  timeLimit?: number; // in seconds, for cognitive questions
  correctAnswer?: string; // for cognitive questions
  patternData?: PatternQuestion; // for visual pattern questions
}

export interface PatternQuestion {
  type: 'matrix' | 'sequence';
  grid?: string[][]; // For matrix questions
  sequence?: string[]; // For sequence questions
  options: string[];
  correctIndex: number;
}

export interface TestSection {
  id: string;
  title: string;
  description: string;
  timeEstimate: string;
  instructions?: string;
  questions: TestQuestion[];
  isTimed?: boolean;
  timeLimit?: number; // total section time in seconds
}
