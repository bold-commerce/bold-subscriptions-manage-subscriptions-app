import { all, call, put, takeLatest } from 'redux-saga/effects';

import * as requestHelpers from '../helpers/requestHelpers';
import * as types from '../constants/actionTypes';
import * as actions from '../actions/index';

export function* orderApplyDiscountCode(action) {
  yield put(actions.orderApplyingDiscountCode());

  const response = yield call(requestHelpers.apiPostRequest, `orders/${action.payload.orderId}/discount`, {
    discount_code: action.payload.discountCode,
  });

  if (response.success) {
    yield put(actions.orderAppliedDiscountCode(response.data));
  } else {
    const errorResponse = response.errors.message;
    yield put(actions.orderApplyDiscountCodeFailed(action.payload.orderId, errorResponse));
  }
}

function* watchOrderApplyDiscountCode() {
  yield takeLatest(types.ORDER_APPLY_DISCOUNT_CODE, orderApplyDiscountCode);
}

export default function* orderDiscountSagas() {
  yield all([
    watchOrderApplyDiscountCode(),
  ]);
}
