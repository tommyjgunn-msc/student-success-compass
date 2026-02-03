import { NextRequest, NextResponse } from 'next/server';
import { toggleTestStatus } from '@/lib/googleSheets';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, status } = body;
    
    // Verify admin key
    if (!key || key !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Validate status
    if (status !== 'open' && status !== 'closed') {
      return NextResponse.json(
        { error: 'Invalid status. Must be "open" or "closed"' },
        { status: 400 }
      );
    }
    
    // Toggle status
    const success = await toggleTestStatus(status);
    
    if (success) {
      return NextResponse.json({ 
        success: true,
        status: status,
        message: `Test portal is now ${status}`
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to update status' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error toggling status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
