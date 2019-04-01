import { all, call, put, select } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import { loadProduct, loadProducts } from '../src/sagas/loadProductsSagas';
import * as actions from '../src/actions/index';
import * as requestHelpers from '../src/helpers/requestHelpers';

import windowSetup from './helpers/windowSetup';

beforeAll(() => {
  windowSetup();
});

describe('loadProduct saga', () => {
  const product = { handle: 'product_handle_1' };
  const gen = cloneableGenerator(loadProduct)(product);

  it('should send the loading product action', () => {
    expect(gen.next().value)
      .toEqual(put(actions.loadingProduct(product)));
  });

  it('should make a call to shopify for the product information', () => {
    expect(gen.next().value)
      .toEqual(call(requestHelpers.getRequest, `/products/${product.handle}.json`));
  });

  it('should send the loaded product action when product is successfully retrieved', () => {
    const productData = { product: { test: true } };
    const genClone = gen.clone();

    expect(genClone.next(productData).value)
      .toEqual(put(actions.loadedProduct(productData.product)));
    expect(genClone.next().done)
      .toEqual(true);
  });

  it('shouldn\'t send loaded action when product fails to load', () => {
    const genClone = gen.clone();

    genClone.next({ error: true });
    expect(genClone.next().done)
      .toEqual(true);
  });
});

describe('loadProducts saga', () => {
  const gen = loadProducts();

  it('should send loading products action', () => {
    expect(gen.next().value)
      .toEqual(put(actions.loadingProducts()));
  });

  it('should send load product actions for each product', () => {
    const state = {
      data: {
        products: [
          { product_id: 1, handle: 'product_handle_1' },
          { product_id: 2, handle: 'product_handle_2' },
        ],
      },
    };

    expect(gen.next().value)
      .toEqual(select());

    expect(gen.next(state).value)
      .toEqual(all(state.data.products.map(product => call(loadProduct, product))));
  });
});
