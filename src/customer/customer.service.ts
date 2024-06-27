import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CustomerDocument } from './customer.schema';
import { Model, isValidObjectId } from 'mongoose';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel('Customer') private customerModel: Model<CustomerDocument>,
  ) {}

  async getCustomer(id: string): Promise<CustomerDocument> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid customer id!');
    }
    const customer = await this.customerModel.findById(id).exec();
    if (!customer) {
      throw new BadRequestException('Customer not found');
    }
    return customer;
  }

  async getCustomers(): Promise<CustomerDocument[]> {
    return this.customerModel.find().exec();
  }

  async createCustomer(
    name: string,
    email: string,
    password: string,
  ): Promise<CustomerDocument> {
    if (!name || !email || !password) {
      throw new BadRequestException('All fields must be provided');
    }
    const newCustomer = new this.customerModel({
      name,
      email,
      password,
    });
    return newCustomer.save();
  }

  async updateCustomer(
    id: string,
    updateData: Partial<CustomerDocument>,
  ): Promise<CustomerDocument> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid customer id!');
    }
    const customer = await this.customerModel.findById(id).exec();
    if (!customer) {
      throw new BadRequestException('Customer not found');
    }
    Object.assign(customer, updateData);
    return customer.save();
  }
}
