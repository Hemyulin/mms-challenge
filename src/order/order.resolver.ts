import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from './order.model';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Query(() => Order)
  getOrder(@Args('id') id: string): Order {
    const orderEntity = this.orderService.getOrder(id);
    return { ...orderEntity } as Order;
  }

  @Query(() => [Order])
  getOrders(): Order[] {
    const orderEntities = this.orderService.getOrders();
    return orderEntities.map((order) => ({ ...order }) as Order);
  }

  @Mutation(() => Order)
  createOrder(
    @Args('customer') customer: string,
    @Args('lineItems', { type: () => [String] }) lineItems: string[],
  ): Order {
    const orderEntity = this.orderService.createOrder(customer, lineItems);
    return { ...orderEntity } as Order; // Type casting to avoid conflicts
  }

  @Mutation(() => Order)
  updateOrder(
    @Args('id') id: string,
    @Args('currentState') currentState: string,
    @Args('employee', { nullable: true }) employee?: string,
  ): Order {
    const orderEntity = this.orderService.updateOrder(
      id,
      currentState,
      employee,
    );
    return { ...orderEntity } as Order; // Type casting to avoid conflicts
  }
}
