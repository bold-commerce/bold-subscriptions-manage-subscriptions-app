import { call, put } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';

import { orderProductUpdateQuantity } from '../src/sagas/orderProductEditingSagas';
import * as actions from '../src/actions/index';
import * as requestHelpers from '../src/helpers/requestHelpers';

import windowSetup from './helpers/windowSetup';

beforeAll(() => {
  windowSetup();
});

describe('orderProductEditing saga', () => {
  const orderId = 1;
  const orderProducts = {
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
  };
  const orderShippingRate = {
    name: 'Free', code: 'Free', source: 'shopify', price: '0.00', hash: 'abcd1234',
  };
  const action = actions.orderProductUpdateQuantity(orderId, orderProducts, orderShippingRate);
  const gen = cloneableGenerator(orderProductUpdateQuantity)(action);

  it('should send the order updating quantity action', () => {
    expect(gen.next().value)
      .toEqual(put(actions.orderProductUpdatingQuantity()));
  });

  it('should make an api call to update quantity on the order', () => {
    expect(gen.next().value)
      .toEqual(call(requestHelpers.apiPutRequest, `orders/${orderId}/quantity`, {
        order_products: orderProducts.order_products,
        order_shipping_rate: orderShippingRate,
      }));
  });

  it('should take the response from the server and send quantity updated action', () => {
    const response = {
      success: true,
    };
    const genClone = gen.clone();

    expect(genClone.next(response).value)
      .toEqual(put(actions.orderProductUpdatedQuantity()));
  });

  it('should take the response from the server and send error message action', () => {
    const response = {
      success: false,
      message: 'Failed to update quantity',
    };
    const genClone = gen.clone();

    expect(genClone.next(response).value)
      .toEqual(put(actions.orderProductUpdatedQuantityFailed(orderId, response.message)));
  });

  it('should take the response from the server and send conflict action', () => {
    const response = {
      status: 409,
      success: false,
      message: 'Shipping rate hash is not valid for the product quantities',
    };
    const genClone = gen.clone();

    expect(genClone.next(response).value)
      .toEqual(put(actions.orderProductUpdatedQuantityConflict(orderId)));
  });


});
