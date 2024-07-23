import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { OrderSchema } from './order.schema';
import { OrderRepositoryImpl } from './order.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
  ],
  providers: [
    OrderService,
    OrderResolver,
    { provide: 'OrderRepository', useClass: OrderRepositoryImpl },
  ],
})
export class OrderModule {}
