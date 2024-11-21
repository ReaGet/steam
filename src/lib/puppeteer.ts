import puppeteer, { Browser, Page } from 'puppeteer';
import { SteamAccount } from '@/types/account';
import { SteamGuard } from './steamGuard';
import { db } from './db';

export class SteamAutomation {
  private browser: Browser | null = null;
  private page: Page | null = null;

  async init() {
    this.browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    this.page = await this.browser.newPage();
  }

  async authenticate(account: SteamAccount): Promise<{ success: boolean; cookies: string[] }> {
    if (!this.page) throw new Error('Browser not initialized');

    try {
      await this.page.goto('https://store.steampowered.com/login');
      
      // Ввод логина и пароля
      await this.page.type('#input_username', account.login);
      await this.page.type('#input_password', account.password);
      
      // Клик по кнопке входа
      await this.page.click('#login_btn_signin > button');
      
      // Ожидание либо успешного входа, либо запроса 2FA
      const twoFactorPrompt = await this.page.waitForSelector('#twofactorcode_entry', { 
        timeout: 5000 
      }).catch(() => null);

      if (twoFactorPrompt) {
        // Получаем 2FA данные
        const twoFactorAuth = await db.get(`twoFactorAuth?accountId=${account.id}`);

        if (!twoFactorAuth) {
          throw new Error('2FA required but no secrets found');
        }

        // Генерируем код
        const steamGuard = new SteamGuard(twoFactorAuth.sharedSecret);
        const { code } = steamGuard.generateCode();

        // Вводим код
        await this.page.type('#twofactorcode_entry', code);
        await this.page.click('#login_twofactorauth_buttonset_entercode > div.auth_button.leftbtn > div.auth_button_h5');
      }

      // Ждем успешного входа
      await this.page.waitForSelector('.profile_small_header_name', { 
        timeout: 10000 
      });

      // Получаем cookies
      const cookies = await this.page.cookies();
      
      return {
        success: true,
        cookies: cookies.map(cookie => `${cookie.name}=${cookie.value}`)
      };

    } catch (error) {
      console.error('Authentication failed:', error);
      return { success: false, cookies: [] };
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }
} 