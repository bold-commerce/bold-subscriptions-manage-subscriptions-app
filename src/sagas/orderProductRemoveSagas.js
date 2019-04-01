import { all, call, put, takeLatest } from 'redux-saga/effects';

import * as requestHelpers from '../helpers/requestHelpers';
import * as types from '../constants/actionTypes';
import * as actions from '../actions/index';

const CONFLICT_STATUS = 409;

export function* orderProductRemove(action) {
  yield put(actions.orderProductRemoving());

  const response = yield call(requestHelpers.apiPutRequest, `orders/${action.payload.orderId}/remove_product`, {
    order_products: action.payload.orderProducts.order_products,
    order_shipping_rate: action.payload.orderShippingRate,
  });

  if (response.success) {
    yield put(actions.orderProductRemoved(response.data));
  } else if (response.status === CONFLICT_STATUS) {
    yield put(actions.orderProductRemoveConflict(
      action.payload.orderId,
      action.payload.orderProducts.order_products[0].product_internal_id,
    ));
  } else {
    yield put(actions.orderProductRemoveFailed(
      action.payload.orderProducts.order_products[0].product_internal_id,
      response.errors.message,
    ));
  }
}

function* watchOrderProductRemove() {
  yield takeLatest(types.ORDER_PRODUCT_REMOVE, orderProductRemove);
}

export default function* orderProductRemovingSagas() {
  yield all([
    watchOrderProductRemove(),
  ]);
}
