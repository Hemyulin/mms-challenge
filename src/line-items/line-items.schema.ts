import { Schema } from 'mongoose';

export const LineItemsSchema = new Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
});

export interface LineItemsDocument extends Document {
  id: string;
  title: string;
  price: number;
}
