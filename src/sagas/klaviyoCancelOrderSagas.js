/* global _learnq:readonly */

import { all, put, select, takeLatest } from 'redux-saga/effects';

import * as types from '../constants/actionTypes';
import * as actions from '../actions/index';

const PRODUCT_IDS_KEY = 'Product IDs';
const PRODUCT_TITLES_KEY = 'Product Titles';
const VARIANT_IDS_KEY = 'Variant IDs';
const VARIANT_TITLES_KEY = 'Variant Titles';

export function* klaviyoCancelOrder(action) {
  yield put(actions.klaviyoCancellingOrder());

  const orderId = action.payload.id;
  const getOrder = (state) => {
    const indexOfOrderToDelete = state.data.orders.findIndex(order => order.id === orderId);
    return state.data.orders[indexOfOrderToDelete];
  };

  const order = yield select(getOrder);
  const { cancelReason } = action.payload;

  const variantData = order.order_products.reduce((p, c) => ({
    [PRODUCT_IDS_KEY]: [
      ...p[PRODUCT_IDS_KEY],
      c.product_id.toString(),
    ],
    [PRODUCT_TITLES_KEY]: [
      ...p[PRODUCT_TITLES_KEY],
      c.product_title,
    ],
    [VARIANT_IDS_KEY]: [
      ...p[VARIANT_IDS_KEY],
      c.variant_id.toString(),
    ],
    [VARIANT_TITLES_KEY]: [
      ...p[VARIANT_TITLES_KEY],
      c.variant_title,
    ],
  }), {
    [PRODUCT_IDS_KEY]: [],
    [PRODUCT_TITLES_KEY]: [],
    [VARIANT_IDS_KEY]: [],
    [VARIANT_TITLES_KEY]: [],
  });

  _learnq.push(['identify', { $email: order.customer_email }]);
  _learnq.push([
    'track',
    'Canceled Subscription',
    {
      $email: order.customer_email,
      'Cancel Reason': cancelReason,
      ...variantData,
    },
  ]);

  yield put(actions.klaviyoCancelledOrder());
}

function* watchKlaviyoCancelOrder() {
  yield takeLatest(types.KLAVIYO_CANCEL_ORDER, klaviyoCancelOrder);
}

export default function* klaviyoCancelOrderSagas() {
  yield all([
    watchKlaviyoCancelOrder(),
  ]);
}
