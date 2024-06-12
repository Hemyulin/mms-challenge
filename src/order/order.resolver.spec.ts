import { Test, TestingModule } from '@nestjs/testing';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';
import { OrderStatus } from './order.status.enum';
import { Employees } from './employees.enum';
import { Order } from './order.model';

describe('OrderResolver', () => {
  let resolver: OrderResolver;
  let service: OrderService;

  const mockOrder = {
    id: 'someOrderId',
    currentState: OrderStatus.OPEN,
    customer: 'Test Customer',
    employee: Employees.NoEmployee,
    lineItems: ['item1', 'item2'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockOrderService = {
    getOrder: jest.fn().mockResolvedValue(mockOrder),
    getOrders: jest.fn().mockResolvedValue([mockOrder]),
    createOrder: jest.fn().mockResolvedValue(mockOrder),
    updateOrder: jest.fn().mockResolvedValue(mockOrder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderResolver,
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    resolver = module.get<OrderResolver>(OrderResolver);
    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should get an order by id', async () => {
    const id = 'someOrderId';
    const result = await resolver.getOrder(id);
    expect(result).toEqual(mockOrder);
    expect(service.getOrder).toHaveBeenCalledWith(id);
  });

  it('should get all orders', async () => {
    const result = await resolver.getOrders();
    expect(result).toEqual([mockOrder]);
    expect(service.getOrders).toHaveBeenCalled();
  });

  it('should create a new order', async () => {
    const customer = 'Test Customer';
    const lineItems = ['item1', 'item2'];
    const result = await resolver.createOrder(customer, lineItems);
    expect(result).toEqual(mockOrder);
    expect(service.createOrder).toHaveBeenCalledWith(customer, lineItems);
  });

  it('should update an order', async () => {
    const id = 'someOrderId';
    const currentState = OrderStatus.IN_PROGRESS;
    const employee = Employees.Ralph;
    const result = await resolver.updateOrder(id, currentState, employee);
    expect(result).toEqual(mockOrder);
    expect(service.updateOrder).toHaveBeenCalledWith(
      id,
      currentState,
      employee,
    );
  });
});
