import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

// Interface for typecheck
interface OrderEntity {
  id: string;
  currentState: string;
  customer: string;
  employee: string;
  lineItems: string[];
  createdAt: string;
  updatedAt: string;
}

// creating a new order
@Injectable()
export class OrderService {
  private orders: OrderEntity[] = [];

  createOrder(customer: string, lineItems: string[]): OrderEntity {
    const newOrder: OrderEntity = {
      id: uuidv4(),
      currentState: 'OPEN',
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

  updateOrder(id: string, currentState: string, employee: string): OrderEntity {
    const order = this.orders.find((order) => order.id === id);
    if (order) {
      order.currentState = currentState;
      if (currentState === 'IN_PROGRESS' && employee) {
        order.employee = employee;
      }
      order.updatedAt = new Date().toISOString();
    }
    return order;
  }
}
