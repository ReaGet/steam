import puppeteer, { Browser, Page } from 'puppeteer';
import { decryptPassword } from './crypto';
import { SteamAccount } from '@/types/account';
import { db } from './db';
import { SteamGuard } from './steamGuard';

export class SteamAutomation {
  private browser: Browser | null = null;
  private page: Page | null = null;

  async init() {
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    this.page = await this.browser.newPage();
  }

  async authenticate(account: SteamAccount): Promise<boolean> {
    if (!this.page) throw new Error('Browser not initialized');

    try {
      await this.page.goto('https://store.steampowered.com/login');
      
      // Ввод логина и пароля
      await this.page.type('#input_username', account.login);
      const decryptedPassword = await decryptPassword(account.password);
      await this.page.type('#input_password', decryptedPassword);
      
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

        // Ждем успешного входа
        await this.page.waitForSelector('.profile_small_header_name', { 
          timeout: 5000 
        });
      }

      return true;
    } catch (error) {
      console.error('Authentication failed:', error);
      return false;
    }
  }

  async addFriend(profileLink: string): Promise<boolean> {
    if (!this.page) throw new Error('Browser not initialized');

    try {
      await this.page.goto(profileLink);
      
      // Клик по кнопке добавления в друзья
      await this.page.click('#btn_add_friend');
      
      // Ожидание подтверждения
      await this.page.waitForSelector('.friend_status_text', { timeout: 5000 });
      
      return true;
    } catch (error) {
      console.error('Failed to add friend:', error);
      return false;
    }
  }

  async sendGift(giftId: string, friendProfileLink: string): Promise<boolean> {
    if (!this.page) throw new Error('Browser not initialized');

    try {
      const gift = await db.get(`gifts?id=${giftId}`);

      if (!gift) throw new Error('Gift not found');

      // Переход на страницу игры
      await this.page.goto(gift.link);
      
      // Клик по кнопке покупки в подарок
      await this.page.click('#btn_purchase_gift');
      
      // Выбор друга из списка
      await this.page.type('.friend_search_text', friendProfileLink);
      await this.page.click('.friend_select_option');
      
      // Завершение покупки
      await this.page.click('#btn_purchase_submit');
      
      return true;
    } catch (error) {
      console.error('Failed to send gift:', error);
      return false;
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