import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { OrderSchema } from './order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
  ],
  providers: [OrderService, OrderResolver],
})
export class OrderModule {}
