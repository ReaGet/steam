export interface Gift {
  id: string;
  title: string;
  link: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateGiftDTO = Omit<Gift, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateGiftDTO = Partial<CreateGiftDTO>; 