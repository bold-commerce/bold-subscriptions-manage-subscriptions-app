import { all, call, put, takeLatest } from 'redux-saga/effects';

import * as requestHelpers from '../helpers/requestHelpers';
import * as types from '../constants/actionTypes';
import * as actions from '../actions/index';

export function* orderSaveNewCashierPaymentMethod(action) {
  yield put(actions.orderUpdatingCard(action.payload.orderId));
  const response = yield call(requestHelpers.apiGetRequest, `orders/${action.payload.orderId}/cashier_card_data`);

  if (response.success) {
    const newPaymentMethod = response.data.cashier_cards.slice().reverse().find(
      card => (
        card.last_four === action.payload.lastFour
        && card.expiration.date === action.payload.expiryDate
      ),
    );

    if (newPaymentMethod) {
      yield put(
        actions.orderSaveCashierPaymentMethod(
          action.payload.orderId,
          newPaymentMethod.public_id,
          response.data.cashier_cards,
        ),
      );
    } else {
      yield put(
        actions.orderGetCashierCardDataFailed(action.payload.orderId, response.errors.message),
      );
    }
  } else {
    yield put(
      actions.orderGetCashierCardDataFailed(action.payload.orderId, response.errors.message),
    );
  }
}

export function* orderSaveCashierPaymentMethod(action) {
  const saveCardResponse = yield call(requestHelpers.apiPutRequest, `orders/${action.payload.orderId}/card`, {
    token: action.payload.token,
  });


  // Fill cashier_cards with new list if it's set on payload
  if (action.payload.cashier_cards) {
    yield put(actions.orderGotCashierCardData({
      id: action.payload.orderId,
      cashier_cards: action.payload.cashier_cards,
    }));
  }

  if (saveCardResponse.success) {
    yield put(
      actions.orderUpdatedCard({
        ...saveCardResponse.data,
        cashier_selected_card_id: action.payload.token,
        id: action.payload.orderId,
      }),
    );
  } else {
    yield put(
      actions.orderUpdateCardFailed(action.payload.orderId, saveCardResponse.errors.message),
    );
  }
}

function* watchorderSaveNewCashierPaymentMethod() {
  yield takeLatest(types.ORDER_SAVE_NEW_CASHIER_PAYMENT_METHOD, orderSaveNewCashierPaymentMethod);
  yield takeLatest(types.ORDER_SAVE_CASHIER_PAYMENT_METHOD, orderSaveCashierPaymentMethod);
}


export default function* orderFrequencyIntervalSagas() {
  yield all([
    watchorderSaveNewCashierPaymentMethod(),
  ]);
}
