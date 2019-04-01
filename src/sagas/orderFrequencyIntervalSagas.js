import { all, call, put, takeLatest } from 'redux-saga/effects';

import * as requestHelpers from '../helpers/requestHelpers';
import * as types from '../constants/actionTypes';
import * as actions from '../actions/index';

export function* orderUpdateFrequencyInterval(action) {
  yield put(actions.orderUpdatingFrequencyInterval());

  const response = yield call(requestHelpers.apiPutRequest, `orders/${action.payload.orderId}/interval`, {
    frequency_type: action.payload.formInformation.interval,
    frequency_num: action.payload.formInformation.frequency,
  });

  if (response.success) {
    yield put(actions.orderUpdatedFrequencyInterval(response.data));
  } else {
    const errorResponse = response.errors.message;
    yield put(actions.orderUpdateFrequencyIntervalFailed(action.payload.orderId, errorResponse));
  }
}

function* watchOrderUpdateFrequencyInterval() {
  yield takeLatest(types.ORDER_UPDATE_FREQUENCY_INTERVAL, orderUpdateFrequencyInterval);
}

export default function* orderFrequencyIntervalSagas() {
  yield all([
    watchOrderUpdateFrequencyInterval(),
  ]);
}
