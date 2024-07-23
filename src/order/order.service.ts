import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { OrderStatus } from './order.status.enum';
import { OrderDocument } from './order.schema';
import { Employee } from 'src/employee/employee.model';
import { OrderRepository } from './order.repository.interface';
import { EmployeeInput } from '../order/order.input';

@Injectable()
export class OrderService {
  constructor(
    @Inject('OrderRepository') private orderRepository: OrderRepository,
  ) {}

  async getOrder(id: string): Promise<OrderDocument> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid order id!');
    }
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new BadRequestException('Order not found!');
    }
    return order;
  }

  async getOrders(): Promise<OrderDocument[]> {
    return this.orderRepository.findAll();
  }

  async createOrder(
    customerId: string,
    lineItems: string[],
  ): Promise<OrderDocument> {
    if (!customerId) {
      throw new BadRequestException('Customer field cannot be empty!');
    }
    if (!lineItems || lineItems.length === 0) {
      throw new BadRequestException('Item list cannot be empty!');
    }
    return this.orderRepository.create({
      customer: customerId,
      lineItems,
      currentState: OrderStatus.OPEN,
    });
  }

  async updateOrder(
    id: string,
    currentState: OrderStatus,
    employee?: EmployeeInput,
  ): Promise<OrderDocument> {
    if (!id) {
      throw new BadRequestException('id field cannot be empty!');
    }

    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid order id!');
    }

    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new BadRequestException('Order not found');
    }

    if (currentState === OrderStatus.IN_PROGRESS) {
      if (order.currentState !== OrderStatus.OPEN) {
        throw new BadRequestException(
          `Invalid state transition from ${order.currentState} to ${currentState}`,
        );
      }
      if (!employee) {
        throw new BadRequestException(
          'Employee must be provided when setting order to IN_PROGRESS',
        );
      }

      order.employee = {
        id: '',
        ...employee,
      } as Employee;
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
