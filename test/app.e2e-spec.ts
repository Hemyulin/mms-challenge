import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('GraphQL API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create an order', async () => {
    const createOrderMutation = `
    mutation {
      createOrder(customer: "Jesus", lineItems: ["item1", "item2"]) {
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
    expect(order.customer).toBe('Jesus');
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

    try {
      const updateResponse = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: updateOrderMutation,
        })
        .expect(200);

      const updatedOrder = updateResponse.body.data.updateOrder;
      expect(updatedOrder.currentState).toBe('IN_PROGRESS');
      expect(updatedOrder.employee).toBe('Jane Smith');
    } catch (err) {
      if (err.response) {
        console.error(err.response.body);
      } else {
        console.error(err);
      }
      throw err;
    }
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

  it('should update an order', async () => {
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
      .send({
        query: createOrderMutation,
      })
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

    try {
      const updateResponse = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: updateOrderMutation,
        })
        .expect(200);

      const updatedOrder = updateResponse.body.data.updateOrder;
      expect(updatedOrder.currentState).toBe('IN_PROGRESS');
      expect(updatedOrder.employee).toBe('Jane Smith');
    } catch (err) {
      if (err.response) {
        console.error(err.response.body);
      } else {
        console.error(err);
      }
      throw err;
    }
  });
});
