import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { sharedSecret, revocationCode, identitySecret } = await request.json();

    const twoFactorAuth = await db.post('twoFactorAuth', {
      accountId: params.id,
      sharedSecret,
      revocationCode,
      identitySecret,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json(twoFactorAuth);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to setup 2FA' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await db.delete(`twoFactorAuth?accountId=${params.id}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to remove 2FA' },
      { status: 500 }
    );
  }
} 