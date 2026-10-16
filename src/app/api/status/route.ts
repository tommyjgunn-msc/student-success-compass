import { NextResponse } from 'next/server';
import { getStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

// Public: whether the Compass is accepting answers. Nothing else.
export async function GET() {
  return NextResponse.json({ open: await getStore().isOpen() });
}
