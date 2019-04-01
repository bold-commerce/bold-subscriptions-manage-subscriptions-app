import productsReducer from '../src/reducers/productsReducer';
import * as actions from '../src/actions/index';

import windowSetup from './helpers/windowSetup';

beforeAll(() => {
  windowSetup();
});

describe('products reducer', () => {
  it('should update product on product loaded', () => {
    const testProduct = { id: 1, things: 'stuff' };
    const testState = [{ product_id: 1 }];
    const resultState = [{ product_id: 1, shopify_data: testProduct }];
    expect(productsReducer(testState, actions.loadedProduct(testProduct)))
      .toEqual(resultState);
  });
});
