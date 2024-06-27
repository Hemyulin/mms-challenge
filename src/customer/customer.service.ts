import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CustomerDocument } from './customer.schema';
import { Model } from 'mongoose';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel('Customer') private customerModel: Model<CustomerDocument>,
  ) {}

  async Customer(id: string): Promise<CustomerDocument> {
    return this.customerModel.findById(id).exec();
  }

  async Customers(): Promise<CustomerDocument[]> {
    return this.customerModel.find().exec();
  }

  async createCustomer(
    name: string,
    email: string,
    password: string,
  ): Promise<CustomerDocument> {
    if (!name || !email || !password) {
      throw new BadRequestException('Not all fields given!');
    }
    const newCustomer = new this.customerModel({
      name,
      email,
      password,
    });
    return newCustomer.save();
  }
}
