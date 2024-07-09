import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { EmployeeRepository } from "./employee.repository.interface";
import { EmployeeDocument } from "./employee.schema";
import { isValidObjectId } from "mongoose";

@Injectable()
export class EmployeeService{
    constructor(@Inject('EmployeeRepository') private employeeRepository: EmployeeRepository){}

    async getEmployee(id: string): Promise<EmployeeDocument>{
        if(!isValidObjectId(id)){
            throw new BadRequestException('Invalid employee id!')
        }
        const employee = await this.employeeRepository.findById(id)
        if(!employee){
            throw new BadRequestException('Employee not found!')
        }
        return employee
    }

    async getEmployees(): Promise<EmployeeDocument[]>{
        return this.employeeRepository.findAll()
    }

    async createEmployee(
        name: string,
        email: string,
        password: string,
    ): Promise<EmployeeDocument>{
        if(!name || !email || !password){
            throw new BadRequestException('All fields must be proviced!')
        }
        return this.employeeRepository.create({ name, email, password })
    }

    async updateEmployee(
        id: string,
        updateData: Partial<EmployeeDocument>,
    ): Promise<EmployeeDocument>{
        if(!isValidObjectId(id)){
            throw new BadRequestException('Invalid employee id');
        }
        const employee = await this.employeeRepository.findById(id)
        if(!employee){
            throw new BadRequestException("Employee not found!")
        }
        return this.employeeRepository.update(id, updateData)
    }
}