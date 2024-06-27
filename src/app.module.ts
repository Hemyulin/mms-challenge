import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderModule } from './order/order.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { EmployeeModule } from './employee/employee.module';
import { CustomerModule } from './customer/customer.module';
import { LineItemModule } from './line-item/line-item.module';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';

@Module({
  imports: [
    MongooseModule.forRoot(`${MONGO_URI}/nest`),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
    }),
    OrderModule,
    EmployeeModule,
    CustomerModule,
    LineItemModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('graphql');
  }
}
