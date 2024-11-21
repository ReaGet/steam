interface SessionData {
  accountId: string;
  cookies: string[];
  lastAuthenticated: string;
}

export class SessionManager {
  private static readonly STORAGE_KEY = 'steam_sessions';

  static saveSession(accountId: string, cookies: string[]): void {
    const sessions = this.getSessions();
    sessions[accountId] = {
      accountId,
      cookies,
      lastAuthenticated: new Date().toISOString()
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessions));
  }

  static getSession(accountId: string): SessionData | null {
    const sessions = this.getSessions();
    return sessions[accountId] || null;
  }

  static removeSession(accountId: string): void {
    const sessions = this.getSessions();
    delete sessions[accountId];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessions));
  }

  private static getSessions(): Record<string, SessionData> {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  }
} 