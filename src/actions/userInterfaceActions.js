import * as types from '../constants/actionTypes';

export const customerLoggedOut = () => ({
  type: types.INTERFACE_CUSTOMER_LOGGED_OUT,
});

export const dismissDiscountMessage = orderId => ({
  type: types.INTERFACE_DISMISS_DISCOUNT_MESSAGE,
  payload: orderId,
});

export const dismissProductQuantityMessage = orderId => ({
  type: types.INTERFACE_DISMISS_PRODUCT_QUANTITY_MESSAGE,
  payload: orderId,
});

export const dismissProductUpcomingQuantityMessage = orderId => ({
  type: types.INTERFACE_DISMISS_PRODUCT_UPCOMING_QUANTITY_MESSAGE,
  payload: orderId,
});

export const dismissProductSwapMessage = orderId => ({
  type: types.INTERFACE_DISMISS_PRODUCT_SWAP_MESSAGE,
  payload: orderId,
});

export const dismissProductRemoveMessage = productId => ({
  type: types.INTERFACE_DISMISS_PRODUCT_REMOVE_MESSAGE,
  payload: productId,
});

export const dismissBillingMessage = orderId => ({
  type: types.INTERFACE_DISMISS_BILLING_MESSAGE,
  payload: orderId,
});

export const dismissShippingMessage = orderId => ({
  type: types.INTERFACE_DISMISS_SHIPPING_MESSAGE,
  payload: orderId,
});

export const dismissCardMessage = orderId => ({
  type: types.INTERFACE_DISMISS_CARD_MESSAGE,
  payload: orderId,
});

export const dismissShippingMethodMessage = orderId => ({
  type: types.INTERFACE_DISMISS_SHIPPING_METHOD_MESSAGE,
  payload: orderId,
});

export const dismissGetShippingRatesFailedMessage = orderId => ({
  type: types.INTERFACE_DISMISS_GET_SHIPPING_RATES_FAILED_MESSAGE,
  payload: orderId,
});

export const dismissFrequencyIntervalMessage = orderId => ({
  type: types.INTERFACE_DISMISS_FREQUENCY_INTERVAL_MESSAGE,
  payload: orderId,
});

export const dismissUpdateNextShipDateMessage = orderId => ({
  type: types.INTERFACE_DISMISS_UPDATE_NEXT_SHIP_DATE_MESSAGE,
  payload: orderId,
});

export const setCurrentUpdateOrderShippingMethodComponentKey = (orderId, key) => ({
  type: types.INTERFACE_SET_CURRENT_UPDATE_ORDER_SHIPPING_METHOD_COMPONENT_KEY,
  payload:
  orderId,
  key,
});

export const dismissCancelOrderMessage = orderId => ({
  type: types.INTERFACE_DISMISS_CANCEL_ORDER_MESSAGE,
  payload: orderId,
});

export const dismissUpdatePrepaidSettingsMessage = orderId => ({
  type: types.INTERFACE_DISMISS_UPDATE_PREPAID_SETTINGS_MESSAGE,
  payload: orderId,
});
