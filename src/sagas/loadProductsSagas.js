import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import * as requestHelpers from '../helpers/requestHelpers';
import * as types from '../constants/actionTypes';
import * as actions from '../actions/index';

export function* loadProduct(product) {
  yield put(actions.loadingProduct(product));

  const productData = yield call(requestHelpers.getRequest, `/products/${product.handle}.json`);

  if (productData.product) {
    yield put(actions.loadedProduct(productData.product));
  } else {
    const hiddenProductData = yield call(
        requestHelpers.apiGetRequest,
        `product/${product.product_id}/hidden_product`
    );
    yield put(actions.loadedProduct(hiddenProductData.data));
  }
}

export function* loadProducts() {
  yield put(actions.loadingProducts());

  const state = yield select();

  yield all(state.data.products.map(product => call(loadProduct, product)));

  yield put(actions.loadedProducts());
}

function* watchLoadProducts() {
  yield takeLatest(types.LOAD_PRODUCTS, loadProducts);
}

export default function* loadProductsSagas() {
  yield all([
    watchLoadProducts(),
  ]);
}
