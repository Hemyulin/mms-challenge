import { Schema } from 'mongoose';

export const CustomerSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export interface CustomerDocument extends Document {
  id: string;
  name: string;
  email: string;
  password: string;
}
