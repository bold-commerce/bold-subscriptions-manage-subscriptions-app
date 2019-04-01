import { all, call, put, takeLatest } from 'redux-saga/effects';

import * as requestHelpers from '../helpers/requestHelpers';
import * as types from '../constants/actionTypes';
import * as actions from '../actions/index';

export function* orderGetCashierCardData(action) {
  yield put(actions.orderGettingCashierCardData());

  const response = yield call(requestHelpers.apiGetRequest, `orders/${action.payload.orderId}/cashier_card_data`);

  if (response.success) {
    yield put(actions.orderGotCashierCardData(response.data));
  } else {
    yield put(actions.orderGetCashierCardDataFailed(action.payload.orderId, response.errors.message));
  }
}

function* watchOrderGetCasorderGetCashierCardData() {
  yield takeLatest(types.ORDER_GET_CASHIER_CARD_DATA, orderGetCashierCardData);
}

export default function* orderFrequencyIntervalSagas() {
  yield all([
    watchOrderGetCasorderGetCashierCardData(),
  ]);
}
