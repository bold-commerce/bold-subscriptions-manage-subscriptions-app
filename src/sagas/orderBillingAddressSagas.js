import { all, call, put, takeLatest } from 'redux-saga/effects';

import * as requestHelpers from '../helpers/requestHelpers';
import * as types from '../constants/actionTypes';
import * as actions from '../actions/index';

export function* orderUpdateBillingAddress(action) {
  yield put(actions.orderUpdatingBillingAddress());

  const response = yield call(requestHelpers.apiPutRequest, `orders/${action.payload.orderId}/billing_address`, {
    billing_address: action.payload.billingAddress,
  });
  if (response.success) {
    yield put(actions.orderUpdatedBillingAddress(response.data));
  } else {
    const errorResponse = response.errors.message;
    yield put(actions.orderUpdateBillingAddressFailed(action.payload.orderId, errorResponse));
  }
}

function* watchOrderUpdateBillingAddress() {
  yield takeLatest(types.ORDER_UPDATE_BILLING_ADDRESS, orderUpdateBillingAddress);
}

export default function* orderBillingAddressSagas() {
  yield all([
    watchOrderUpdateBillingAddress(),
  ]);
}

