import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LineItemSchema } from './line-item.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'LineItem', schema: LineItemSchema }]),
  ],
  providers: [],
})
export class LineItemModule {}
