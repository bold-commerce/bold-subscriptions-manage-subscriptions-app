import * as types from '../constants/actionTypes';

export const orderApplyDiscountCode = (orderId, discountCode) => ({
  type: types.ORDER_APPLY_DISCOUNT_CODE,
  payload: { orderId, discountCode },
});

export const orderApplyingDiscountCode = () => ({ type: types.ORDER_APPLYING_DISCOUNT_CODE });

export const orderAppliedDiscountCode = data => ({
  type: types.ORDER_APPLIED_DISCOUNT_CODE,
  payload: data,
});

export const orderApplyDiscountCodeFailed = (orderId, message) => ({
  type: types.ORDER_APPLY_DISCOUNT_CODE_FAILED,
  payload: { orderId, message },
});

export const orderUpdateShippingAddress = (orderId, shippingAddress, orderShippingRate) => ({
  type: types.ORDER_UPDATE_SHIPPING_ADDRESS,
  payload: { orderId, shippingAddress, orderShippingRate },
});

export const orderUpdatingShippingAddress = () => ({
  type: types.ORDER_UPDATING_SHIPPING_ADDRESSS,
});

export const orderUpdatedShippingAddress = data => ({
  type: types.ORDER_UPDATED_SHIPPING_ADDRESS,
  payload: data,
});

export const orderUpdateShippingAddressFailed = (orderId, message) => ({
  type: types.ORDER_UPDATE_SHIPPING_ADDRESS_FAILED,
  payload: { orderId, message },
});

export const orderUpdateBillingAddress = (orderId, billingAddress) => ({
  type: types.ORDER_UPDATE_BILLING_ADDRESS,
  payload: { orderId, billingAddress },
});

export const orderUpdatingBillingAddress = () => ({
  type: types.ORDER_UPDATING_BILLING_ADDRESS,
});

export const orderUpdatedBillingAddress = data => ({
  type: types.ORDER_UPDATED_BILLING_ADDRESS,
  payload: data,
});

export const orderUpdateBillingAddressFailed = (orderId, message) => ({
  type: types.ORDER_UPDATE_BILLING_ADDRESS_FAILED,
  payload: { orderId, message },
});

export const orderUpdateOrderShippingRate = (orderId, orderShippingRate) => ({
  type: types.ORDER_UPDATE_ORDER_SHIPPING_RATE,
  payload: { orderId, orderShippingRate },
});

export const orderUpdatingOrderShippingRate = () => ({
  type: types.ORDER_UPDATING_ORDER_SHIPPING_RATE,
});

export const orderUpdatedOrderShippingRate = data => ({
  type: types.ORDER_UPDATED_ORDER_SHIPPING_RATE,
  payload: data,
});

export const orderUpdateShippingAddressConflict = orderId => ({
  type: types.ORDER_UPDATE_SHIPPING_ADDRESS_CONFLICT,
  payload: { orderId },
});

export const orderUpdateShippingMethodFailed = (orderId, message) => ({
  type: types.ORDER_UPDATE_SHIPPING_METHOD_FAILED,
  payload: { orderId, message },
});

export const orderGetShippingRates = (orderId, formInformation) => ({
  type: types.ORDER_GET_SHIPPING_RATES,
  payload: { orderId, formInformation },
});

export const orderGotShippingRates = data => ({
  type: types.ORDER_GOT_SHIPPING_RATES,
  payload: data,
});

export const orderGetShippingRatesFailed = (orderId, message) => ({
  type: types.ORDER_GET_SHIPPING_RATES_FAILED,
  payload: { orderId, message },
});

export const orderUpdateFrequencyInterval = (orderId, formInformation) => ({
  type: types.ORDER_UPDATE_FREQUENCY_INTERVAL,
  payload: { orderId, formInformation },
});

export const orderUpdatingFrequencyInterval = () => ({
  type: types.ORDER_UPDATING_FREQUENCY_INTERVAL,
});

export const orderUpdatedFrequencyInterval = data => ({
  type: types.ORDER_UPDATED_FREQUENCY_INTERVAL,
  payload: data,
});

export const orderUpdateFrequencyIntervalFailed = (orderId, message) => ({
  type: types.ORDER_UPDATE_FREQUENCY_INTERVAL_FAILED,
  payload: { orderId, message },
});
export const orderUpdateNextShipDate = (orderId, nextShipDate) => ({
  type: types.ORDER_UPDATE_NEXT_SHIP_DATE,
  payload: { orderId, nextShipDate },
});
export const orderUpdatingNextShipDate = () => ({
  type: types.ORDER_UPDATING_NEXT_SHIP_DATE,
});
export const orderUpdateNextShipDateFailed = (orderId, message) => ({
  type: types.ORDER_UPDATE_NEXT_SHIP_DATE_FAILED,
  payload: { orderId, message },
});
export const orderUpdatedNextShipDate = data => ({
  type: types.ORDER_UPDATED_NEXT_SHIP_DATE,
  payload: data,
});

export const orderProductGetSwap = (orderId, productId, groupId) => ({
  type: types.ORDER_PRODUCT_GET_SWAP,
  payload: { orderId, productId, groupId },
});

export const orderProductGettingSwap = () => ({
  type: types.ORDER_PRODUCT_GETTING_SWAP,
});

export const orderProductReceivedSwap = data => ({
  type: types.ORDER_PRODUCT_RECEIVED_SWAP,
  payload: data,
});

export const orderProductGetSwapFailed = (orderId, productId, message) => ({
  type: types.ORDER_PRODUCT_GET_SWAP_FAILED,
  payload: { orderId, productId, message },
});

export const orderProductSaveSwap =
  (orderId, groupId, internalProductId, productId, variantId, orderShippingRate) => ({
    type: types.ORDER_PRODUCT_SAVE_SWAP,
    payload: {
      orderId, groupId, internalProductId, productId, variantId, orderShippingRate,
    },
  });

export const orderProductSavingSwap = () => ({
  type: types.ORDER_PRODUCT_SAVING_SWAP,
});

export const orderProductSavedSwap = data => ({
  type: types.ORDER_PRODUCT_SAVED_SWAP,
  payload: data,
});

export const orderProductSaveSwapFailed = (orderId, productId, message) => ({
  type: types.ORDER_PRODUCT_SAVE_SWAP_FAILED,
  payload: { orderId, productId, message },
});

export const orderProductSaveSwapConflict = orderId => ({
  type: types.ORDER_PRODUCT_SAVE_SWAP_CONFLICT,
  payload: { orderId },
});


export const orderPauseSubscription = orderId => ({
  type: types.ORDER_PAUSE_SUBSCRIPTION,
  payload: { orderId },
});

export const orderPausedSubscription = data => ({
  type: types.ORDER_PAUSED_SUBSCRIPTION,
  payload: data,
});

export const orderPausingSubscription = () => ({
  type: types.ORDER_PAUSING_SUBSCRIPTION,
});

export const orderPauseSubscriptionFailed = () => ({
  type: types.ORDER_PAUSE_SUBSCRIPTION_FAILED,
});


export const orderResumeSubscription = orderId => ({
  type: types.ORDER_RESUME_SUBSCRIPTION,
  payload: { orderId },
});

export const orderResumedSubscription = data => ({
  type: types.ORDER_RESUMED_SUBSCRIPTION,
  payload: data,
});

export const orderResumingSubscription = () => ({
  type: types.ORDER_RESUMING_SUBSCRIPTION,
});

export const orderResumeSubscriptionFailed = () => ({
  type: types.ORDER_RESUME_SUBSCRIPTION_FAILED,
});

export const orderSkipOrder = (orderId, date) => ({
  type: types.ORDER_SKIP_ORDER,
  payload: { orderId, date },
});

export const orderSkippedOrder = data => ({
  type: types.ORDER_SKIPPED_ORDER,
  payload: data,
});

export const orderSkippingOrder = () => ({
  type: types.ORDER_SKIPPING_ORDER,
});

export const orderSkipOrderFailed = () => ({
  type: types.ORDER_SKIP_ORDER_FAILED,
});

export const orderResumeOrder = (orderId, date) => ({
  type: types.ORDER_RESUME_ORDER,
  payload: { orderId, date },
});

export const orderResumedOrder = data => ({
  type: types.ORDER_RESUMED_ORDER,
  payload: data,
});

export const orderResumingOrder = () => ({
  type: types.ORDER_RESUMING_ORDER,
});

export const orderResumeOrderFailed = () => ({
  type: types.ORDER_RESUME_ORDER_FAILED,
});

export const orderProductUpdateUpcomingQuantity =
  (orderId, orderProducts, orderDate, orderShippingRate) => ({
    type: types.ORDER_PRODUCT_UPDATE_UPCOMING_QUANTITY,
    payload: {
      orderId, orderProducts, orderDate, orderShippingRate,
    },
  });

export const orderProductUpdatingUpcomingQuantity = () => ({
  type: types.ORDER_PRODUCT_UPDATING_UPCOMING_QUANTITY,
});

export const orderProductUpdatedUpcomingQuantity = data => ({
  type: types.ORDER_PRODUCT_UPDATED_UPCOMING_QUANTITY,
  payload: data,
});

export const orderProductUpdateUpcomingQuantityFailed = (orderId, message) => ({
  type: types.ORDER_PRODUCT_UPDATE_UPCOMING_QUANTITY_FAILED,
  payload: { orderId, message },
});

export const orderProductUpdateUpcomingQuantityConflict = orderId => ({
  type: types.ORDER_PRODUCT_UPDATE_UPCOMING_QUANTITY_CONFLICT,
  payload: { orderId },
});

export const orderProductUpdateQuantity = (orderId, orderProducts, orderShippingRate) => ({
  type: types.ORDER_PRODUCT_UPDATE_QUANTITY,
  payload: { orderId, orderProducts, orderShippingRate },
});

export const orderProductUpdatingQuantity = () => ({
  type: types.ORDER_PRODUCT_UPDATING_QUANTITY,
});

export const orderProductUpdatedQuantity = data => ({
  type: types.ORDER_PRODUCT_UPDATED_QUANTITY,
  payload: data,
});

export const orderProductUpdatedQuantityFailed = (orderId, message) => ({
  type: types.ORDER_PRODUCT_UPDATED_QUANTITY_FAILED,
  payload: { orderId, message },
});

export const orderProductUpdatedQuantityConflict = orderId => ({
  type: types.ORDER_PRODUCT_UPDATE_QUANTITY_CONFLICT,
  payload: { orderId },
});

export const orderProductRemove = (orderId, orderProducts, orderShippingRate) => ({
  type: types.ORDER_PRODUCT_REMOVE,
  payload: { orderId, orderProducts, orderShippingRate },
});

export const orderProductRemoving = () => ({
  type: types.ORDER_PRODUCT_REMOVING,
});

export const orderProductRemoved = data => ({
  type: types.ORDER_PRODUCT_REMOVED,
  payload: data,
});

export const orderProductRemoveFailed = (productId, message) => ({
  type: types.ORDER_PRODUCT_REMOVE_FAILED,
  payload: { productId, message },
});

export const orderProductRemoveConflict = (orderId, productId) => ({
  type: types.ORDER_PRODUCT_REMOVE_CONFLICT,
  payload: { orderId, productId },
});

export const orderCancelOrder = (orderId, cancelReason) => ({
  type: types.ORDER_CANCEL_ORDER,
  payload: { orderId, cancelReason },
});

export const orderCancellingOrder = () => ({
  type: types.ORDER_CANCELLING_ORDER,
});

export const orderCancelledOrder = data => ({
  type: types.ORDER_CANCELLED_ORDER,
  payload: data,
});

export const orderCancelOrderFailed = (orderId, message) => ({
  type: types.ORDER_CANCEL_ORDER_FAILED,
  payload: { orderId, message },
});

export const klaviyoCancelOrder = (data, cancelReason) => ({
  type: types.KLAVIYO_CANCEL_ORDER,
  payload: {
    ...data,
    cancelReason,
  },
});

export const klaviyoCancellingOrder = () => ({
  type: types.KLAVIYO_CANCELLING_ORDER,
});

export const klaviyoCancelledOrder = () => ({
  type: types.KLAVIYO_CANCELLED_ORDER,
});

export const orderLoadCards = () => ({ type: types.ORDER_LOAD_CARDS });
export const orderLoadingCards = () => ({ type: types.ORDER_LOADING_CARDS });
export const orderLoadedCards = () => ({ type: types.ORDER_LOADED_CARDS });

export const orderGetCard = orderId => ({
  type: types.ORDER_GET_CARD,
  payload: { orderId },
});

export const orderGotCard = data => ({
  type: types.ORDER_GOT_CARD,
  payload: data,
});

export const orderGettingCard = () => ({
  type: types.ORDER_GETTING_CARD,
});

export const orderGetCardFailed = (orderId, message) => ({
  type: types.ORDER_GET_CARD_FAILED,
  payload: {
    id: orderId,
    credit_card: {
      error: message,
    },
  },
});

export const orderUpdateCard = (orderId, token, expiryMonth, expiryYear, lastFour) => ({
  type: types.ORDER_UPDATE_CARD,
  payload: {
    orderId, token, expiryMonth, expiryYear, lastFour,
  },
});

export const orderUpdatedCard = data => ({
  type: types.ORDER_UPDATED_CARD,
  payload: data,
});

export const orderUpdatingCard = () => ({
  type: types.ORDER_UPDATING_CARD,
});

export const orderUpdateCardFailed = (orderId, message) => ({
  type: types.ORDER_UPDATE_CARD_FAILED,
  payload: {
    orderId,
    message,
  },
});

export const orderGetCashierCardData = orderId => ({
  type: types.ORDER_GET_CASHIER_CARD_DATA,
  payload: { orderId },
});

export const orderGotCashierCardData = data => ({
  type: types.ORDER_GOT_CASHIER_CARD_DATA,
  payload: data,
});

export const orderGettingCashierCardData = () => ({
  type: types.ORDER_GETTING_CASHIER_CARD_DATA,
});

export const orderGetCashierCardDataFailed = (orderId, message) => ({
  type: types.ORDER_GET_CASHIER_CARD_DATA_FAILED,
  payload: {
    id: orderId,
    cashier_cards: {
      error: message,
    },
  },
});

export const orderClearCashierCardData = orderId => ({
  type: types.ORDER_CLEAR_CASHIER_CARD_DATA,
  payload: { id: orderId, cashier_cards: null, cashier_selected_card_id: null },
});

export const orderUpdatePrepaidSettings = (orderId, recurrAfterLimit) => ({
  type: types.ORDER_UPDATE_PREPAID_SETTINGS,
  payload: { orderId, recurrAfterLimit },
});

export const orderUpdatingPrepaidSettings = () => ({
  type: types.ORDER_UPDATING_PREPAID_SETTINGS,
});

export const orderUpdatedPrepaidSettings = data => ({
  type: types.ORDER_UPDATED_PREPAID_SETTINGS,
  payload: data,
});

export const orderUpdatePrepaidSettingsFailed = (orderId, message) => ({
  type: types.ORDER_UPDATE_PREPAID_SETTINGS_FAILED,
  payload: { orderId, message },
});

export const applyCancelDiscount = (orderId, discountCode, reasonId) => ({
  type: types.ORDER_APPLY_CANCEL_DISCOUNT,
  payload: { orderId, discountCode, reasonId },
});

export const applyingCancelDiscount = () => ({
  type: types.ORDER_APPLYING_CANCEL_DISCOUNT,
});

export const appliedCancelDiscount = data => ({
  type: types.ORDER_APPLIED_CANCEL_DISCOUNT,
  payload: data,
});

export const applyCancelDiscountFailed = (orderId, message) => ({
  type: types.ORDER_APPLY_CANCEL_DISCOUNT_FAILED,
  payload: { orderId, message },
});

export const orderAttemptedCancellation = (orderId, cancelReason) => ({
  type: types.ORDER_ATTEMPTED_CANCEL_LOG,
  payload: { orderId, cancelReason },
});
