import { Resolver, Query } from '@nestjs/graphql';
import { AppService } from './app.service';

@Resolver('Query')
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Query(() => String)
  hello() {
    return this.appService.getHello();
  }
}
