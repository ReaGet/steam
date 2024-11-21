export interface WebhookPayload {
  profileLink: string;
  region: string;
  giftId: string;
}

export interface WebhookResponse {
  status: 'success' | 'error';
  message: string;
  logId?: string;
}

export interface TaskLog {
  id: string;
  timestamp: Date;
  accountId: string;
  action: 'authenticate' | 'add_friend' | 'send_gift';
  status: 'success' | 'error';
  details: string;
} 