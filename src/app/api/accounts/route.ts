import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { CreateAccountDTO } from '@/types/account';

export async function GET() {
  try {
    const accounts = await db.get('accounts');
    return NextResponse.json(accounts);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch accounts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data: CreateAccountDTO = await request.json();

    // Валидация
    if (!data.login || !data.password || !data.region) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const account = await db.post('accounts', {
      ...data,
      isAuthenticated: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json(account);
  } catch (error) {
    console.error('Account creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...data } = await request.json();

    // Валидация
    if (!data.login || !data.region) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const account = await db.put(`accounts/${id}`, {
      ...data,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json(account);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update account' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await db.delete(`accounts/${id}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
} 