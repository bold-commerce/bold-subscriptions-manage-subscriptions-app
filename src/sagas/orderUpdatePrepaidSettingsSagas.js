import { all, call, put, takeLatest } from 'redux-saga/effects';

import * as requestHelpers from '../helpers/requestHelpers';
import * as types from '../constants/actionTypes';
import * as actions from '../actions/index';

export function* orderUpdatePrepaidSettings(action) {
  yield put(actions.orderUpdatingPrepaidSettings());

  const response = yield call(requestHelpers.apiPutRequest, `orders/${action.payload.orderId}/prepaid_settings`, {
    prepaid_settings: {
      recurr_after_limit: action.payload.recurrAfterLimit,
    },
  });

  if (response.success) {
    yield put(actions.orderUpdatedPrepaidSettings(response.data));
  } else {
    yield put(actions.orderUpdatePrepaidSettingsFailed(
      action.payload.orderId, response.errors.message,
    ));
  }
}

function* watchOrderUpdatePrepaidSettings() {
  yield takeLatest(types.ORDER_UPDATE_PREPAID_SETTINGS, orderUpdatePrepaidSettings);
}

export default function* orderUpdatePrepaidSettingsSagas() {
  yield all([
    watchOrderUpdatePrepaidSettings(),
  ]);
}
