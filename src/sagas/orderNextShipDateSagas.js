import { all, call, put, takeLatest } from 'redux-saga/effects';

import * as requestHelpers from '../helpers/requestHelpers';
import * as types from '../constants/actionTypes';
import * as actions from '../actions/index';

export function* orderUpdateNextShipDate(action) {
  yield put(actions.orderUpdatingNextShipDate());

  const response = yield call(requestHelpers.apiPutRequest, `orders/${action.payload.orderId}/next_ship_date`, {
    next_shipping_date: action.payload.nextShipDate,
  });

  if (response.success) {
    yield put(actions.orderUpdatedNextShipDate(response.data));
  } else {
    yield put(actions.orderUpdateNextShipDateFailed(
      action.payload.orderId, response.errors.message,
    ));
  }
}

function* watchOrderUpdateNextShipDate() {
  yield takeLatest(types.ORDER_UPDATE_NEXT_SHIP_DATE, orderUpdateNextShipDate);
}

export default function* orderNextShipDateSagas() {
  yield all([
    watchOrderUpdateNextShipDate(),
  ]);
}
