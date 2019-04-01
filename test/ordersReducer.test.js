import ordersReducer from '../src/reducers/ordersReducer';
import * as actions from '../src/actions/index';

import windowSetup from './helpers/windowSetup';

beforeAll(() => {
  windowSetup();
});

describe('orders reducer', () => {
  it('should update the discount on an order', () => {
    const testDiscountAction = { id: 1, discount: 'abc123' };
    const testState = [{ id: 1 }];
    const resultState = [{ id: 1, discount: testDiscountAction.discount }];
    expect(ordersReducer(testState, actions.orderAppliedDiscountCode(testDiscountAction)))
      .toEqual(resultState);
  });

  it('should update the product quantities and shipping rate on the order', () => {
    const testUpdateQuantityAction = {
      id: 1,
      order_products: [
        {
          product_internal_id: 1,
          quantity: 1,
          is_deleted: false,
        },
        {
          product_internal_id: 2,
          quantity: 2,
          is_deleted: false,
        },
      ],
      order_shipping_rate: {
        name: 'Free', code: 'Free', source: 'shopify', price: '0.00', hash: 'abcd1234',
      },
    };
    const testState = [{ id: 1 }];
    const resultState = [{
      id: 1,
      order_products: testUpdateQuantityAction.order_products,
      order_shipping_rate: testUpdateQuantityAction.order_shipping_rate,
    }];
    expect(ordersReducer(testState, actions.orderProductUpdatedQuantity(testUpdateQuantityAction)))
  });

  it('should update remove the order', () => {
    const testCancelOrderAction = { id: 1 };
    const testState = [{ id: 1 }, { id: 2 }];
    const resultState = [{ id: 2 }];
    expect(ordersReducer(testState, actions.orderCancelledOrder(testCancelOrderAction)))
      .toEqual(resultState);
  });

});
