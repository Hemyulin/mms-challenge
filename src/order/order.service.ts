import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { OrderStatus } from './order.status.enum';
import { OrderDocument } from './order.schema';
import { Employees } from './employees.enum';

@Injectable()
export class OrderService {
  constructor(@InjectModel('Order') private orderModel: Model<OrderDocument>) {}

  async getOrder(id: string): Promise<OrderDocument> {
    return this.orderModel.findById(id).exec();
  }

  async getOrders(): Promise<OrderDocument[]> {
    return this.orderModel.find().exec();
  }

  async createOrder(
    customer: string,
    lineItems: string[],
  ): Promise<OrderDocument> {
    if (!customer) {
      throw new BadRequestException('Customer field cannot be empty!');
    }
    if (!lineItems || lineItems.length === 0) {
      throw new BadRequestException('Item list cannot be empty!');
    }
    const newOrder = new this.orderModel({
      currentState: OrderStatus.OPEN,
      customer,
      lineItems,
    });
    return newOrder.save();
  }

  async updateOrder(
    id: string,
    currentState: OrderStatus,
    employee?: Employees,
  ): Promise<OrderDocument> {
    if (!id) {
      throw new BadRequestException('id field cannot be empty!');
    }

    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid order id!');
    }
    const order = await this.orderModel.findById(id).exec();

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    if (currentState === OrderStatus.IN_PROGRESS) {
      if (order.currentState !== OrderStatus.OPEN) {
        throw new BadRequestException(
          `Invalid state transition from ${order.currentState} to ${currentState}`,
        );
      }
      if (employee === Employees.NoEmployee) {
        throw new BadRequestException(
          'Employee must be provided when setting order to IN_PROGRESS',
        );
      }
      order.employee = employee;
    } else if (currentState === OrderStatus.COMPLETE) {
      if (order.currentState !== OrderStatus.IN_PROGRESS) {
        throw new BadRequestException(
          `Invalid state transition from ${order.currentState} to ${currentState}`,
        );
      }
    } else if (currentState === OrderStatus.OPEN) {
      throw new BadRequestException('Cannot transition back to OPEN state');
    }

    order.currentState = currentState;
    order.updatedAt = new Date();
    return order.save();
  }
}
