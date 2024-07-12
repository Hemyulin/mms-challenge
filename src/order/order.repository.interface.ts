import { OrderDocument } from "./order.schema"

export interface OrderRepository {
    findById(id: string): Promise<OrderDocument>
    findAll(): Promise<OrderDocument[]>
    create(order: Partial<OrderDocument>): Promise<OrderDocument>
    update(id: string, updateData: Partial<OrderDocument>): Promise<OrderDocument>
}