import { google } from 'googleapis';
import { AllResponses, ScoreProfile } from './types';

// Initialize Google Sheets API client
function getGoogleSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      // Private key needs newlines restored (Vercel stores with escaped newlines)
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

// Get the sheet ID and names from env
const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const RESPONSES_SHEET = process.env.GOOGLE_SHEET_NAME || 'Responses';
const CONFIG_SHEET = process.env.GOOGLE_CONFIG_SHEET_NAME || 'Config';

// Check if test is open (reads from Config sheet)
export async function isTestOpen(): Promise<boolean> {
  try {
    const sheets = getGoogleSheetsClient();
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${CONFIG_SHEET}!A2`, // Status in cell A2
    });
    
    const value = response.data.values?.[0]?.[0];
    return value?.toLowerCase() === 'open';
  } catch (error) {
    console.error('Error checking test status:', error);
    // Default to closed if there's an error
    return false;
  }
}

// Toggle test open/closed status
export async function toggleTestStatus(newStatus: 'open' | 'closed'): Promise<boolean> {
  try {
    const sheets = getGoogleSheetsClient();
    
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `${CONFIG_SHEET}!A2`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [[newStatus]],
      },
    });
    
    return true;
  } catch (error) {
    console.error('Error toggling test status:', error);
    return false;
  }
}

// Prepare row data from responses and scores
function prepareRowData(
  responses: AllResponses,
  scores: ScoreProfile,
  timestamp: string
): (string | number)[] {
  const { studentInfo, sectionA, sectionB, sectionC, sectionD, sectionE } = responses;
  
  return [
    // Metadata
    timestamp,
    studentInfo.name,
    studentInfo.intakeYear,
    studentInfo.program,
    
    // Section A
    sectionA.A1,
    sectionA.A2,
    sectionA.A3,
    sectionA.A4,
    sectionA.A5,
    Array.isArray(sectionA.A6) ? sectionA.A6.join(', ') : sectionA.A6,
    
    // Section B (15 items)
    sectionB.B1, sectionB.B2, sectionB.B3, sectionB.B4, sectionB.B5, sectionB.B6,
    sectionB.B7, sectionB.B8, sectionB.B9, sectionB.B10, sectionB.B11,
    sectionB.B12, sectionB.B13, sectionB.B14, sectionB.B15,
    
    // Section C (30 items)
    sectionC.C1, sectionC.C2, sectionC.C3, sectionC.C4, sectionC.C5, sectionC.C6,
    sectionC.C7, sectionC.C8, sectionC.C9, sectionC.C10, sectionC.C11, sectionC.C12,
    sectionC.C13, sectionC.C14, sectionC.C15, sectionC.C16, sectionC.C17, sectionC.C18,
    sectionC.C19, sectionC.C20, sectionC.C21, sectionC.C22, sectionC.C23, sectionC.C24,
    sectionC.C25, sectionC.C26, sectionC.C27, sectionC.C28, sectionC.C29, sectionC.C30,
    
    // Section D (12 items)
    sectionD.D1, sectionD.D2, sectionD.D3, sectionD.D4,
    sectionD.D5, sectionD.D6, sectionD.D7, sectionD.D8,
    sectionD.D9, sectionD.D10, sectionD.D11, sectionD.D12,
    
    // Section E
    Array.isArray(sectionE.E1) ? sectionE.E1.join(', ') : sectionE.E1,
    Array.isArray(sectionE.E2) ? sectionE.E2.join(', ') : sectionE.E2,
    sectionE.E3,
    sectionE.E4,
    sectionE.E5 || '',
    sectionE.E6 || '',
    
    // Calculated Scores - Flags
    scores.languageFlag,
    scores.wellbeingFlag,
    scores.attentionFlag,
    scores.readingFlag,
    scores.numericalProcessingFlag,
    
    // Calculated Scores - Raw
    scores.wellbeingBaseline,
    scores.attentionScore,
    scores.readingScore,
    scores.numericalProcessingScore,
    
    // Calculated Scores - Engagement
    scores.academicPreparedness,
    scores.classroomEngagement,
    scores.receptivityToSupport,
    scores.futureOrientation,
    scores.belongingWellbeing,
    scores.totalEngagement,
    scores.gritIndicator,
    
    // Calculated Scores - Cognitive
    scores.abstractReasoning,
    scores.numericalReasoning,
    scores.criticalThinking,
    scores.totalCognitive,
  ];
}

// Get column headers
export function getColumnHeaders(): string[] {
  return [
    // Metadata
    'Timestamp',
    'Name',
    'Intake Year',
    'Program',
    
    // Section A
    'A1_LanguageComfort',
    'A2_Excitement',
    'A3_Stress',
    'A4_Energy',
    'A5_PriorPerformance',
    'A6_EducationBackground',
    
    // Section B
    'B1_Concentration', 'B2_Organization', 'B3_TaskAvoidance',
    'B4_Fidgeting', 'B5_OverlyActive', 'B6_CarelessMistakes',
    'B7_AuralPreference', 'B8_LosePlace', 'B9_SlowReading',
    'B10_SkimmingDifficulty', 'B11_WordFinding',
    'B12_NumberAnxiety', 'B13_EstimationDifficulty',
    'B14_SequenceMemory', 'B15_ChartDifficulty',
    
    // Section C
    'C1_TimeManagement', 'C2_FigureItOut', 'C3_Confidence',
    'C4_FocusDuration', 'C5_AssessmentPrep', 'C6_RegularReview',
    'C7_ClassParticipation', 'C8_AskQuestions', 'C9_NoteTaking',
    'C10_ConnectInfo', 'C11_DeepUnderstanding', 'C12_SeekFeedback',
    'C13_UseTutoring', 'C14_TalkToAdvisors', 'C15_HelpIsStrength',
    'C16_AttendWorkshops', 'C17_RegularCheckins', 'C18_OpenToChange',
    'C19_ClearGoals', 'C20_CareerConnection', 'C21_LongTermThinking',
    'C22_GenuineInterest', 'C23_SpecificGoals', 'C24_OpenDoors',
    'C25_Belonging', 'C26_SupportNetwork', 'C27_Respected',
    'C28_AuthenticSelf', 'C29_HandleChallenges', 'C30_SelfCare',
    
    // Section D
    'D1_PatternSequence', 'D2_MatrixPattern', 'D3_LetterPattern', 'D4_ProgressiveFill',
    'D5_Percentage', 'D6_WorkerDays', 'D7_PercentIncrease', 'D8_SpeedDistance',
    'D9_WeakenArgument', 'D10_LogicalFallacy', 'D11_CriticalQuestion', 'D12_Correlation',
    
    // Section E
    'E1_Strengths',
    'E2_SupportAreas',
    'E3_SupportPreference',
    'E4_CommunicationPreference',
    'E5_AdditionalInfo',
    'E6_SuccessVision',
    
    // Calculated Flags
    'Flag_Language',
    'Flag_Wellbeing',
    'Flag_Attention',
    'Flag_Reading',
    'Flag_NumericalProcessing',
    
    // Calculated Raw Scores
    'Score_WellbeingBaseline',
    'Score_Attention',
    'Score_Reading',
    'Score_NumericalProcessing',
    
    // Calculated Engagement Scores
    'Score_AcademicPreparedness',
    'Score_ClassroomEngagement',
    'Score_ReceptivityToSupport',
    'Score_FutureOrientation',
    'Score_BelongingWellbeing',
    'Score_TotalEngagement',
    'Score_GritIndicator',
    
    // Calculated Cognitive Scores
    'Score_AbstractReasoning',
    'Score_NumericalReasoning',
    'Score_CriticalThinking',
    'Score_TotalCognitive',
  ];
}

// Submit responses to Google Sheet
export async function submitToSheet(
  responses: AllResponses,
  scores: ScoreProfile
): Promise<{ success: boolean; error?: string }> {
  try {
    const sheets = getGoogleSheetsClient();
    const timestamp = new Date().toISOString();
    
    // First, check if headers exist
    const headerResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${RESPONSES_SHEET}!1:1`,
    });
    
    // If no headers, add them
    if (!headerResponse.data.values || headerResponse.data.values.length === 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: `${RESPONSES_SHEET}!A1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [getColumnHeaders()],
        },
      });
    }
    
    // Prepare and append the data row
    const rowData = prepareRowData(responses, scores, timestamp);
    
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${RESPONSES_SHEET}!A:A`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [rowData],
      },
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error submitting to Google Sheets:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}

// Initialize the sheets with proper structure
export async function initializeSheets(): Promise<boolean> {
  try {
    const sheets = getGoogleSheetsClient();
    
    // Check if Config sheet exists and has the status header
    try {
      const configResponse = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: `${CONFIG_SHEET}!A1:A2`,
      });
      
      if (!configResponse.data.values || configResponse.data.values.length === 0) {
        // Initialize Config sheet
        await sheets.spreadsheets.values.update({
          spreadsheetId: SHEET_ID,
          range: `${CONFIG_SHEET}!A1:A2`,
          valueInputOption: 'RAW',
          requestBody: {
            values: [['Test Status'], ['closed']],
          },
        });
      }
    } catch {
      // Config sheet might not exist - will need to be created manually
      console.log('Config sheet may need to be created');
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing sheets:', error);
    return false;
  }
}
