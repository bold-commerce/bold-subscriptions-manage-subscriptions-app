import { all, call, put, takeLatest } from 'redux-saga/effects';

import * as requestHelpers from '../helpers/requestHelpers';
import * as types from '../constants/actionTypes';
import * as actions from '../actions/index';

export function* orderCancelOrder(action) {
  yield put(actions.orderCancellingOrder());

  const response = yield call(requestHelpers.apiDeleteRequest, `orders/${action.payload.orderId}`, {
    cancel_reason: action.payload.cancelReason,
  });

  if (response.success) {
    const klaviyoApiKey = window.manageSubscription.integrationSettings.klaviyo_api_key;
    if (klaviyoApiKey && klaviyoApiKey.length > 0) {
      yield put(actions.klaviyoCancelOrder(response.data, action.payload.cancelReason));
    }
    yield put(actions.orderCancelledOrder(response.data));
  } else {
    yield put(actions.orderCancelOrderFailed(action.payload.orderId, response.errors.message));
  }
}

function* watchOrderCancelOrder() {
  yield takeLatest(types.ORDER_CANCEL_ORDER, orderCancelOrder);
}

export default function* orderCancelOrderSagas() {
  yield all([
    watchOrderCancelOrder(),
  ]);
}
