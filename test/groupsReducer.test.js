import groupsReducer from '../src/reducers/groupsReducer';
import * as actions from '../src/actions/index';

import windowSetup from './helpers/windowSetup';

beforeAll(() => {
  windowSetup();
});

describe('groups reducer', () => {
  it('should update the products with price difference on a group', () => {
    const testGetSwapProducts = {
      id: 8,
      products_with_price_difference: [{
        product_id: 123456789,
        variant_id: 234567890,
        variants: [{ id: 234567890, price: 500, price_difference: 250 }],
      }],
    };
    const testState = [{ id: 8 }];
    const resultState = [{
      id: 8,
      products_with_price_difference: testGetSwapProducts.products_with_price_difference,
    }];
    expect(groupsReducer(testState, actions.orderProductReceivedSwap(testGetSwapProducts)))
      .toEqual(resultState);
  });
});
