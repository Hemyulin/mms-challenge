import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderService } from './order.service';
import { OrderDocument } from './order.schema';
import { OrderStatus } from './order.status.enum';
import { Employees } from './employees.enum';
import { BadRequestException } from '@nestjs/common';

// Mock data
const mockOrder = {
  _id: 'someOrderId',
  currentState: OrderStatus.OPEN,
  customer: 'Test Customer',
  employee: Employees.NoEmployee,
  lineItems: ['item1', 'item2'],
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Mock model class
class MockOrderModel {
  constructor(private data) {
    this.save = jest.fn().mockResolvedValue(this.data);
  }

  save: jest.Mock<any, any>;

  static findById = jest.fn().mockResolvedValue(mockOrder);
  static find = jest.fn().mockResolvedValue([mockOrder]);
  static create = jest.fn().mockImplementation((data) => {
    const instance = new MockOrderModel(data);
    return instance; // Return the instance directly, no need to resolve as Promise
  });
  static deleteMany = jest.fn().mockResolvedValue(true);
}

describe('OrderService', () => {
  let service: OrderService;
  let model: Model<OrderDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getModelToken('Order'),
          useValue: MockOrderModel,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    model = module.get<Model<OrderDocument>>(getModelToken('Order'));

    // Reset the mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get an order by id', async () => {
    const id = 'someOrderId';
    MockOrderModel.findById.mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockOrder),
    });
    const order = await service.getOrder(id);
    expect(order).toEqual(mockOrder);
    expect(MockOrderModel.findById).toHaveBeenCalledWith(id);
  });

  it('should get all orders', async () => {
    MockOrderModel.find.mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce([mockOrder]),
    });
    const orders = await service.getOrders();
    expect(orders).toEqual([mockOrder]);
    expect(MockOrderModel.find).toHaveBeenCalled();
  });

  it('should create a new order', async () => {
    const customer = 'New Customer';
    const lineItems = ['item1', 'item2'];
    const newOrderData = {
      currentState: OrderStatus.OPEN,
      customer,
      lineItems,
      employee: Employees.NoEmployee,
    };

    const createdOrder = await service.createOrder(customer, lineItems);
    expect(createdOrder.customer).toEqual(customer);
    expect(createdOrder.lineItems).toEqual(lineItems);

    // Check if create was called
    expect(MockOrderModel.create).toHaveBeenCalledWith(newOrderData);
    // Log actual call for debugging
    console.log('Called with:', MockOrderModel.create.mock.calls);
  });

  it('should throw an error if customer is missing', async () => {
    await expect(service.createOrder('', ['item1'])).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should update an order', async () => {
    const id = 'someOrderId';
    const currentState = OrderStatus.IN_PROGRESS;
    const employee = Employees.Ralph;

    MockOrderModel.findById.mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(new MockOrderModel(mockOrder)),
    });

    const updatedOrder = await service.updateOrder(id, currentState, employee);
    expect(updatedOrder.currentState).toEqual(OrderStatus.IN_PROGRESS);
    expect(updatedOrder.employee).toEqual(Employees.Ralph);
    expect(MockOrderModel.findById).toHaveBeenCalledWith(id);
  });

  it('should throw an error if order id is invalid', async () => {
    MockOrderModel.findById.mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(null),
    });

    await expect(
      service.updateOrder(
        'invalid-id',
        OrderStatus.IN_PROGRESS,
        Employees.Ralph,
      ),
    ).rejects.toThrow(BadRequestException);
  });
});
