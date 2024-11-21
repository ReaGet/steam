export interface SteamAccount {
  id: string;
  login: string;
  password: string;
  region: string;
  isAuthenticated: boolean;
  lastAuthenticated?: Date;
}

export type CreateAccountDTO = Omit<SteamAccount, 'id' | 'isAuthenticated'>;
export type UpdateAccountDTO = Partial<CreateAccountDTO>; 