import { Schema } from 'mongoose';

export const LineItemSchema = new Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
});

export interface LineItemDocument extends Document {
  id: string;
  title: string;
  price: number;
}
