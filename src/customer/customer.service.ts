import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CustomerDocument } from './customer.schema';
import { isValidObjectId } from 'mongoose';
import { CustomerRepository } from './customer.repository.interface';

@Injectable()
export class CustomerService {
  constructor(
    @Inject('CustomerRepository') private customerRepository: CustomerRepository) {}

  async getCustomer(id: string): Promise<CustomerDocument> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid customer id!');
    }
    const customer = await this.customerRepository.findById(id)
    if (!customer) {
      throw new BadRequestException('Customer not found');
    }
    return customer;
  }


  async getCustomers(): Promise<CustomerDocument[]> {
    return this.customerRepository.findAll()
  }

  async createCustomer(
    name: string,
    email: string,
    password: string,
  ): Promise<CustomerDocument> {
    if (!name || !email || !password) {
      throw new BadRequestException('All fields must be provided');
    }
    return this.customerRepository.create({name, email, password })
  }

  async updateCustomer(
    id: string,
    updateData: Partial<CustomerDocument>,
  ): Promise<CustomerDocument> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid customer id!');
    }
    const customer = await this.customerRepository.findById(id)
    if (!customer) {
      throw new BadRequestException('Customer not found');
    }
    return this.customerRepository.update(id, updateData)
  }
}
