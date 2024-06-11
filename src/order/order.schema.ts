import { Schema } from 'mongoose';
import { OrderStatus } from './order.status.enum';

export const OrderSchema = new Schema({
  currentState: { type: String, enum: OrderStatus, default: OrderStatus.OPEN },
  customer: { type: String, required: true },
  employee: { type: String, default: '' },
  lineItems: { type: [String], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export interface OrderDocument extends Document {
  id: string;
  currentState: OrderStatus;
  customer: string;
  employee: string;
  lineItems: string[];
  createdAt: Date;
  updatedAt: Date;
}
