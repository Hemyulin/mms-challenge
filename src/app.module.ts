import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderModule } from './order/order.module';

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
export class AppModule {}
