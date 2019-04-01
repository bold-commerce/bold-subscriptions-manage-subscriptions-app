import { all, call, put, takeLatest } from 'redux-saga/effects';

import * as requestHelpers from '../helpers/requestHelpers';
import * as types from '../constants/actionTypes';
import * as actions from '../actions/index';

export function* orderUpdateCard(action) {
  yield put(actions.orderUpdatingCard());

  const response = yield call(requestHelpers.apiPutRequest, `orders/${action.payload.orderId}/card`, {
    token: action.payload.token,
    expiry_month: action.payload.expiryMonth,
    expiry_year: action.payload.expiryYear,
    last_four: action.payload.lastFour,
  });

  if (response.success) {
    yield put(actions.orderUpdatedCard(response.data));
  } else {
    yield put(actions.orderUpdateCardFailed(action.payload.orderId, response.errors.message));
  }
}

function* watchOrderUpdateCard() {
  yield takeLatest(types.ORDER_UPDATE_CARD, orderUpdateCard);
}

export default function* orderFrequencyIntervalSagas() {
  yield all([
    watchOrderUpdateCard(),
  ]);
}
