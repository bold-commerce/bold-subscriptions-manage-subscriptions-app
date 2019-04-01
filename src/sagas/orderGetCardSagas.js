import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import * as requestHelpers from '../helpers/requestHelpers';
import * as types from '../constants/actionTypes';
import * as actions from '../actions/index';

export function* orderGetCard(action) {
  yield put(actions.orderGettingCard());

  const response = yield call(requestHelpers.apiGetRequest, `orders/${action.payload.orderId}/card`);

  if (response.success) {
    yield put(actions.orderGotCard(response.data));
  } else {
    const errorResponse = response.errors.message;
    yield put(actions.orderGetCardFailed(action.payload.orderId, errorResponse));
  }
}

export function* orderLoadCards() {
  yield put(actions.orderLoadingCards());

  const state = yield select();

  yield all(state.data.orders.map(order => call(orderGetCard, { payload: { orderId: order.id } })));

  yield put(actions.orderLoadedCards());
}

function* watchorderGetCard() {
  yield takeLatest(types.ORDER_GET_CARD, orderGetCard);
}

function* watchorderLoadCards() {
  yield takeLatest(types.ORDER_LOAD_CARDS, orderLoadCards);
}

export default function* orderGetCardSagas() {
  yield all([
    watchorderGetCard(),
    watchorderLoadCards(),
  ]);
}
