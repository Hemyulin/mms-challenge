import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Model } from 'mongoose';
import { OrderDocument } from '../src/order/order.schema';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';

describe('GraphQL API (e2e)', () => {
  let app: INestApplication;
  let orderModel: Model<OrderDocument>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, MongooseModule.forRoot(`${MONGO_URI}/nest_test`)],
    }).compile();

    app = moduleFixture.createNestApplication();
    orderModel = moduleFixture.get<Model<OrderDocument>>(
      getModelToken('Order'),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await orderModel.deleteMany({});
  });

  afterEach(async () => {
    await orderModel.deleteMany({});
  });

  it('should retrieve a single order by id', async () => {
    const createOrderMutation = `
      mutation {
        createOrder(customer: "getOrderTest", lineItems: ["item5", "item6"]) {
          id
          customer
          currentState
          employee
          lineItems
          createdAt
          updatedAt
        }
      }
    `;

    const createResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: createOrderMutation,
      })
      .expect(200);

    const orderId = createResponse.body.data.createOrder.id;

    const getOrderQuery = `
      query {
        getOrder(id: "${orderId}") {
          id
          customer
          currentState
          employee
          lineItems
          createdAt
          updatedAt
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: getOrderQuery,
      })
      .expect(200);

    const order = response.body.data.getOrder;
    expect(order).toHaveProperty('id');
    expect(order.customer).toBe('getOrderTest');
  });

  it('should create an order', async () => {
    const createOrderMutation = `
    mutation {
      createOrder(customer: "createOrderTest", lineItems: ["item1", "item2"]) {
        id
        customer
        currentState
        employee
        lineItems
        createdAt
        updatedAt
      }
    }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: createOrderMutation,
      })
      .expect(200);

    const order = response.body.data.createOrder;
    expect(order).toHaveProperty('id');
    expect(order.customer).toBe('createOrderTest');
    expect(order.lineItems).toEqual(['item1', 'item2']);
  });

  it('should update an order to IN_PROGRESS', async () => {
    const createOrderMutation = `
      mutation {
        createOrder(customer: "Jane Doe", lineItems: ["item3", "item4"]) {
          id
          customer
          currentState
          employee
          lineItems
          createdAt
          updatedAt
        }
      }
    `;

    const createResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: createOrderMutation })
      .expect(200);

    const orderId = createResponse.body.data.createOrder.id;

    const updateOrderMutation = `
      mutation {
        updateOrder(id: "${orderId}", currentState: IN_PROGRESS, employee: "Jane Smith") {
          id
          customer
          currentState
          employee
          lineItems
          createdAt
          updatedAt
        }
      }
    `;

    const updateResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: updateOrderMutation,
      })
      .expect(200);

    const updatedOrder = updateResponse.body.data.updateOrder;
    expect(updatedOrder.currentState).toBe('IN_PROGRESS');
    expect(updatedOrder.employee).toBe('Jane Smith');
  });

  it('should get all orders', async () => {
    const getOrdersQuery = `
      query {
        getOrders {
          id
          customer
          currentState
          employee
          lineItems
          createdAt
          updatedAt
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: getOrdersQuery,
      })
      .expect(200);

    const orders = response.body.data.getOrders;
    expect(orders).toBeInstanceOf(Array);
  });

  it('should fail to update an order with invalid id', async () => {
    const updateOrderMutation = `
      mutation {
        updateOrder(id: "invalid-id", currentState: IN_PROGRESS, employee: "updateOrderTestFailIfInvalidId") {
          id
          customer
          currentState
          employee
          lineItems
          createdAt
          updatedAt
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: updateOrderMutation,
      })
      .expect(200);

    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toContain('Invalid order id');
  });

  it('should fail to create an order without customer', async () => {
    const createOrderMutation = `
    mutation {
      createOrder(customer: "", lineItems: ["item1", "item2"]) {
        id
        customer
        currentState
        employee
        lineItems
        createdAt
        updatedAt
      }
    }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: createOrderMutation,
      })
      .expect(200);

    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toContain(
      'Customer field cannot be empty',
    );
  });

  it('should fail to update order to IN_PROGRESS without employee', async () => {
    const createOrderMutation = `
      mutation {
        createOrder(customer: "Jane Doe", lineItems: ["item3", "item4"]) {
          id
          customer
          currentState
          employee
          lineItems
          createdAt
          updatedAt
        }
      }
    `;

    const createResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: createOrderMutation })
      .expect(200);

    const orderId = createResponse.body.data.createOrder.id;

    const updateOrderMutation = `
      mutation {
        updateOrder(id: "${orderId}", currentState: IN_PROGRESS) {
          id
          customer
          currentState
          employee
          lineItems
          createdAt
          updatedAt
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: updateOrderMutation,
      })
      .expect(400);

    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toContain(
      'Employee must be provided when setting order to IN_PROGRESS',
    );
  });

  it('should fail to create an order without lineItems', async () => {
    const createOrderMutation = `
    mutation {
      createOrder(customer: "Test Customer", lineItems: []) {
        id
        customer
        currentState
        employee
        lineItems
        createdAt
        updatedAt
      }
    }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: createOrderMutation,
      })
      .expect(200);

    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toContain(
      'Item list cannot be empty',
    );
  });

  it('should fail to update order to COMPLETE from OPEN state', async () => {
    const createOrderMutation = `
      mutation {
        createOrder(customer: "Jane Doe", lineItems: ["item3", "item4"]) {
          id
          customer
          currentState
          employee
          lineItems
          createdAt
          updatedAt
        }
      }
    `;

    const createResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: createOrderMutation })
      .expect(200);

    const orderId = createResponse.body.data.createOrder.id;

    const updateOrderMutation = `
      mutation {
        updateOrder(id: "${orderId}", currentState: COMPLETE) {
          id
          customer
          currentState
          employee
          lineItems
          createdAt
          updatedAt
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: updateOrderMutation,
      })
      .expect(400);

    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toContain(
      'Invalid state transition from OPEN to COMPLETE',
    );
  });
});
