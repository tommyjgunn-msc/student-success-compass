import { AllResponses, ScoreProfile, FlagLevel } from './types';

// Answer key for Section D
const sectionDAnswers: Record<string, string> = {
  D1: 'B', // 162 (multiply by 3)
  D2: 'B', // ■ (Latin square)
  D3: 'A', // EV (letter pairs)
  D4: 'A', // △▲▲ (progressive fill)
  D5: 'C', // $60
  D6: 'A', // 9 days
  D7: 'B', // 25%
  D8: 'B', // 315 km
  D9: 'B', // Confounding variables
  D10: 'B', // Affirming the consequent
  D11: 'B', // Methodology questions
  D12: 'C', // Reverse causation
};

// Helper to determine flag level based on thresholds
function getFlag(score: number, yellowThreshold: number, redThreshold: number): FlagLevel {
  if (score >= redThreshold) return 'RED';
  if (score >= yellowThreshold) return 'YELLOW';
  return 'GREEN';
}

// Calculate wellbeing baseline (A3 is reversed because high stress is bad)
function calculateWellbeingBaseline(a2: number, a3: number, a4: number): number {
  // A3 is reversed (high stress = low wellbeing)
  const a3Reversed = 6 - a3;
  return (a2 + a3Reversed + a4) / 15; // Returns 0.2-1.0
}

// Sum helper
function sum(values: number[]): number {
  return values.reduce((acc, val) => acc + (val || 0), 0);
}

// Count correct answers in Section D
function countCorrect(responses: Record<string, string>, keys: string[]): number {
  return keys.filter(key => responses[key] === sectionDAnswers[key]).length;
}

export function calculateScores(responses: AllResponses): ScoreProfile {
  const { sectionA, sectionB, sectionC, sectionD, sectionE } = responses;
  
  // ============================
  // SECTION A CALCULATIONS
  // ============================
  
  // Language flag (A1: 1-2 = GREEN, 3 = YELLOW, 4-5 = RED)
  const languageFlag: FlagLevel = sectionA.A1 >= 4 ? 'RED' : sectionA.A1 >= 3 ? 'YELLOW' : 'GREEN';
  
  // Wellbeing baseline
  const wellbeingBaseline = calculateWellbeingBaseline(sectionA.A2, sectionA.A3, sectionA.A4);
  const wellbeingFlag: FlagLevel = wellbeingBaseline <= 0.4 ? 'RED' : wellbeingBaseline <= 0.6 ? 'YELLOW' : 'GREEN';
  
  // ============================
  // SECTION B CALCULATIONS
  // ============================
  
  // Attention/Focus (B1-B6) - sum of 0-4 scale = 0-24
  const attentionScore = sum([
    sectionB.B1, sectionB.B2, sectionB.B3,
    sectionB.B4, sectionB.B5, sectionB.B6
  ]);
  const attentionFlag = getFlag(attentionScore, 9, 14);
  
  // Reading/Processing (B7-B11) - sum of 0-4 scale = 0-20
  const readingScore = sum([
    sectionB.B7, sectionB.B8, sectionB.B9,
    sectionB.B10, sectionB.B11
  ]);
  const readingFlag = getFlag(readingScore, 7, 12);
  
  // Numerical Processing (B12-B15) - sum of 0-4 scale = 0-16
  const numericalProcessingScore = sum([
    sectionB.B12, sectionB.B13, sectionB.B14, sectionB.B15
  ]);
  const numericalProcessingFlag = getFlag(numericalProcessingScore, 6, 10);
  
  // ============================
  // SECTION C CALCULATIONS
  // ============================
  
  // Academic Preparedness (C1-C6) - sum of 1-5 scale = 6-30
  const academicPreparedness = sum([
    sectionC.C1, sectionC.C2, sectionC.C3,
    sectionC.C4, sectionC.C5, sectionC.C6
  ]);
  
  // Classroom Engagement (C7-C12)
  const classroomEngagement = sum([
    sectionC.C7, sectionC.C8, sectionC.C9,
    sectionC.C10, sectionC.C11, sectionC.C12
  ]);
  
  // Receptivity to Support (C13-C18)
  const receptivityToSupport = sum([
    sectionC.C13, sectionC.C14, sectionC.C15,
    sectionC.C16, sectionC.C17, sectionC.C18
  ]);
  
  // Future Orientation (C19-C24)
  const futureOrientation = sum([
    sectionC.C19, sectionC.C20, sectionC.C21,
    sectionC.C22, sectionC.C23, sectionC.C24
  ]);
  
  // Belonging & Wellbeing (C25-C30)
  const belongingWellbeing = sum([
    sectionC.C25, sectionC.C26, sectionC.C27,
    sectionC.C28, sectionC.C29, sectionC.C30
  ]);
  
  // Total Engagement (all C questions)
  const totalEngagement = academicPreparedness + classroomEngagement + 
    receptivityToSupport + futureOrientation + belongingWellbeing;
  
  // Grit Indicator (C4, C6, C11, C18, C21, C23)
  const gritIndicator = sum([
    sectionC.C4, sectionC.C6, sectionC.C11,
    sectionC.C18, sectionC.C21, sectionC.C23
  ]);
  
  // ============================
  // SECTION D CALCULATIONS
  // ============================
  
  // Abstract Reasoning (D1-D4)
  const abstractReasoning = countCorrect(sectionD, ['D1', 'D2', 'D3', 'D4']);
  
  // Numerical Reasoning (D5-D8)
  const numericalReasoning = countCorrect(sectionD, ['D5', 'D6', 'D7', 'D8']);
  
  // Critical Thinking (D9-D12)
  const criticalThinking = countCorrect(sectionD, ['D9', 'D10', 'D11', 'D12']);
  
  // Total Cognitive
  const totalCognitive = abstractReasoning + numericalReasoning + criticalThinking;
  
  // ============================
  // SECTION E - Pass through
  // ============================
  
  return {
    // Flags
    languageFlag,
    wellbeingFlag,
    attentionFlag,
    readingFlag,
    numericalProcessingFlag,
    
    // Raw scores
    wellbeingBaseline: Math.round(wellbeingBaseline * 100) / 100,
    attentionScore,
    readingScore,
    numericalProcessingScore,
    
    // Engagement domain scores
    academicPreparedness,
    classroomEngagement,
    receptivityToSupport,
    futureOrientation,
    belongingWellbeing,
    totalEngagement,
    gritIndicator,
    
    // Cognitive scores
    abstractReasoning,
    numericalReasoning,
    criticalThinking,
    totalCognitive,
    
    // Self-assessment (pass through from E)
    selfIdentifiedStrengths: sectionE.E1,
    requestedSupport: sectionE.E2,
    supportPreference: sectionE.E3,
    communicationPreference: sectionE.E4,
    studentNotes: sectionE.E5,
    successVision: sectionE.E6,
  };
}

// Generate recommendations based on scores
export interface Recommendation {
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  domain: string;
  action: string;
  resource: string;
}

export function generateRecommendations(profile: ScoreProfile): Recommendation[] {
  const recommendations: Recommendation[] = [];
  
  // Language support
  if (profile.languageFlag === 'RED') {
    recommendations.push({
      priority: 'HIGH',
      domain: 'Language Support',
      action: 'Connect with Academic English resources',
      resource: 'Writing Center, Language Labs',
    });
  } else if (profile.languageFlag === 'YELLOW') {
    recommendations.push({
      priority: 'MEDIUM',
      domain: 'Language Support',
      action: 'Consider Academic English workshops',
      resource: 'Writing Center',
    });
  }
  
  // Wellbeing
  if (profile.wellbeingFlag === 'RED') {
    recommendations.push({
      priority: 'HIGH',
      domain: 'Wellbeing',
      action: 'Schedule wellness check-in',
      resource: 'Counseling Services, Student Life',
    });
  } else if (profile.wellbeingFlag === 'YELLOW') {
    recommendations.push({
      priority: 'MEDIUM',
      domain: 'Wellbeing',
      action: 'Share stress management resources',
      resource: 'Wellness Programs',
    });
  }
  
  // Attention/Focus
  if (profile.attentionFlag === 'RED') {
    recommendations.push({
      priority: 'HIGH',
      domain: 'Focus & Attention',
      action: 'Discuss attention support strategies; consider assessment referral',
      resource: 'Learning Support, Disability Services',
    });
  } else if (profile.attentionFlag === 'YELLOW') {
    recommendations.push({
      priority: 'MEDIUM',
      domain: 'Focus & Attention',
      action: 'Share focus strategies and resources',
      resource: 'Study Skills Workshop',
    });
  }
  
  // Reading/Processing
  if (profile.readingFlag === 'RED') {
    recommendations.push({
      priority: 'HIGH',
      domain: 'Reading Support',
      action: 'Discuss reading support options; consider assessment referral',
      resource: 'Learning Support, Disability Services',
    });
  } else if (profile.readingFlag === 'YELLOW') {
    recommendations.push({
      priority: 'MEDIUM',
      domain: 'Reading Support',
      action: 'Share reading strategies',
      resource: 'Academic Skills Center',
    });
  }
  
  // Numerical Processing
  if (profile.numericalProcessingFlag === 'RED') {
    recommendations.push({
      priority: 'HIGH',
      domain: 'Quantitative Support',
      action: 'Connect with math support resources',
      resource: 'Math Lab, Tutoring Services',
    });
  } else if (profile.numericalProcessingFlag === 'YELLOW') {
    recommendations.push({
      priority: 'MEDIUM',
      domain: 'Quantitative Support',
      action: 'Share quantitative strategies',
      resource: 'Math Lab',
    });
  }
  
  // Academic Preparedness (low = 6-14)
  if (profile.academicPreparedness <= 14) {
    recommendations.push({
      priority: 'HIGH',
      domain: 'Study Skills',
      action: 'Prioritize study skills programming',
      resource: 'Academic Skills Workshop Series',
    });
  } else if (profile.academicPreparedness <= 18) {
    recommendations.push({
      priority: 'MEDIUM',
      domain: 'Study Skills',
      action: 'Invite to study skills workshop',
      resource: 'Academic Skills Center',
    });
  }
  
  // Belonging & Wellbeing (low = 6-14)
  if (profile.belongingWellbeing <= 14) {
    recommendations.push({
      priority: 'HIGH',
      domain: 'Community Connection',
      action: 'Proactive outreach for community building',
      resource: 'Student Life, Peer Mentorship',
    });
  }
  
  // Future Orientation (low = 6-14)
  if (profile.futureOrientation <= 14) {
    recommendations.push({
      priority: 'MEDIUM',
      domain: 'Career Development',
      action: 'Connect with career counseling',
      resource: 'Career Services, Advising',
    });
  }
  
  // Sort by priority
  const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  
  return recommendations.slice(0, 5); // Return top 5
}

// Get interpretive text for engagement domains
export function getEngagementInterpretation(score: number, domain: string): { level: string; narrative: string } {
  // Scores are out of 30 (6 questions × 5-point scale)
  if (score <= 14) {
    return {
      level: 'Developing',
      narrative: getDevelopingNarrative(domain),
    };
  } else if (score <= 22) {
    return {
      level: 'Solid Foundation',
      narrative: getSolidNarrative(domain),
    };
  } else {
    return {
      level: 'Strong',
      narrative: getStrongNarrative(domain),
    };
  }
}

function getDevelopingNarrative(domain: string): string {
  const narratives: Record<string, string> = {
    'Academic Preparedness': 'You may benefit from developing some additional study strategies. Many students find that small adjustments to how they organize their time or approach revision make a significant difference.',
    'Classroom Engagement': 'There may be opportunities to develop more active engagement strategies. This is something that often grows with practice and the right environment.',
    'Receptivity to Support': 'You may prefer to work independently, which is valid. However, knowing about available resources can be helpful even if you don\'t use them immediately.',
    'Future Orientation': 'Clarifying your goals and how your studies connect to them might help with motivation. This is something worth exploring with an advisor.',
    'Belonging & Wellbeing': 'Building connections and feeling at home takes time, especially in a new environment. We\'d like to help you find your community here.',
  };
  return narratives[domain] || 'This is an area where additional support might be beneficial.';
}

function getSolidNarrative(domain: string): string {
  const narratives: Record<string, string> = {
    'Academic Preparedness': 'You have a solid foundation of study skills. Refining some strategies could help you reach even higher levels of performance.',
    'Classroom Engagement': 'You show good engagement with your learning. Continue building on these strengths.',
    'Receptivity to Support': 'You\'re open to support when needed, which is a strength. Don\'t hesitate to reach out when challenges arise.',
    'Future Orientation': 'You have a reasonable sense of direction. Periodically revisiting and refining your goals can keep you motivated.',
    'Belonging & Wellbeing': 'You seem to be finding your place. Continue building those connections that matter to you.',
  };
  return narratives[domain] || 'You have a solid foundation in this area.';
}

function getStrongNarrative(domain: string): string {
  const narratives: Record<string, string> = {
    'Academic Preparedness': 'You have strong study skills and academic self-efficacy. You might be well-suited to help peers or take on leadership roles.',
    'Classroom Engagement': 'You\'re highly engaged in your learning. This active approach will serve you well.',
    'Receptivity to Support': 'You\'re very open to seeking and receiving support. This is a significant strength for long-term success.',
    'Future Orientation': 'You have a clear sense of direction and purpose. This will help sustain your motivation through challenges.',
    'Belonging & Wellbeing': 'You feel well-connected and grounded. This is a wonderful foundation for your journey here.',
  };
  return narratives[domain] || 'This is a strong area for you.';
}

// Get flag interpretation for learning profile
export function getFlagInterpretation(flag: FlagLevel, domain: string): string {
  if (flag === 'GREEN') {
    return `No particular support indicated in this area.`;
  } else if (flag === 'YELLOW') {
    const resources: Record<string, string> = {
      'Language': 'You might benefit from Academic English workshops or writing center visits.',
      'Wellbeing': 'Consider exploring stress management resources or wellness programs.',
      'Attention': 'Some focus strategies like time-blocking or the Pomodoro technique might help.',
      'Reading': 'Reading strategies like active annotation or audio support could be useful.',
      'Numerical': 'Math lab drop-in sessions or quantitative tutoring might be helpful.',
    };
    return resources[domain] || 'You may benefit from some strategies and resources in this area.';
  } else {
    return `We recommend a follow-up conversation to discuss support options. Many successful students benefit from these resources.`;
  }
}

// Get cognitive interpretation
export function getCognitiveInterpretation(score: number, total: number, domain: string): string {
  const percentage = (score / total) * 100;
  
  if (percentage >= 75) {
    return `This appears to be a strength area for you.`;
  } else if (percentage >= 50) {
    return `This is in the typical range.`;
  } else {
    const suggestions: Record<string, string> = {
      'Abstract Reasoning': 'Practice with pattern recognition puzzles might strengthen this skill.',
      'Numerical Reasoning': 'Working through word problems regularly can help develop this area.',
      'Critical Thinking': 'Analyzing arguments and questioning assumptions builds this skill over time.',
    };
    return suggestions[domain] || 'This is an area you might enjoy developing further.';
  }
}
