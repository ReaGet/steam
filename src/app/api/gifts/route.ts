import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { CreateGiftDTO } from '@/types/gift';

export async function GET() {
  try {
    const gifts = await db.get('gifts');
    return NextResponse.json(gifts);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch gifts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data: CreateGiftDTO = await request.json();

    // Валидация
    if (!data.title || !data.link || typeof data.price !== 'number') {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Проверка формата ссылки Steam
    if (!data.link.startsWith('https://store.steampowered.com/')) {
      return NextResponse.json(
        { error: 'Invalid Steam store link' },
        { status: 400 }
      );
    }

    const gift = await db.post('gifts', {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json(gift);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create gift' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...data } = await request.json();

    // Валидация
    if (!data.title || !data.link || typeof data.price !== 'number') {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Проверка формата ссылки Steam
    if (!data.link.startsWith('https://store.steampowered.com/')) {
      return NextResponse.json(
        { error: 'Invalid Steam store link' },
        { status: 400 }
      );
    }

    const gift = await db.put(`gifts/${id}`, {
      ...data,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json(gift);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update gift' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await db.delete(`gifts/${id}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete gift' },
      { status: 500 }
    );
  }
} 