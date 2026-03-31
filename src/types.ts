export interface Product {
  id: string;
  uid: string;
  title: string;
  description?: string;
  category: string;
  brand?: string;
  size?: string;
  purchasePrice: number;
  isSold: boolean;
  salePrice?: number;
  purchaseDate: Date;
  saleDate?: Date;
  createdAt: Date;
}
