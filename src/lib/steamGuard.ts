import crypto from 'crypto';

export class SteamGuard {
  private readonly sharedSecret: string;

  constructor(sharedSecret: string) {
    this.sharedSecret = sharedSecret;
  }

  private static getCurrentTime(): number {
    return Math.floor(Date.now() / 1000);
  }

  private static getTimeOffset(time: number): number {
    return Math.floor(time / 30);
  }

  generateCode(): { code: string; validUntil: Date } {
    const time = SteamGuard.getCurrentTime();
    const timeOffset = SteamGuard.getTimeOffset(time);

    // Декодируем shared_secret из base64
    const buffer = Buffer.from(this.sharedSecret, 'base64');
    
    // Создаем 8-байтовый буфер из timeOffset
    const timeBytes = Buffer.alloc(8);
    timeBytes.writeBigInt64BE(BigInt(timeOffset), 0);

    // Создаем HMAC из timeBytes используя shared_secret
    const hmac = crypto.createHmac('sha1', buffer);
    hmac.update(timeBytes);
    const hmacResult = hmac.digest();

    // Получаем начальную позицию для кода
    const start = hmacResult[19] & 0xf;

    // Генерируем код
    let code = (
      ((hmacResult[start] & 0x7f) << 24) |
      ((hmacResult[start + 1] & 0xff) << 16) |
      ((hmacResult[start + 2] & 0xff) << 8) |
      (hmacResult[start + 3] & 0xff)
    ).toString();

    // Steam использует только последние 5 цифр
    code = code.slice(-5);

    // Вычисляем время действия кода
    const validUntil = new Date((timeOffset + 1) * 30 * 1000);

    return { code, validUntil };
  }
} 