export interface TwoFactorAuth {
  id: string;
  accountId: string;
  sharedSecret: string; // Секретный ключ для генерации кодов
  revocationCode: string; // Код для отзыва аутентификатора
  identitySecret: string; // Для подтверждения торговых предложений
  createdAt: Date;
}

export interface SteamGuardCode {
  code: string;
  validUntil: Date;
} 