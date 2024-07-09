import { CustomerDocument } from "./customer.schema";

export interface CustomerRepository{
    findById(id: string): Promise<CustomerDocument>;
    findAll(): Promise<CustomerDocument[]>;
    create(customer: Partial<CustomerDocument>);
    update(id: string, updateData: Partial<CustomerDocument>):  Promise<CustomerDocument>;
}