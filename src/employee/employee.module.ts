import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeSchema } from './employee.schema';
import { EmployeeService } from './employee.service';
import { EmployeeResolver } from './employee.resolver';
import { EmployeeRepositoryImpl } from './employee.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Employee', schema: EmployeeSchema }]),
  ],
  providers: [EmployeeService, EmployeeResolver,
    { provide: 'EmployeeRepository', useClass: EmployeeRepositoryImpl }
  ],
})
export class EmployeeModule {}
