import { Injectable } from "@nestjs/common";
import { EmployeeRepository } from "./employee.repository.interface";
import { InjectModel } from "@nestjs/mongoose";
import { EmployeeDocument } from "./employee.schema";
import { Model } from "mongoose";

@Injectable()
export class EmployeeRepositoryImpl implements EmployeeRepository {
    constructor(
        @InjectModel('Employee') private employeeModel: Model<EmployeeDocument>,
    ){}

    async findById(id: string): Promise<EmployeeDocument> {
        return this.employeeModel.findById(id).exec()
    }

    async findAll(): Promise<EmployeeDocument[]> {
        return this.employeeModel.find().exec()
    }

    async create(employee: Partial<EmployeeDocument>): Promise<EmployeeDocument> {
        const newEmployee = new this.employeeModel(employee)
        return newEmployee.save()
    }

    async update(id: string, updateData: Partial<EmployeeDocument>): Promise<EmployeeDocument> {
      return this.employeeModel.findByIdAndUpdate(id, updateData, {new: true}).exec()  
    }
}
