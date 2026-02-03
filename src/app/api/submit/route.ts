import { NextRequest, NextResponse } from 'next/server';
import { submitToSheet, isTestOpen } from '@/lib/googleSheets';
import { AllResponses, ScoreProfile } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    // Check if test is open
    const testOpen = await isTestOpen();
    if (!testOpen) {
      return NextResponse.json(
        { error: 'Assessment is currently closed' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const { responses, scores } = body as { 
      responses: AllResponses; 
      scores: ScoreProfile;
    };
    
    // Validate required fields
    if (!responses?.studentInfo?.name) {
      return NextResponse.json(
        { error: 'Student name is required' },
        { status: 400 }
      );
    }
    
    if (!responses?.studentInfo?.intakeYear) {
      return NextResponse.json(
        { error: 'Intake year is required' },
        { status: 400 }
      );
    }
    
    if (!responses?.studentInfo?.program) {
      return NextResponse.json(
        { error: 'Program is required' },
        { status: 400 }
      );
    }
    
    // Submit to Google Sheets
    const result = await submitToSheet(responses, scores);
    
    if (result.success) {
      return NextResponse.json({ 
        success: true,
        message: 'Responses submitted successfully'
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to submit responses' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error submitting responses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
