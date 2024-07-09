import { Field, ID, ObjectType } from '@nestjs/graphql';
import { OrderStatus } from './order.status.enum';
import { Employee } from '../employee/employee.model';

@ObjectType()
export class Order {
  @Field(() => ID)
  id: string;

  @Field(() => OrderStatus)
  currentState: OrderStatus;

  @Field()
  customer: string;

  @Field(() => Employee)
  employee: Employee;

  @Field(() => [String])
  lineItems: string[];

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}
