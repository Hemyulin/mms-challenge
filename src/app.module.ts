import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderModule } from './order/order.module';
import { LoggerMiddleware } from './middleware/logger.middleware';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';

@Module({
  imports: [
    MongooseModule.forRoot(`${MONGO_URI}/nest`),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
    }),
    OrderModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('graphql');
  }
}
