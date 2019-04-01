import { all, call, put, takeLatest } from 'redux-saga/effects';

import * as requestHelpers from '../helpers/requestHelpers';
import * as types from '../constants/actionTypes';
import * as actions from '../actions/index';

const CONFLICT_STATUS = 409;

export function* orderProductUpdateQuantity(action) {
  yield put(actions.orderProductUpdatingQuantity());

  const response = yield call(requestHelpers.apiPutRequest, `orders/${action.payload.orderId}/quantity`, {
    order_products: action.payload.orderProducts.order_products,
    order_shipping_rate: action.payload.orderShippingRate,
  });

  if (response.success) {
    yield put(actions.orderProductUpdatedQuantity(response.data));
  } else if (response.status === CONFLICT_STATUS) {
    yield put(actions.orderProductUpdatedQuantityConflict(action.payload.orderId));
  } else {
    yield put(actions.orderProductUpdatedQuantityFailed(
      action.payload.orderId, response.errors.message,
    ));
  }
}

function* watchOrderProductUpdateQuantity() {
  yield takeLatest(types.ORDER_PRODUCT_UPDATE_QUANTITY, orderProductUpdateQuantity);
}

export default function* orderProductEditingSagas() {
  yield all([
    watchOrderProductUpdateQuantity(),
  ]);
}
