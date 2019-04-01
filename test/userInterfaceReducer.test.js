import userInterfaceReducer from '../src/reducers/userInterfaceReducer';
import * as actions from '../src/actions/index';

import windowSetup from './helpers/windowSetup';

beforeAll(() => {
  windowSetup();
});

describe('orders reducer', () => {
  it('should handle discount failed', () => {
    const testState = {
      applyingDiscount: true,
    };
    const orderId = 1;
    const message = 'Discount failed';
    const resultState = {
      discountMessages: {
        [orderId]: {
          message,
          type: 'error',
        },
      },
      applyingDiscount: false,
    };
    expect(userInterfaceReducer(testState, actions.orderApplyDiscountCodeFailed(orderId, message)))
      .toEqual(resultState);
  });

  it('should handle discount applied', () => {
    const orderId = 1;
    const testState = {
      applyingDiscount: true,
    };
    const resultState = {
      applyingDiscount: false,
      discountMessages: {
        [orderId]: {
          messageTextKey: 'discount_applied_message',
          type: 'success',
        },
      },
    };
    expect(userInterfaceReducer(testState, actions.orderAppliedDiscountCode({ id: orderId })))
      .toEqual(resultState);
  });

  it('should handle discount applying', () => {
    const testState = {
      applyingDiscount: false,
    };
    const resultState = {
      applyingDiscount: true,
    };
    expect(userInterfaceReducer(testState, actions.orderApplyingDiscountCode()))
      .toEqual(resultState);
  });
});
