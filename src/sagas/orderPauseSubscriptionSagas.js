import { all, call, put, takeLatest } from 'redux-saga/effects';

import * as requestHelpers from '../helpers/requestHelpers';
import * as types from '../constants/actionTypes';
import * as actions from '../actions/index';

export function* orderPauseSubscription(action) {
  yield put(actions.orderPausingSubscription());

  const response = yield call(requestHelpers.apiPostRequest, `orders/${action.payload.orderId}/pause`);

  if (response.success) {
    yield put(actions.orderPausedSubscription(response.data));
  } else {
    yield put(actions.orderPauseSubscriptionFailed());
  }
}

export function* orderResumeSubscription(action) {
  yield put(actions.orderResumingSubscription());

  const response = yield call(requestHelpers.apiPostRequest, `orders/${action.payload.orderId}/resume`);

  if (response.success) {
    yield put(actions.orderResumedSubscription(response.data));
  } else {
    yield put(actions.orderResumeSubscriptionFailed());
  }
}

function* watchOrderPauseSubscription() {
  yield takeLatest(types.ORDER_PAUSE_SUBSCRIPTION, orderPauseSubscription);
}

function* watchOrderResumeSubscription() {
  yield takeLatest(types.ORDER_RESUME_SUBSCRIPTION, orderResumeSubscription);
}

export default function* orderPauseSubscriptionSagas() {
  yield all([
    watchOrderPauseSubscription(),
    watchOrderResumeSubscription(),
  ]);
}
