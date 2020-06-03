import { all, call, put, takeLatest } from 'redux-saga/effects';

import * as requestHelpers from '../helpers/requestHelpers';
import * as types from '../constants/actionTypes';
import * as actions from '../actions/index';

export function* orderAuthenticateCardInitialize(action) {
  try {
    const response = yield call(requestHelpers.apiGetRequest, `orders/${action.payload.orderId}/authenticate_card_initialize`);
    if (response.success) {
      yield put(
        actions.orderAuthenticateCardInitializeSuccess(
          action.payload.orderId,
          response.data,
        ),
      );
    } else {
      yield put(actions.orderAuthenticateCardInitializeFailed(
        action.payload.orderId,
        response.message,
      ));
    }
  } catch (e) {
    yield put(actions.orderAuthenticateCardInitializeFailed(
      action.payload.orderId,
      'Invalid response',
    ));
  }
}

export function* orderAuthenticateCardSave(action) {
  try {
    const response = yield call(requestHelpers.apiPostRequest, `orders/${action.payload.orderId}/authenticate_card_finish`, action.payload);
    if (response.success) {
      yield put(
        actions.orderAuthenticateCardSaveSuccess(
          action.payload.orderId,
          response.data.order,
        ),
      );
    } else {
      yield put(actions.orderAuthenticateCardSaveFailed(
        action.payload.orderId,
        response.errors.message,
      ));
    }
  } catch (e) {
    yield put(actions.orderAuthenticateCardSaveFailed(
      action.payload.orderId,
      'Invalid response',
    ));
  }
}

function* watchOrderAuthenticateInitializeCard() {
  yield takeLatest(types.ORDER_AUTHENTICATE_CARD_INITIALIZE, orderAuthenticateCardInitialize);
}
function* watchOrderAuthenticateSaveCard() {
  yield takeLatest(types.ORDER_AUTHENTICATE_CARD_SAVE, orderAuthenticateCardSave);
}

export default function* orderAuthenticateCardSagas() {
  yield all([
    watchOrderAuthenticateInitializeCard(),
    watchOrderAuthenticateSaveCard(),
  ]);
}
