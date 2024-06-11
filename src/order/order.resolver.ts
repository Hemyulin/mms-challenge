import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from './order.model';
import { OrderStatus } from './order.status.enum';
import { OrderDocument } from './order.schema';

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
  async createOrder(
    @Args('customer') customer: string,
    @Args('lineItems', { type: () => [String] }) lineItems: string[],
  ): Promise<OrderDocument> {
    return this.orderService.createOrder(customer, lineItems);
  }

  @Mutation(() => Order)
  async updateOrder(
    @Args('id') id: string,
    @Args('currentState', { type: () => OrderStatus })
    currentState: OrderStatus,
    @Args('employee') employee: string,
  ): Promise<OrderDocument> {
    return this.orderService.updateOrder(id, currentState, employee);
  }
}
