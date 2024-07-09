import { Injectable } from "@nestjs/common";
import { CustomerRepository } from "./customer.repository.interface";
import { InjectModel } from "@nestjs/mongoose";
import { CustomerDocument } from "./customer.schema";
import { Model } from "mongoose";

@Injectable()
export class CustomerRepositoryImpl implements CustomerRepository{
    constructor(@InjectModel('Customer') private customerModel: Model<CustomerDocument>){}

    async findById(id: string): Promise<CustomerDocument> {
        return this.customerModel.findById(id).exec()
    }
    
    async findAll(): Promise<CustomerDocument[]> {
        return this.customerModel.find().exec()
    }
    async create(customer: Partial<CustomerDocument>): Promise<CustomerDocument> {
        const newCustomer = new this.customerModel(customer)
        return newCustomer.save()
    }

    async update(id: string, updateData: Partial<CustomerDocument>): Promise<CustomerDocument> {
        return this.customerModel.findByIdAndUpdate(id, updateData, {new: true}).exec()
    }
}