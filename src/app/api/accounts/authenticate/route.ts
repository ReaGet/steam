import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { SteamAutomation } from '@/lib/puppeteer';

export async function POST(request: Request) {
  const automation = new SteamAutomation();
  
  try {
    const { accountId } = await request.json();
    
    // Получаем аккаунт
    const accounts = await db.get(`accounts?id=${accountId}`);
    const account = accounts[0];
    
    if (!account) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    // Инициализируем браузер
    await automation.init();

    // Пытаемся аутентифицироваться
    const { success, cookies } = await automation.authenticate(account);

    if (!success) {
      throw new Error('Authentication failed');
    }

    // Обновляем статус аккаунта
    await db.put(`accounts/${accountId}`, {
      ...account,
      isAuthenticated: true,
      lastAuthenticated: new Date().toISOString(),
    });

    // Создаем лог
    await db.post('logs', {
      accountId,
      action: 'authenticate',
      status: 'success',
      details: 'Successfully authenticated',
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ 
      success: true,
      cookies 
    });

  } catch (error) {
    console.error('Authentication error:', error);

    // Логируем ошибку
    await db.post('logs', {
      accountId: 'system',
      action: 'authenticate',
      status: 'error',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  } finally {
    await automation.close();
  }
} 