import { all, call, put, takeLatest } from 'redux-saga/effects';

import * as requestHelpers from '../helpers/requestHelpers';
import * as types from '../constants/actionTypes';
import * as actions from '../actions/index';

export function* orderApplyDiscountCode(action) {
  yield put(actions.applyingCancelDiscount());

  const response = yield call(requestHelpers.apiPostRequest, `orders/${action.payload.orderId}/cancellation_offer_code`, {
    discount_code: action.payload.discountCode,
    reason_id: action.payload.reasonId,
  });

  if (response.success) {
    yield put(actions.appliedCancelDiscount(response.data));
  } else {
    const errorResponse = response.errors.message;
    yield put(actions.applyCancelDiscountFailed(action.payload.orderId, errorResponse));
  }
}

function* watchOrderApplyCancelDiscount() {
  yield takeLatest(types.ORDER_APPLY_CANCEL_DISCOUNT, orderApplyDiscountCode);
}

export default function* orderCancelDiscountSagas() {
  yield all([
    watchOrderApplyCancelDiscount(),
  ]);
}
