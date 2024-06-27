import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { CustomerDocument } from './customer.schema';
import { Customer } from './customer.model';
import { CustomerService } from './customer.service';

@Resolver(() => Customer)
export class CustomerResolver {
  constructor(private readonly customerService: CustomerService) {}

  @Query(() => Customer)
  async getCustomer(@Args('id') id: string): Promise<CustomerDocument> {
    return this.customerService.getCustomer(id);
  }

  @Query(() => [Customer])
  async getCustomers(): Promise<CustomerDocument[]> {
    return this.customerService.getCustomers();
  }

  @Mutation(() => Customer)
  async createCustomer(
    @Args('name') name: string,
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<CustomerDocument> {
    return this.customerService.createCustomer(name, email, password);
  }

  @Mutation(() => Customer)
  async updateCustomer(
    @Args('id') id: string,
    @Args('name') name: string,
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<CustomerDocument> {
    return this.customerService.updateCustomer(id, { name, email, password });
  }
}
