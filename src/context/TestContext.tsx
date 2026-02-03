'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { 
  StudentInfo, 
  SectionAResponses, 
  SectionBResponses, 
  SectionCResponses, 
  SectionDResponses, 
  SectionEResponses,
  AllResponses,
  ScoreProfile 
} from '@/lib/types';
import { calculateScores } from '@/lib/scoring';

interface TestContextType {
  // Student info
  studentInfo: StudentInfo;
  setStudentInfo: (info: Partial<StudentInfo>) => void;
  
  // Section responses
  sectionA: Partial<SectionAResponses>;
  sectionB: Partial<SectionBResponses>;
  sectionC: Partial<SectionCResponses>;
  sectionD: Partial<SectionDResponses>;
  sectionE: Partial<SectionEResponses>;
  
  // Update functions
  updateSectionA: (responses: Partial<SectionAResponses>) => void;
  updateSectionB: (responses: Partial<SectionBResponses>) => void;
  updateSectionC: (responses: Partial<SectionCResponses>) => void;
  updateSectionD: (responses: Partial<SectionDResponses>) => void;
  updateSectionE: (responses: Partial<SectionEResponses>) => void;
  
  // Computed
  getAllResponses: () => AllResponses;
  getScores: () => ScoreProfile;
  
  // State
  currentSection: number;
  setCurrentSection: (section: number) => void;
  isComplete: boolean;
  setIsComplete: (complete: boolean) => void;
  
  // Reset
  resetTest: () => void;
}

const defaultStudentInfo: StudentInfo = {
  name: '',
  intakeYear: '',
  program: '',
};

const TestContext = createContext<TestContextType | undefined>(undefined);

export function TestProvider({ children }: { children: ReactNode }) {
  // Student info
  const [studentInfo, setStudentInfoState] = useState<StudentInfo>(defaultStudentInfo);
  
  // Section responses
  const [sectionA, setSectionA] = useState<Partial<SectionAResponses>>({});
  const [sectionB, setSectionB] = useState<Partial<SectionBResponses>>({});
  const [sectionC, setSectionC] = useState<Partial<SectionCResponses>>({});
  const [sectionD, setSectionD] = useState<Partial<SectionDResponses>>({});
  const [sectionE, setSectionE] = useState<Partial<SectionEResponses>>({});
  
  // State
  const [currentSection, setCurrentSection] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  // Update functions
  const setStudentInfo = useCallback((info: Partial<StudentInfo>) => {
    setStudentInfoState(prev => ({ ...prev, ...info }));
  }, []);
  
  const updateSectionA = useCallback((responses: Partial<SectionAResponses>) => {
    setSectionA(prev => ({ ...prev, ...responses }));
  }, []);
  
  const updateSectionB = useCallback((responses: Partial<SectionBResponses>) => {
    setSectionB(prev => ({ ...prev, ...responses }));
  }, []);
  
  const updateSectionC = useCallback((responses: Partial<SectionCResponses>) => {
    setSectionC(prev => ({ ...prev, ...responses }));
  }, []);
  
  const updateSectionD = useCallback((responses: Partial<SectionDResponses>) => {
    setSectionD(prev => ({ ...prev, ...responses }));
  }, []);
  
  const updateSectionE = useCallback((responses: Partial<SectionEResponses>) => {
    setSectionE(prev => ({ ...prev, ...responses }));
  }, []);
  
  // Get all responses
  const getAllResponses = useCallback((): AllResponses => {
    return {
      studentInfo,
      sectionA: {
        A1: sectionA.A1 ?? 1,
        A2: sectionA.A2 ?? 3,
        A3: sectionA.A3 ?? 3,
        A4: sectionA.A4 ?? 3,
        A5: sectionA.A5 ?? 3,
        A6: sectionA.A6 ?? [],
      },
      sectionB: {
        B1: sectionB.B1 ?? 0,
        B2: sectionB.B2 ?? 0,
        B3: sectionB.B3 ?? 0,
        B4: sectionB.B4 ?? 0,
        B5: sectionB.B5 ?? 0,
        B6: sectionB.B6 ?? 0,
        B7: sectionB.B7 ?? 0,
        B8: sectionB.B8 ?? 0,
        B9: sectionB.B9 ?? 0,
        B10: sectionB.B10 ?? 0,
        B11: sectionB.B11 ?? 0,
        B12: sectionB.B12 ?? 0,
        B13: sectionB.B13 ?? 0,
        B14: sectionB.B14 ?? 0,
        B15: sectionB.B15 ?? 0,
      },
      sectionC: {
        C1: sectionC.C1 ?? 3,
        C2: sectionC.C2 ?? 3,
        C3: sectionC.C3 ?? 3,
        C4: sectionC.C4 ?? 3,
        C5: sectionC.C5 ?? 3,
        C6: sectionC.C6 ?? 3,
        C7: sectionC.C7 ?? 3,
        C8: sectionC.C8 ?? 3,
        C9: sectionC.C9 ?? 3,
        C10: sectionC.C10 ?? 3,
        C11: sectionC.C11 ?? 3,
        C12: sectionC.C12 ?? 3,
        C13: sectionC.C13 ?? 3,
        C14: sectionC.C14 ?? 3,
        C15: sectionC.C15 ?? 3,
        C16: sectionC.C16 ?? 3,
        C17: sectionC.C17 ?? 3,
        C18: sectionC.C18 ?? 3,
        C19: sectionC.C19 ?? 3,
        C20: sectionC.C20 ?? 3,
        C21: sectionC.C21 ?? 3,
        C22: sectionC.C22 ?? 3,
        C23: sectionC.C23 ?? 3,
        C24: sectionC.C24 ?? 3,
        C25: sectionC.C25 ?? 3,
        C26: sectionC.C26 ?? 3,
        C27: sectionC.C27 ?? 3,
        C28: sectionC.C28 ?? 3,
        C29: sectionC.C29 ?? 3,
        C30: sectionC.C30 ?? 3,
      },
      sectionD: {
        D1: sectionD.D1 ?? '',
        D2: sectionD.D2 ?? '',
        D3: sectionD.D3 ?? '',
        D4: sectionD.D4 ?? '',
        D5: sectionD.D5 ?? '',
        D6: sectionD.D6 ?? '',
        D7: sectionD.D7 ?? '',
        D8: sectionD.D8 ?? '',
        D9: sectionD.D9 ?? '',
        D10: sectionD.D10 ?? '',
        D11: sectionD.D11 ?? '',
        D12: sectionD.D12 ?? '',
      },
      sectionE: {
        E1: sectionE.E1 ?? [],
        E2: sectionE.E2 ?? [],
        E3: sectionE.E3 ?? '',
        E4: sectionE.E4 ?? '',
        E5: sectionE.E5 ?? '',
        E6: sectionE.E6 ?? '',
      },
    };
  }, [studentInfo, sectionA, sectionB, sectionC, sectionD, sectionE]);
  
  // Calculate scores
  const getScores = useCallback((): ScoreProfile => {
    const responses = getAllResponses();
    return calculateScores(responses);
  }, [getAllResponses]);
  
  // Reset
  const resetTest = useCallback(() => {
    setStudentInfoState(defaultStudentInfo);
    setSectionA({});
    setSectionB({});
    setSectionC({});
    setSectionD({});
    setSectionE({});
    setCurrentSection(0);
    setIsComplete(false);
  }, []);
  
  return (
    <TestContext.Provider
      value={{
        studentInfo,
        setStudentInfo,
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
        currentSection,
        setCurrentSection,
        isComplete,
        setIsComplete,
        resetTest,
      }}
    >
      {children}
    </TestContext.Provider>
  );
}

export function useTest() {
  const context = useContext(TestContext);
  if (context === undefined) {
    throw new Error('useTest must be used within a TestProvider');
  }
  return context;
}
