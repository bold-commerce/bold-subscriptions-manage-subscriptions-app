import { all, call, takeLatest } from 'redux-saga/effects';

import * as requestHelpers from '../helpers/requestHelpers';
import * as types from '../constants/actionTypes';

export function* orderAttemptedCancellation(action) {
  yield call(requestHelpers.apiPostRequest, `orders/${action.payload.orderId}/cancellation_log`, {
    cancel_reason: action.payload.cancelReason,
  });
}

function* watchOrderAttemptedCancellation() {
  yield takeLatest(types.ORDER_ATTEMPTED_CANCEL_LOG, orderAttemptedCancellation);
}

export default function* orderAttemptedCancellationSagas() {
  yield all([
    watchOrderAttemptedCancellation(),
  ]);
}
