import { all, call, put, takeLatest } from 'redux-saga/effects';

import * as requestHelpers from '../helpers/requestHelpers';
import * as types from '../constants/actionTypes';
import * as actions from '../actions/index';

export function* orderSkipOrder(action) {
  yield put(actions.orderSkippingOrder());

  const response = yield call(requestHelpers.apiPostRequest, `orders/${action.payload.orderId}/skip`, {
    order_date: action.payload.date,
  });

  if (response.success) {
    yield put(actions.orderSkippedOrder(response.data));
  } else {
    yield put(actions.orderSkipOrderFailed());
  }
}

export function* orderResumeOrder(action) {
  yield put(actions.orderResumingOrder());

  const response = yield call(requestHelpers.apiPostRequest, `orders/${action.payload.orderId}/recover`, {
    order_date: action.payload.date,
  });

  if (response.success) {
    yield put(actions.orderResumedOrder(response.data));
  } else {
    yield put(actions.orderResumeOrderFailed());
  }
}

function* watchOrderSkipOrder() {
  yield takeLatest(types.ORDER_SKIP_ORDER, orderSkipOrder);
}

function* watchOrderResumeOrder() {
  yield takeLatest(types.ORDER_RESUME_ORDER, orderResumeOrder);
}

export default function* orderSkipOrderSagas() {
  yield all([
    watchOrderSkipOrder(),
    watchOrderResumeOrder(),
  ]);
}
