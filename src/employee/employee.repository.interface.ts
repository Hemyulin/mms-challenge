import { EmployeeDocument } from "./employee.schema";

export interface EmployeeRepository {
    findById(id: string): Promise<EmployeeDocument>
    findAll(): Promise<EmployeeDocument[]>
    create(employee: Partial<EmployeeDocument>): Promise<EmployeeDocument>;
    update(id: string, updateData: Partial<EmployeeDocument>): Promise<EmployeeDocument>
}