import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Order {
  @Field(() => ID)
  id: string;

  @Field()
  currentState: string;

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
