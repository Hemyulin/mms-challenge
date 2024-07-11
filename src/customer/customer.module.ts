import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerSchema } from './customer.schema';
import { CustomerResolver } from './customer.resolver';
import { CustomerService } from './customer.service';
import { CustomerRepositoryImpl } from './customer.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Customer', schema: CustomerSchema }]),
  ],
  providers: [CustomerService, CustomerResolver, {provide: 'CustomerRepository', useClass: CustomerRepositoryImpl}], 
})
export class CustomerModule {}
