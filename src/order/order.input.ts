import { Field, InputType } from '@nestjs/graphql';
import { OrderStatus } from './order.status.enum';

@InputType()
export class EmployeeInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class OrderInput {
  @Field()
  customerId: string;

  @Field(() => [String])
  lineItems: string[];
}

@InputType()
export class UpdateOrderInput {
  @Field(() => OrderStatus)
  currentState: OrderStatus;

  @Field({ nullable: true })
  employee?: EmployeeInput;
}
