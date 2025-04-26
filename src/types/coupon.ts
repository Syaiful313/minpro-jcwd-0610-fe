export interface Coupon {
  id: number;
  userId: number;
  code: string;
  amount: number;
  discount: number;
  expirationDate: string; 
  isUsed: boolean;
  createdAt: string;
  updatedAt: string;
}
