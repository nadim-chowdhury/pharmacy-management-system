export enum UserRole {
  ADMIN = 'ADMIN',
  CASHIER = 'CASHIER',
  MANAGER = 'MANAGER',
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface Medicine {
  id: string;
  name: string;
  generic_name: string;
  brand: string;
  barcode: string;
  price: number;
  stock_quantity: number;
  discount_percentage: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  is_business: boolean;
}

export interface OrderItem {
  medicineId: string;
  quantity: number;
  medicine?: Medicine;
}

export interface Order {
  id?: string;
  customerId?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total_amount: number;
}

export enum PaymentStatus {
  PAID = 'PAID',
  PARTIAL = 'PARTIAL',
  DUE = 'DUE',
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  MFS = 'MFS',
}

export interface Payment {
  id?: string;
  orderId: string;
  paymentMethod: PaymentMethod;
  amountPaid: number;
  amountDue: number;
  changeDue: number;
  status: PaymentStatus;
}
