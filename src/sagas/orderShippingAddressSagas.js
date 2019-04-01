import { all, call, put, takeLatest } from 'redux-saga/effects';

import * as requestHelpers from '../helpers/requestHelpers';
import * as types from '../constants/actionTypes';
import * as actions from '../actions/index';

const CONFLICT_STATUS = 409;

export function* orderUpdateShippingAddress(action) {
  yield put(actions.orderUpdatingShippingAddress());

  const response = yield call(requestHelpers.apiPutRequest, `orders/${action.payload.orderId}/shipping_address`, {
    shipping_address: action.payload.shippingAddress,
    order_shipping_rate: action.payload.orderShippingRate,
  });
  if (response.success) {
    yield put(actions.orderUpdatedShippingAddress(response.data));
  } else if (response.status === CONFLICT_STATUS) {
    yield put(actions.orderUpdateShippingAddressConflict(action.payload.orderId));
  } else {
    const errorResponse = response.errors.message;
    yield put(actions.orderUpdateShippingAddressFailed(action.payload.orderId, errorResponse));
  }
}

function* watchOrderUpdateShippingAddress() {
  yield takeLatest(types.ORDER_UPDATE_SHIPPING_ADDRESS, orderUpdateShippingAddress);
}

export default function* orderShippingAddressSagas() {
  yield all([
    watchOrderUpdateShippingAddress(),
  ]);
}
