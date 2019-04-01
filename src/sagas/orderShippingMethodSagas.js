import { all, call, put, takeLatest, takeEvery } from 'redux-saga/effects';

import * as requestHelpers from '../helpers/requestHelpers';
import * as types from '../constants/actionTypes';
import * as actions from '../actions/index';

export function* orderUpdateOrderShippingRate(action) {
  yield put(actions.orderUpdatingOrderShippingRate());

  const response = yield call(requestHelpers.apiPutRequest, `orders/${action.payload.orderId}/shipping_method`, {
    order_shipping_rate: action.payload.orderShippingRate,
  });
  if (response.success) {
    yield put(actions.orderUpdatedOrderShippingRate(response.data));
  } else {
    const errorResponse = response.errors.message;
    yield put(actions.orderUpdateShippingMethodFailed(action.payload.orderId, errorResponse));
  }
}

export function* orderGetShippingRates(action) {
  const response = yield call(requestHelpers.apiGetRequest, `orders/${action.payload.orderId}/shipping_rates`, {
    ...action.payload.shippingAddress,
    ...action.payload.formInformation,
  });
  if (response.success) {
    yield put(actions.orderGotShippingRates(response.data));
  } else {
    const errorResponse = response.errors.message;
    yield put(actions.orderGetShippingRatesFailed(action.payload.orderId, errorResponse));
  }
}

function* watchOrderUpdateOrderShippingRate() {
  yield takeLatest(types.ORDER_UPDATE_ORDER_SHIPPING_RATE, orderUpdateOrderShippingRate);
  yield takeEvery(types.ORDER_GET_SHIPPING_RATES, orderGetShippingRates);
}

export default function* orderShippingMethodSagas() {
  yield all([
    watchOrderUpdateOrderShippingRate(),
  ]);
}

