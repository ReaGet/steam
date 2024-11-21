import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { WebhookPayload, WebhookResponse } from '@/types/webhook';
import { SteamAutomation } from '@/lib/puppeteer';

export async function POST(request: Request) {
  const automation = new SteamAutomation();
  
  try {
    const payload: WebhookPayload = await request.json();
    
    // Находим подходящий аккаунт по региону
    const accounts = await db.get(`accounts?region=${payload.region}&isAuthenticated=true`);
    const account = accounts[0];

    if (!account) {
      throw new Error(`No authenticated account found for region ${payload.region}`);
    }

    // Инициализируем браузер
    await automation.init();

    // Логируем начало задачи
    const taskLog = await db.post('logs', {
      accountId: account.id,
      action: 'authenticate',
      status: 'success',
      details: 'Starting task execution',
      timestamp: new Date().toISOString()
    });

    // Аутентификация
    const isAuthenticated = await automation.authenticate(account);
    if (!isAuthenticated) {
      throw new Error('Authentication failed');
    }

    // Добавление в друзья
    const friendAdded = await automation.addFriend(payload.profileLink);
    if (!friendAdded) {
      throw new Error('Failed to add friend');
    }

    await db.post('logs', {
      accountId: account.id,
      action: 'add_friend',
      status: 'success',
      details: `Added friend: ${payload.profileLink}`,
      timestamp: new Date().toISOString()
    });

    // Отправка подарка
    const giftSent = await automation.sendGift(payload.giftId, payload.profileLink);
    if (!giftSent) {
      throw new Error('Failed to send gift');
    }

    await db.post('logs', {
      accountId: account.id,
      action: 'send_gift',
      status: 'success',
      details: `Sent gift ${payload.giftId} to ${payload.profileLink}`,
      timestamp: new Date().toISOString()
    });

    const response: WebhookResponse = {
      status: 'success',
      message: 'Task completed successfully',
      logId: taskLog.id,
    };

    return NextResponse.json(response);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    await db.post('logs', {
      accountId: 'system',
      action: 'authenticate',
      status: 'error',
      details: errorMessage,
      timestamp: new Date().toISOString()
    });

    const response: WebhookResponse = {
      status: 'error',
      message: errorMessage,
    };

    return NextResponse.json(response, { status: 500 });

  } finally {
    await automation.close();
  }
} 