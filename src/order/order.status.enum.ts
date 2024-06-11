import { registerEnumType } from '@nestjs/graphql';

export enum OrderStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETE = 'COMPLETE',
}

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
});
