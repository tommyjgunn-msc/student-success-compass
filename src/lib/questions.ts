import { TestSection, TestQuestion } from './types';

// ============================================
// SECTION A: FOUNDATION
// ============================================

export const sectionA: TestSection = {
  id: 'A',
  title: 'Foundation',
  description: 'Let\'s start with some context about you and how you\'re feeling right now.',
  timeEstimate: '1-2 minutes',
  questions: [
    {
      id: 'A1',
      text: 'When reading academic texts in English, I usually...',
      type: 'select',
      options: [
        { value: 1, label: 'Read fluently and rarely need to re-read passages' },
        { value: 2, label: 'Read comfortably but occasionally need to slow down for complex ideas' },
        { value: 3, label: 'Need to re-read sections several times to fully understand' },
        { value: 4, label: 'Find it challenging and often need additional time or resources' },
        { value: 5, label: 'Prefer to use translation tools alongside English texts' },
      ],
    },
    {
      id: 'A2',
      text: 'Right now, I feel about starting/continuing my studies:',
      type: 'scale',
      scaleLabels: { low: 'Very anxious', high: 'Very excited' },
      options: [
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' },
        { value: 4, label: '4' },
        { value: 5, label: '5' },
      ],
    },
    {
      id: 'A3',
      text: 'In the past two weeks, my stress level has been:',
      type: 'scale',
      scaleLabels: { low: 'Very low', high: 'Very high' },
      options: [
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' },
        { value: 4, label: '4' },
        { value: 5, label: '5' },
      ],
    },
    {
      id: 'A4',
      text: 'I would describe my current energy level as:',
      type: 'scale',
      scaleLabels: { low: 'Exhausted', high: 'Energized' },
      options: [
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' },
        { value: 4, label: '4' },
        { value: 5, label: '5' },
      ],
    },
    {
      id: 'A5',
      text: 'Before this program, I would describe my academic performance as:',
      type: 'scale',
      scaleLabels: { low: 'Struggled significantly', high: 'Excelled consistently' },
      options: [
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' },
        { value: 4, label: '4' },
        { value: 5, label: '5' },
      ],
    },
    {
      id: 'A6',
      text: 'The education system I came from was: (select all that apply)',
      type: 'multiselect',
      options: [
        { value: 'lecture-exam', label: 'Primarily lecture-based with exams' },
        { value: 'discussion-project', label: 'Discussion and project-based' },
        { value: 'self-directed', label: 'Self-directed / distance learning' },
        { value: 'vocational', label: 'Vocational / practical training' },
        { value: 'mixed', label: 'Mixed / varies by subject' },
        { value: 'other', label: 'Other' },
      ],
    },
  ],
};

// ============================================
// SECTION B: LEARNING PROFILE SCREENER
// ============================================

const sectionBScaleOptions = [
  { value: 0, label: 'Never' },
  { value: 1, label: 'Rarely' },
  { value: 2, label: 'Sometimes' },
  { value: 3, label: 'Often' },
  { value: 4, label: 'Very Often' },
];

export const sectionB: TestSection = {
  id: 'B',
  title: 'Learning Profile',
  description: 'These questions help us understand your learning patterns. Answer honestly — there are no right or wrong answers.',
  timeEstimate: '2-3 minutes',
  instructions: 'For each statement, indicate how often this applies to you.',
  questions: [
    // Attention/Focus (B1-B6) - ASRS-6 adapted
    {
      id: 'B1',
      text: 'I have difficulty concentrating on what people say to me, even when they are speaking directly to me.',
      type: 'select',
      options: sectionBScaleOptions,
    },
    {
      id: 'B2',
      text: 'I have difficulty organizing tasks and activities (e.g., managing time, keeping materials in order, meeting deadlines).',
      type: 'select',
      options: sectionBScaleOptions,
    },
    {
      id: 'B3',
      text: 'I avoid or delay starting tasks that require sustained mental effort.',
      type: 'select',
      options: sectionBScaleOptions,
    },
    {
      id: 'B4',
      text: 'I fidget or feel restless when I have to sit for long periods.',
      type: 'select',
      options: sectionBScaleOptions,
    },
    {
      id: 'B5',
      text: 'I feel overly active or compelled to do things, as if driven by a motor.',
      type: 'select',
      options: sectionBScaleOptions,
    },
    {
      id: 'B6',
      text: 'I make careless mistakes when working on something boring or difficult.',
      type: 'select',
      options: sectionBScaleOptions,
    },
    // Reading/Processing (B7-B11)
    {
      id: 'B7',
      text: 'I find it easier to understand information when someone explains it aloud than when I read it.',
      type: 'select',
      options: sectionBScaleOptions,
    },
    {
      id: 'B8',
      text: 'I sometimes lose my place when reading or skip lines without noticing.',
      type: 'select',
      options: sectionBScaleOptions,
    },
    {
      id: 'B9',
      text: 'Reading takes me longer than it seems to take others.',
      type: 'select',
      options: sectionBScaleOptions,
    },
    {
      id: 'B10',
      text: 'I find it difficult to skim text quickly to find specific information.',
      type: 'select',
      options: sectionBScaleOptions,
    },
    {
      id: 'B11',
      text: 'I often know what I want to say but struggle to find the right words or spell them correctly.',
      type: 'select',
      options: sectionBScaleOptions,
    },
    // Numerical Processing (B12-B15)
    {
      id: 'B12',
      text: 'I feel anxious when I have to work with numbers, even for everyday tasks.',
      type: 'select',
      options: sectionBScaleOptions,
    },
    {
      id: 'B13',
      text: 'I find it difficult to estimate quantities (time, money, distances) accurately.',
      type: 'select',
      options: sectionBScaleOptions,
    },
    {
      id: 'B14',
      text: 'I struggle to remember numerical sequences like phone numbers or PINs.',
      type: 'select',
      options: sectionBScaleOptions,
    },
    {
      id: 'B15',
      text: 'I find it hard to understand charts, graphs, or tables with numerical data.',
      type: 'select',
      options: sectionBScaleOptions,
    },
  ],
};

// ============================================
// SECTION C: ENGAGEMENT ORIENTATION
// ============================================

const sectionCScaleOptions = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly Agree' },
];

export const sectionC: TestSection = {
  id: 'C',
  title: 'Engagement Orientation',
  description: 'Tell us about your approach to learning and engagement. This helps us understand how to best support you.',
  timeEstimate: '4-5 minutes',
  instructions: 'Indicate how much you agree with each statement.',
  questions: [
    // Academic Preparedness (C1-C6)
    {
      id: 'C1',
      text: 'I have effective strategies for managing my study time.',
      type: 'select',
      options: sectionCScaleOptions,
    },
    {
      id: 'C2',
      text: 'When I don\'t understand something, I know how to figure it out.',
      type: 'select',
      options: sectionCScaleOptions,
    },
    {
      id: 'C3',
      text: 'I am confident I can succeed in challenging courses.',
      type: 'select',
      options: sectionCScaleOptions,
    },
    {
      id: 'C4',
      text: 'I can maintain focus during long study sessions.',
      type: 'select',
      options: sectionCScaleOptions,
    },
    {
      id: 'C5',
      text: 'I know how to prepare effectively for different types of assessments.',
      type: 'select',
      options: sectionCScaleOptions,
    },
    {
      id: 'C6',
      text: 'I regularly review material even when there\'s no upcoming test.',
      type: 'select',
      options: sectionCScaleOptions,
    },
    // Classroom Engagement (C7-C12)
    {
      id: 'C7',
      text: 'I actively participate in class discussions when I have something to contribute.',
      type: 'select',
      options: sectionCScaleOptions,
    },
    {
      id: 'C8',
      text: 'I ask questions when I don\'t understand something, even if it feels uncomfortable.',
      type: 'select',
      options: sectionCScaleOptions,
    },
    {
      id: 'C9',
      text: 'I take notes in a way that helps me learn, not just record information.',
      type: 'select',
      options: sectionCScaleOptions,
    },
    {
      id: 'C10',
      text: 'I try to connect new information to things I already know.',
      type: 'select',
      options: sectionCScaleOptions,
    },
    {
      id: 'C11',
      text: 'I prefer to understand concepts deeply rather than just memorize them.',
      type: 'select',
      options: sectionCScaleOptions,
    },
    {
      id: 'C12',
      text: 'I seek feedback on my work, even when it\'s not required.',
      type: 'select',
      options: sectionCScaleOptions,
    },
    // Receptivity to Support (C13-C18)
    {
      id: 'C13',
      text: 'I would use tutoring services if I was struggling in a course.',
      type: 'select',
      options: sectionCScaleOptions,
    },
    {
      id: 'C14',
      text: 'I am comfortable talking to professors or advisors about challenges.',
      type: 'select',
      options: sectionCScaleOptions,
    },
    {
      id: 'C15',
      text: 'I believe asking for help is a sign of strength, not weakness.',
      type: 'select',
      options: sectionCScaleOptions,
    },
    {
      id: 'C16',
      text: 'I would attend a workshop on study skills if it was offered.',
      type: 'select',
      options: sectionCScaleOptions,
    },
    {
      id: 'C17',
      text: 'I want my advisor to check in with me regularly, not just when there\'s a problem.',
      type: 'select',
      options: sectionCScaleOptions,
    },
    {
      id: 'C18',
      text: 'I am open to trying new approaches if my current methods aren\'t working.',
      type: 'select',
      options: sectionCScaleOptions,
    },
    // Future Orientation (C19-C24)
    {
      id: 'C19',
      text: 'I have a clear idea of what I want to achieve through my education.',
      type: 'select',
      options: sectionCScaleOptions,
    },
    {
      id: 'C20',
      text: 'I can see how my current courses connect to my future career.',
      type: 'select',
      options: sectionCScaleOptions,
    },
    {
      id: 'C21',
      text: 'I think about my long-term goals when making decisions about my studies.',
      type: 'select',
      options: sectionCScaleOptions,
    },
    {
      id: 'C22',
      text: 'I am studying this subject because I am genuinely interested in it, not just for a qualification.',
      type: 'select',
      options: sectionCScaleOptions,
    },
    {
      id: 'C23',
      text: 'I have specific professional or personal goals I am working toward.',
      type: 'select',
      options: sectionCScaleOptions,
    },
    {
      id: 'C24',
      text: 'I believe my education will open doors that would otherwise be closed to me.',
      type: 'select',
      options: sectionCScaleOptions,
    },
    // Belonging & Wellbeing (C25-C30)
    {
      id: 'C25',
      text: 'I feel like I belong at this institution.',
      type: 'select',
      options: sectionCScaleOptions,
    },
    {
      id: 'C26',
      text: 'I have people here I can turn to when I\'m stressed or struggling.',
      type: 'select',
      options: sectionCScaleOptions,
    },
    {
      id: 'C27',
      text: 'I feel respected and valued by others in my academic community.',
      type: 'select',
      options: sectionCScaleOptions,
    },
    {
      id: 'C28',
      text: 'I can be my authentic self in this environment.',
      type: 'select',
      options: sectionCScaleOptions,
    },
    {
      id: 'C29',
      text: 'I believe I can handle the challenges that come with being a student here.',
      type: 'select',
      options: sectionCScaleOptions,
    },
    {
      id: 'C30',
      text: 'I take care of my physical and mental health even when academics are demanding.',
      type: 'select',
      options: sectionCScaleOptions,
    },
  ],
};

// ============================================
// SECTION D: THINKING PATTERNS (TIMED)
// ============================================

export const sectionD: TestSection = {
  id: 'D',
  title: 'Thinking Patterns',
  description: 'This section assesses different types of reasoning. Work quickly but carefully.',
  timeEstimate: '5 minutes',
  instructions: 'This section is timed. You\'ll have 5 minutes to complete 12 questions. It\'s normal not to finish all questions — answer as many as you can. The timer will start when you begin this section.',
  isTimed: true,
  timeLimit: 300, // 5 minutes = 300 seconds
  questions: [
    // Abstract Reasoning (D1-D4) - Mix of visual and text-based
    {
      id: 'D1',
      text: 'What number comes next in this sequence?\n\n2, 6, 18, 54, ___',
      type: 'cognitive',
      options: [
        { value: 'A', label: '108' },
        { value: 'B', label: '162' },
        { value: 'C', label: '148' },
        { value: 'D', label: '216' },
      ],
      correctAnswer: 'B',
    },
    {
      id: 'D2',
      text: 'Look at the pattern. Each row and column follows a rule.\n\nWhich shape completes the grid?',
      type: 'pattern',
      patternData: {
        type: 'matrix',
        grid: [
          ['●', '■', '▲'],
          ['■', '▲', '●'],
          ['▲', '●', '?'],
        ],
        options: ['●', '■', '▲', '◆'],
        correctIndex: 1, // ■
      },
      options: [
        { value: 'A', label: '●' },
        { value: 'B', label: '■' },
        { value: 'C', label: '▲' },
        { value: 'D', label: '◆' },
      ],
      correctAnswer: 'B',
    },
    {
      id: 'D3',
      text: 'What comes next in this sequence?\n\nAZ, BY, CX, DW, ___',
      type: 'cognitive',
      options: [
        { value: 'A', label: 'EV' },
        { value: 'B', label: 'EU' },
        { value: 'C', label: 'FV' },
        { value: 'D', label: 'EX' },
      ],
      correctAnswer: 'A',
    },
    {
      id: 'D4',
      text: 'Look at the pattern in each row. Which option completes the third row?',
      type: 'pattern',
      patternData: {
        type: 'matrix',
        grid: [
          ['○○○', '○○●', '○●●'],
          ['□□□', '□□■', '□■■'],
          ['△△△', '△△▲', '?'],
        ],
        options: ['△▲▲', '▲▲▲', '△△▲', '▲△△'],
        correctIndex: 0,
      },
      options: [
        { value: 'A', label: '△▲▲' },
        { value: 'B', label: '▲▲▲' },
        { value: 'C', label: '△△▲' },
        { value: 'D', label: '▲△△' },
      ],
      correctAnswer: 'A',
    },
    // Numerical Reasoning (D5-D8)
    {
      id: 'D5',
      text: 'A store offers 25% off all items. If a shirt originally costs $80, what is the sale price?',
      type: 'cognitive',
      options: [
        { value: 'A', label: '$20' },
        { value: 'B', label: '$55' },
        { value: 'C', label: '$60' },
        { value: 'D', label: '$65' },
      ],
      correctAnswer: 'C',
    },
    {
      id: 'D6',
      text: 'If 3 workers can complete a task in 12 days, how many days would it take 4 workers to complete the same task (assuming equal productivity)?',
      type: 'cognitive',
      options: [
        { value: 'A', label: '9 days' },
        { value: 'B', label: '10 days' },
        { value: 'C', label: '16 days' },
        { value: 'D', label: '8 days' },
      ],
      correctAnswer: 'A',
    },
    {
      id: 'D7',
      text: 'A company\'s revenue increased from $2.4 million to $3.0 million. What was the percentage increase?',
      type: 'cognitive',
      options: [
        { value: 'A', label: '20%' },
        { value: 'B', label: '25%' },
        { value: 'C', label: '30%' },
        { value: 'D', label: '60%' },
      ],
      correctAnswer: 'B',
    },
    {
      id: 'D8',
      text: 'A train travels 180 km in 2 hours. If it maintains the same speed, how far will it travel in 3.5 hours?',
      type: 'cognitive',
      options: [
        { value: 'A', label: '270 km' },
        { value: 'B', label: '315 km' },
        { value: 'C', label: '350 km' },
        { value: 'D', label: '360 km' },
      ],
      correctAnswer: 'B',
    },
    // Critical Thinking (D9-D12)
    {
      id: 'D9',
      text: 'Read the following argument:\n\n"Studies show that students who eat breakfast perform better academically. Therefore, schools should provide free breakfast to all students to improve academic outcomes."\n\nWhich of the following, if true, would most WEAKEN this argument?',
      type: 'cognitive',
      options: [
        { value: 'A', label: 'The studies controlled for socioeconomic factors' },
        { value: 'B', label: 'Students who eat breakfast also tend to get more sleep and exercise' },
        { value: 'C', label: 'Free breakfast programs have been successful in several districts' },
        { value: 'D', label: 'Some students prefer not to eat in the morning' },
      ],
      correctAnswer: 'B',
    },
    {
      id: 'D10',
      text: '"All successful entrepreneurs take risks. Maria takes risks. Therefore, Maria is a successful entrepreneur."\n\nThis argument is:',
      type: 'cognitive',
      options: [
        { value: 'A', label: 'Valid — the conclusion follows logically from the premises' },
        { value: 'B', label: 'Invalid — it assumes all risk-takers are successful entrepreneurs' },
        { value: 'C', label: 'Valid — because the premises are true' },
        { value: 'D', label: 'Invalid — because Maria might not want to be an entrepreneur' },
      ],
      correctAnswer: 'B',
    },
    {
      id: 'D11',
      text: 'A university reports: "Our graduates have a 95% employment rate within 6 months of graduation."\n\nWhich question would be MOST important to ask before concluding this is a strong program?',
      type: 'cognitive',
      options: [
        { value: 'A', label: 'What is the average salary of graduates?' },
        { value: 'B', label: 'How is "employment" defined, and how many graduates responded to the survey?' },
        { value: 'C', label: 'Does the university offer career services?' },
        { value: 'D', label: 'What percentage of students graduate on time?' },
      ],
      correctAnswer: 'B',
    },
    {
      id: 'D12',
      text: 'Consider this data:\n\n"In Country X, regions with more doctors per capita have higher rates of a certain disease."\n\nWhich interpretation is MOST reasonable?',
      type: 'cognitive',
      options: [
        { value: 'A', label: 'Doctors are causing the disease to spread' },
        { value: 'B', label: 'The disease is contagious and spreading in urban areas' },
        { value: 'C', label: 'Regions with higher disease rates may attract more doctors' },
        { value: 'D', label: 'This proves that medical care is ineffective for this disease' },
      ],
      correctAnswer: 'C',
    },
  ],
};

// ============================================
// SECTION E: REFLECTION & PRIORITIES
// ============================================

export const sectionE: TestSection = {
  id: 'E',
  title: 'Reflection & Priorities',
  description: 'Finally, tell us about your strengths and what kind of support would be most helpful for you.',
  timeEstimate: '1-2 minutes',
  questions: [
    {
      id: 'E1',
      text: 'Which of these do you consider your GREATEST STRENGTHS as a student? (Select up to 3)',
      type: 'multiselect',
      options: [
        { value: 'time-management', label: 'Time management and organization' },
        { value: 'complex-concepts', label: 'Understanding complex concepts' },
        { value: 'written-communication', label: 'Written communication' },
        { value: 'numbers-data', label: 'Working with numbers and data' },
        { value: 'creative-thinking', label: 'Creative and original thinking' },
        { value: 'persistence', label: 'Persistence through challenges' },
        { value: 'collaboration', label: 'Working with others' },
        { value: 'presenting', label: 'Presenting and speaking' },
        { value: 'research', label: 'Research and finding information' },
        { value: 'asking-questions', label: 'Asking good questions' },
      ],
    },
    {
      id: 'E2',
      text: 'Which areas would you most like SUPPORT developing? (Select up to 3)',
      type: 'multiselect',
      options: [
        { value: 'time-management', label: 'Time management and organization' },
        { value: 'complex-concepts', label: 'Understanding complex concepts' },
        { value: 'written-communication', label: 'Written communication' },
        { value: 'numbers-data', label: 'Working with numbers and data' },
        { value: 'creative-thinking', label: 'Creative and original thinking' },
        { value: 'stress-management', label: 'Managing stress and pressure' },
        { value: 'building-connections', label: 'Building connections with others' },
        { value: 'presenting', label: 'Presenting and speaking' },
        { value: 'research', label: 'Research and finding information' },
        { value: 'confidence', label: 'Feeling confident in my abilities' },
      ],
    },
    {
      id: 'E3',
      text: 'When you need academic support, you prefer to:',
      type: 'select',
      options: [
        { value: 'one-on-one', label: 'Get help one-on-one from a tutor or advisor' },
        { value: 'study-group', label: 'Work through problems in a small study group' },
        { value: 'online-self', label: 'Use online resources and figure things out independently' },
        { value: 'workshops', label: 'Attend workshops or structured support sessions' },
        { value: 'unsure', label: 'I\'m not sure — I\'d like guidance on what might work best for me' },
      ],
    },
    {
      id: 'E4',
      text: 'If your success team wanted to check in with you, you would prefer:',
      type: 'select',
      options: [
        { value: 'email', label: 'Email' },
        { value: 'text', label: 'Text / WhatsApp message' },
        { value: 'phone', label: 'Phone call' },
        { value: 'drop-in', label: 'In-person drop-in' },
        { value: 'appointment', label: 'Scheduled appointment' },
        { value: 'self-initiate', label: 'I prefer to reach out myself when I need support' },
      ],
    },
    {
      id: 'E5',
      text: 'Is there anything about your background, circumstances, or learning that you want your success team to know? (Optional)',
      type: 'text',
    },
    {
      id: 'E6',
      text: 'What does success look like for you by the end of this academic year?',
      type: 'text',
    },
  ],
};

// ============================================
// ALL SECTIONS COMBINED
// ============================================

export const allSections: TestSection[] = [sectionA, sectionB, sectionC, sectionD, sectionE];

// ============================================
// DEGREE PROGRAMS
// ============================================

export const degreePrograms = [
  { value: 'bsc-computing', label: 'Bachelors of Science in Computing' },
  { value: 'bsc-software-engineering', label: 'Bachelors of Science in Software Engineering' },
  { value: 'bsc-entrepreneurial-leadership', label: 'Bachelors of Science in Entrepreneurial Leadership' },
  { value: 'bsc-international-business', label: 'Bachelors of Science in International Business and Trade' },
];
