import { all, call, put, takeLatest } from 'redux-saga/effects';

import * as requestHelpers from '../helpers/requestHelpers';
import * as types from '../constants/actionTypes';
import * as actions from '../actions/index';

const CONFLICT_STATUS = 409;

export function* orderProductUpdateUpcomingQuantity(action) {
  yield put(actions.orderProductUpdatingUpcomingQuantity());

  const response = yield call(requestHelpers.apiPutRequest, `orders/${action.payload.orderId}/upcoming_products`, {
    order_products: action.payload.orderProducts.order_products,
    order_date: action.payload.orderDate,
    order_shipping_rate: action.payload.orderShippingRate,
  });

  if (response.success) {
    yield put(actions.orderProductUpdatedUpcomingQuantity(response.data));
  } else if (response.status === CONFLICT_STATUS) {
    yield put(actions.orderProductUpdateUpcomingQuantityConflict(action.payload.orderId));
  } else {
    yield put(actions.orderProductUpdateUpcomingQuantityFailed(
      action.payload.orderId, response.errors.message,
    ));
  }
}

function* watchOrderProductUpdateUpcomingQuantity() {
  yield takeLatest(
    types.ORDER_PRODUCT_UPDATE_UPCOMING_QUANTITY, orderProductUpdateUpcomingQuantity,
  );
}

export default function* orderProductEditUpcomingSagas() {
  yield all([
    watchOrderProductUpdateUpcomingQuantity(),
  ]);
}
