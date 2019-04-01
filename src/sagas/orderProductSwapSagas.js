import { all, call, put, takeLatest } from 'redux-saga/effects';

import * as requestHelpers from '../helpers/requestHelpers';
import * as types from '../constants/actionTypes';
import * as actions from '../actions/index';

const CONFLICT_STATUS = 409;

export function* orderProductGetSwap(action) {
  yield put(actions.orderProductGettingSwap());
  const response = yield call(requestHelpers.apiGetRequest, `groups/${action.payload.groupId}/swap_information`, {
    order_id: action.payload.orderId,
    product_internal_id: action.payload.productId,
  });

  if (response.success) {
    yield put(actions.orderProductReceivedSwap(response.data));
    yield put(actions.loadProducts());
  } else {
    yield put(actions.orderProductGetSwapFailed(
      action.payload.orderId,
      action.payload.productId,
      response.errors.message,
    ));
  }
}

export function* orderProductSaveSwap(action) {
  yield put(actions.orderProductSavingSwap());

  const response = yield call(requestHelpers.apiPutRequest, `orders/${action.payload.orderId}/save_swap_product`, {
    order_id: action.payload.orderId,
    product_internal_id: action.payload.internalProductId,
    product_id: action.payload.productId,
    variant_id: action.payload.variantId,
    order_shipping_rate: action.payload.orderShippingRate,
  });

  if (response.success) {
    yield put(actions.orderProductSavedSwap(response.data));
  } else if (response.status === CONFLICT_STATUS) {
    yield put(actions.orderProductSaveSwapConflict(
      action.payload.orderId, action.payload.internalProductId,
    ));
  } else {
    yield put(actions.orderProductSaveSwapFailed(
      action.payload.orderId, action.payload.internalProductId, response.errors.message,
    ));
  }
}

function* watchOrderProductGetSwap() {
  yield takeLatest(types.ORDER_PRODUCT_GET_SWAP, orderProductGetSwap);
}

function* watchOrderProductSaveSwap() {
  yield takeLatest(types.ORDER_PRODUCT_SAVE_SWAP, orderProductSaveSwap);
}

export default function* orderProductSwapSagas() {
  yield all([
    watchOrderProductGetSwap(),
    watchOrderProductSaveSwap(),
  ]);
}
