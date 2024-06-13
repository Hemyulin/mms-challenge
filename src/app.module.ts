import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderModule } from './order/order.module';
import { DateScalar } from './graphql/date.scalar';

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
  providers: [DateScalar],
})
export class AppModule {}
