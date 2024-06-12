import { registerEnumType } from '@nestjs/graphql';

export enum Employees {
  NoEmployee = 'NoEmployee',
  Ralph = 'Ralph',
  Uwe = 'Uwe',
  Nancy = 'Nancy',
  Martina = 'Martina',
  Helmut = 'Helmut',
}

registerEnumType(Employees, {
  name: 'Employees',
});
