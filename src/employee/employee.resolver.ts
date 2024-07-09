import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";
import { Employee } from "./employee.model";
import { EmployeeService } from "./employee.service";
import { EmployeeDocument } from "./employee.schema";

@Resolver(() => Employee)
export class EmployeeResolver{
    constructor(private readonly employeeService: EmployeeService){}

    @Query(() => Employee)
    async getEmployee(@Args('id') id: string): Promise<EmployeeDocument>{
        return this.employeeService.getEmployee(id)
    }

    @Query(() => [Employee])
    async getEmployees(): Promise<EmployeeDocument[]>{
        return this.employeeService.getEmployees()
    }

    @Mutation(() => Employee)
    async createEmployee(
        @Args('name') name: string,
        @Args('email') email: string,
        @Args('password') password: string,
    ): Promise<EmployeeDocument>{
        return this.employeeService.createEmployee(name, email, password)
    }

    @Mutation(() => Employee)
    async updateEmployee(
        @Args('id') id: string,
        @Args('name') name: string,
        @Args('email') email: string,
        @Args('password') password: string,
    ): Promise<EmployeeDocument>{
        return this.employeeService.updateEmployee(id, { name, email, password })
    }
}