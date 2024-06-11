import { Field, ID, ObjectType } from '@nestjs/graphql';
import { OrderStatus } from './order.status.enum';

@ObjectType()
export class Order {
  @Field(() => ID)
  id: string;

  @Field(() => OrderStatus)
  currentState: OrderStatus;

  @Field()
  customer: string;

  @Field()
  employee: string;

  @Field(() => [String])
  lineItems: string[];

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}
