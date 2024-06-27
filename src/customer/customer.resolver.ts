import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { CustomerDocument } from './customer.schema';
import { Customer } from './customer.model';
import { CustomerService } from './customer.service';

@Resolver(() => Customer)
export class CustomerResolver {
  constructor(private readonly customerService: CustomerService) {}

  @Query(() => Customer)
  async Customer(@Args('id') id: string): Promise<CustomerDocument> {
    const customerEntity = this.customerService.Customer(id);
    return this.customerService.Customer(id);
  }

  @Query(() => [Customer])
  async Customers(): Promise<CustomerDocument[]> {
    return this.customerService.Customers();
  }

  @Mutation(() => Customer)
  async createCustomer(
    @Args('name') name: string,
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<CustomerDocument> {
    return this.customerService.createCustomer(name, email, password);
  }
}
