import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from './order.model';
import { OrderStatus } from './order.status.enum';
import { OrderDocument } from './order.schema';
import { Employee } from 'src/employee/employee.model';
import { OrderInput, UpdateOrderInput } from './order.input';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Query(() => Order)
  async getOrder(@Args('id') id: string): Promise<OrderDocument> {
    const orderEntity = this.orderService.getOrder(id);
    return this.orderService.getOrder(id);
  }

  @Query(() => [Order])
  async getOrders(): Promise<OrderDocument[]> {
    const orderEntities = this.orderService.getOrders();
    return this.orderService.getOrders();
  }

  @Mutation(() => Order)
  async createOrder(@Args('input') input: OrderInput): Promise<OrderDocument> {
    const { customerId, lineItems } = input;
    return this.orderService.createOrder(customerId, lineItems);
  }

  @Mutation(() => Order)
  async updateOrder(
    @Args('id') id: string,
    @Args('input') input: UpdateOrderInput,
  ): Promise<OrderDocument> {
    const { currentState, employee } = input;
    return this.orderService.updateOrder(id, currentState, employee);
  }
}
