import { call, put } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';

import { orderApplyDiscountCode } from '../src/sagas/orderDiscountSagas';
import * as actions from '../src/actions/index';
import * as requestHelpers from '../src/helpers/requestHelpers';

import windowSetup from './helpers/windowSetup';

beforeAll(() => {
  windowSetup();
});

describe('orderDiscount saga', () => {
  const orderId = 1;
  const discountCode = 'code';
  const action = actions.orderApplyDiscountCode(orderId, discountCode);
  const gen = cloneableGenerator(orderApplyDiscountCode)(action);

  it('should send the order applying discount action', () => {
    expect(gen.next().value)
      .toEqual(put(actions.orderApplyingDiscountCode()));
  });

  it('should make an api call to apply the discount code', () => {
    expect(gen.next().value)
      .toEqual(call(requestHelpers.apiPostRequest, `orders/${orderId}/discount`, {
        discount_code: discountCode,
      }));
  });

  it('should take the response from the server and send discount applied action', () => {
    const response = {
      success: true,
    };
    const genClone = gen.clone();

    expect(genClone.next(response).value)
      .toEqual(put(actions.orderAppliedDiscountCode()));
  });

  it('should take the response from the server and send error message action', () => {
    const response = {
      success: false,
      errors: [{
        message: 'Failed to apply discount',
      }],

    };
    const genClone = gen.clone();

    expect(genClone.next(response).value)
      .toEqual(put(actions.orderApplyDiscountCodeFailed(orderId, response.message)));
  });
});
