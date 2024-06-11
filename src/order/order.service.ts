import { Injectable, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { OrderStatus } from './order.status.enum';

interface OrderEntity {
  id: string;
  currentState: OrderStatus;
  customer: string;
  employee: string;
  lineItems: string[];
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class OrderService {
  private orders: OrderEntity[] = [];

  createOrder(customer: string, lineItems: string[]): OrderEntity {
    const newOrder: OrderEntity = {
      id: uuidv4(),
      currentState: OrderStatus.OPEN,
      customer,
      employee: '',
      lineItems,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.orders.push(newOrder);
    return newOrder;
  }

  getOrder(id: string): OrderEntity {
    return this.orders.find((order) => order.id === id);
  }

  getOrders(): OrderEntity[] {
    return this.orders;
  }

  updateOrder(
    id: string,
    currentState: OrderStatus,
    employee?: string,
  ): OrderEntity {
    const order = this.orders.find((order) => order.id === id);
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
    order.updatedAt = new Date().toISOString();
    return order;
  }
}
