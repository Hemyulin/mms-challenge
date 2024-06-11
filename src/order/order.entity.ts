import { OrderStatus } from './order.status.enum';

export interface OrderEntity {
  id: string;
  currentState: OrderStatus;
  customer: string;
  employee: string;
  lineItems: string[];
  createdAt: string;
  updatedAt: string;
}
