import { Injectable } from "@nestjs/common";
import { OrderRepository } from "./order.repository.interface";
import { OrderDocument } from "./order.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class OrderRepositoryImpl implements OrderRepository{
    constructor(
        @InjectModel('Order') private orderModel: Model<OrderDocument>){}
    
    async findById(id: string): Promise<OrderDocument> {
        return this.orderModel.findById(id).exec();
    }

    async findAll(): Promise<OrderDocument[]> {
        return this.orderModel.find().exec()
    }

    async create(order: Partial<OrderDocument>): Promise<OrderDocument> {
        const newOrder = new this.orderModel(order)
        return newOrder.save()
    }

    async update(id: string, updateData: Partial<OrderDocument>): Promise<OrderDocument> {
        return this.orderModel.findByIdAndUpdate(id, updateData, { new: true }).exec()
    }
}