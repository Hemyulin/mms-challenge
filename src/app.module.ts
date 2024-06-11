import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/nest'),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
    }),
    OrderModule,
  ],
})
export class AppModule {}
