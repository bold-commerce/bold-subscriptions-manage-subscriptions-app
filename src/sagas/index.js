import { all } from 'redux-saga/effects';

import appSagas from './appSagas';
import loadProductsSagas from './loadProductsSagas';
import orderApplyDiscountSagas from './orderDiscountSagas';
import orderShippingAddressSagas from './orderShippingAddressSagas';
import orderBillingAddressSagas from './orderBillingAddressSagas';
import orderShippingMethodSagas from './orderShippingMethodSagas';
import orderFrequencyIntervalSagas from './orderFrequencyIntervalSagas';
import orderSkipOrderSagas from './orderSkipOrderSagas';
import orderPauseSubscriptionSagas from './orderPauseSubscriptionSagas';
import orderProductEditingSagas from './orderProductEditingSagas';
import orderNextShipDateSagas from './orderNextShipDateSagas';
import orderProductRemovingSagas from './orderProductRemoveSagas';
import orderProductSwapSagas from './orderProductSwapSagas';
import orderCancelOrderSagas from './orderCancelOrderSagas';
import orderGetCardSagas from './orderGetCardSagas';
import orderUpdateCardSagas from './orderUpdateCardSagas';
import orderGetCashierCardDataSagas from './orderGetCashierCardDataSagas';
import orderProductEditUpcomingSagas from './orderProductEditUpcomingSagas';
import orderUpdatePrepaidSettingsSagas from './orderUpdatePrepaidSettingsSagas';
import orderCancelDiscountSagas from './orderCancelDiscountSagas';
import klaviyoCancelOrderSagas from './klaviyoCancelOrderSagas';
import orderAttemptedCancellationSagas from './orderAttemptedCancellationSagas';

export default function* rootSaga() {
  yield all([
    appSagas(),
    loadProductsSagas(),
    orderApplyDiscountSagas(),
    orderShippingAddressSagas(),
    orderBillingAddressSagas(),
    orderShippingMethodSagas(),
    orderFrequencyIntervalSagas(),
    orderSkipOrderSagas(),
    orderPauseSubscriptionSagas(),
    orderNextShipDateSagas(),
    orderProductEditingSagas(),
    orderProductRemovingSagas(),
    orderProductSwapSagas(),
    orderCancelOrderSagas(),
    orderGetCardSagas(),
    orderUpdateCardSagas(),
    orderGetCashierCardDataSagas(),
    orderProductEditUpcomingSagas(),
    orderUpdatePrepaidSettingsSagas(),
    orderCancelDiscountSagas(),
    klaviyoCancelOrderSagas(),
    orderAttemptedCancellationSagas(),
  ]);
}
