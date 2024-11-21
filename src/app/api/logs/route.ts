import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const accountId = searchParams.get('accountId');
  const action = searchParams.get('action');

  try {
    let endpoint = 'logs?_sort=timestamp&_order=desc';
    if (accountId) endpoint += `&accountId=${accountId}`;
    if (action) endpoint += `&action=${action}`;

    const logs = await db.get(endpoint);
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch logs' },
      { status: 500 }
    );
  }
} 