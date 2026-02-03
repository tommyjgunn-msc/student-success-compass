import { NextRequest, NextResponse } from 'next/server';
import { isTestOpen } from '@/lib/googleSheets';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const key = searchParams.get('key');
  
  try {
    const status = await isTestOpen();
    
    // If key is provided, check if it's the admin key
    if (key) {
      const isAdmin = key === process.env.ADMIN_SECRET_KEY;
      return NextResponse.json({
        isOpen: status,
        authorized: isAdmin,
      });
    }
    
    // Public request - just return status
    return NextResponse.json({ isOpen: status });
  } catch (error) {
    console.error('Error checking status:', error);
    return NextResponse.json(
      { error: 'Failed to check status', isOpen: false },
      { status: 500 }
    );
  }
}
