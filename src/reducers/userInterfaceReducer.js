import * as types from '../constants/actionTypes';

const initialState = {
  loadingTotal: 3,
  loadingProgress: 0,
  discountMessages: {},
  applyingDiscount: {},
  billingMessages: {},
  shippingMessages: {},
  shippingMethodMessage: {},
  frequencyIntervalMessage: {},
  updateNextShipDateMessage: {},
  getShippingRatesFailedMessage: {},
  shippingRates: [],
  currentUpdateOrderShippingMethodKey: {},
  productQuantityMessages: {},
  productRemoveMessages: {},
  cancelOrderMessages: {},
  updateCardMessages: {},
  productUpcomingQuantityMessages: {},
  updatePrepaidSettingsMessages: {},
  productSwapMessages: {},
  cancelDiscountMessage: {},
  customerLoggedOutError: false,
};

export default function userInterface(passedState, action) {
  let state = passedState;
  if (typeof state === 'undefined') {
    state = {
      ...initialState,
      ...window.manageSubscription.initialState.userInterface,
    };
  }

  switch (action.type) {
    case types.INTERFACE_CUSTOMER_LOGGED_OUT:
      return {
        ...state,
        customerLoggedOutError: true,
      };
    case types.APP_AUTHENTICATED:
    case types.APP_DATA_INITIALIZED:
    case types.UPDATED_ORDERS_NEXT_SHIP_DATE:
      return {
        ...state,
        loadingProgress: state.loadingProgress + 1,
      };
    case types.ORDER_APPLYING_DISCOUNT_CODE:
      return {
        ...state,
        applyingDiscount: true,
      };
    case types.ORDER_APPLIED_DISCOUNT_CODE:
      return {
        ...state,
        applyingDiscount: false,
        discountMessages: {
          ...state.discountMessages,
          [action.payload.id]: {
            messageTextKey: 'discount_applied_message',
            type: 'success',
          },
        },
      };
    case types.ORDER_APPLY_DISCOUNT_CODE_FAILED:
      return {
        ...state,
        applyingDiscount: false,
        discountMessages: {
          ...state.discountMessages,
          [action.payload.orderId]: {
            message: action.payload.message,
            type: 'error',
          },
        },
      };
    case types.ORDER_PRODUCT_UPDATED_UPCOMING_QUANTITY:
      return {
        ...state,
        productUpcomingQuantityMessages: {
          ...state.productUpcomingQuantityMessages,
          [action.payload.id]: {
            messageTextKey: 'upcoming_quantity_updated_message',
            type: 'success',
          },
        },
      };
    case types.ORDER_PRODUCT_UPDATED_QUANTITY:
      return {
        ...state,
        productQuantityMessages: {
          ...state.productQuantityMessages,
          [action.payload.id]: {
            messageTextKey: 'quantity_updated_message',
            type: 'success',
          },
        },
      };
    case types.ORDER_PRODUCT_UPDATE_UPCOMING_QUANTITY_FAILED:
    case types.ORDER_PRODUCT_UPDATED_QUANTITY_FAILED:
      return {
        ...state,
        productQuantityMessages: {
          ...state.productQuantityMessages,
          [action.payload.orderId]: {
            message: action.payload.message,
            type: 'error',
          },
        },
      };
    case types.ORDER_PRODUCT_UPDATE_UPCOMING_QUANTITY_CONFLICT:
    case types.ORDER_PRODUCT_UPDATE_QUANTITY_CONFLICT:
      return {
        ...state,
        updatingQuantity: true,
        productQuantityMessages: {
          ...state.productQuantityMessages,
          [action.payload.orderId]: {
            type: 'conflict',
          },
        },
      };
    case types.INTERFACE_DISMISS_PRODUCT_QUANTITY_MESSAGE:
      return {
        ...state,
        productQuantityMessages: Object.assign(
          {},
          state.productQuantityMessages,
          { [action.payload]: null },
        ),
      };
    case types.INTERFACE_DISMISS_PRODUCT_UPCOMING_QUANTITY_MESSAGE:
      return {
        ...state,
        productUpcomingQuantityMessages: Object.assign(
          {},
          state.productQuantityMessages,
          { [action.payload]: null },
        ),
      };
    case types.INTERFACE_DISMISS_PRODUCT_SWAP_MESSAGE:
      return {
        ...state,
        productSwapMessages: Object.assign(
          {},
          state.productSwapMessages,
          { [action.payload]: null },
        ),
      };
    case types.ORDER_PRODUCT_REMOVED:
      return {
        ...state,
        productQuantityMessages: {
          ...state.productQuantityMessages,
          [action.payload.id]: {
            messageTextKey: 'product_removed_message',
            type: 'success',
          },
        },
      };
    case types.ORDER_PRODUCT_REMOVE_FAILED:
      return {
        ...state,
        productRemoveMessages: {
          ...state.productRemoveMessages,
          [action.payload.productId]: {
            message: action.payload.message,
            type: 'error',
          },
        },
      };
    case types.ORDER_PRODUCT_REMOVE_CONFLICT:
      return {
        ...state,
        removingProduct: true,
        productRemoveMessages: {
          ...state.productRemoveMessages,
          [action.payload.productId]: {
            type: 'conflict',
          },
        },
      };
    case types.INTERFACE_DISMISS_PRODUCT_REMOVE_MESSAGE:
      return {
        ...state,
        productRemoveMessages: Object.assign(
          {},
          state.productRemoveMessages,
          { [action.payload]: null },
        ),
      };
    case types.INTERFACE_DISMISS_DISCOUNT_MESSAGE:
      return {
        ...state,
        discountMessages: Object.assign(
          {},
          state.discountMessages,
          { [action.payload]: null },
        ),
      };
    case types.ORDER_UPDATED_BILLING_ADDRESS:
      return {
        ...state,
        billingMessages: {
          ...state.billingMessages,
          [action.payload.id]: {
            messageTextKey: 'billing_updated_message',
            type: 'success',
          },
        },
      };
    case types.ORDER_UPDATE_BILLING_ADDRESS_FAILED:
      return {
        ...state,
        applyingBilling: false,
        billingMessages: {
          ...state.billingMessages,
          [action.payload.orderId]: {
            message: action.payload.message,
            type: 'error',
          },
        },
      };
    case types.INTERFACE_DISMISS_BILLING_MESSAGE:
      return {
        ...state,
        billingMessages: Object.assign(
          {},
          state.billingMessages,
          { [action.payload]: null },
        ),
      };
    case types.ORDER_UPDATED_CARD:
      return {
        ...state,
        updateCardMessages: {
          ...state.updateCardMessages,
          [action.payload.id]: {
            messageTextKey: 'card_updated_message',
            type: 'success',
          },
        },
      };
    case types.ORDER_UPDATE_CARD_FAILED:
      return {
        ...state,
        applyingBilling: false,
        updateCardMessages: {
          ...state.updateCardMessages,
          [action.payload.orderId]: {
            message: action.payload.message,
            type: 'error',
          },
        },
      };
    case types.INTERFACE_DISMISS_CARD_MESSAGE:
      return {
        ...state,
        updateCardMessages: Object.assign(
          {},
          state.updateCardMessages,
          { [action.payload]: null },
        ),
      };
    case types.ORDER_UPDATED_SHIPPING_ADDRESS:
      return {
        ...state,
        shippingMessages: {
          ...state.shippingMessages,
          [action.payload.id]: {
            messageTextKey: 'shipping_updated_message',
            type: 'success',
          },
        },
      };
    case types.ORDER_UPDATE_SHIPPING_ADDRESS_FAILED:
      return {
        ...state,
        applyingShipping: false,
        shippingMessages: {
          ...state.shippingMessages,
          [action.payload.orderId]: {
            message: action.payload.message,
            type: 'error',
          },
        },
      };
    case types.ORDER_UPDATE_SHIPPING_ADDRESS_CONFLICT:
      return {
        ...state,
        applyingShipping: true,
        shippingMessages: {
          ...state.shippingMessages,
          [action.payload.orderId]: {
            type: 'conflict',
          },
        },
      };
    case types.INTERFACE_DISMISS_SHIPPING_MESSAGE:
      return {
        ...state,
        shippingMessages: Object.assign(
          {},
          state.shippingMessages,
          { [action.payload]: null },
        ),
      };
    case types.ORDER_UPDATED_ORDER_SHIPPING_RATE:
      return {
        ...state,
        shippingMethodMessage: {
          ...state.shippingMethodMessage,
          [action.payload.id]: {
            messageTextKey: 'shipping_method_updated_message',
            type: 'success',
          },
        },
      };
    case types.ORDER_UPDATE_SHIPPING_METHOD_FAILED:
      return {
        ...state,
        applyingShipping: false,
        shippingMethodMessage: {
          ...state.shippingMethodMessage,
          [action.payload.orderId]: {
            message: action.payload.message,
            type: 'error',
          },
        },
      };
    case types.INTERFACE_DISMISS_SHIPPING_METHOD_MESSAGE:
      return {
        ...state,
        shippingMethodMessage: Object.assign(
          {},
          state.shippingMethodMessage,
          { [action.payload]: null },
        ),
      };
    case types.INTERFACE_DISMISS_GET_SHIPPING_RATES_FAILED_MESSAGE:
      return {
        ...state,
        getShippingRatesFailedMessage: Object.assign(
          {},
          state.getShippingRatesFailedMessage,
          { [action.payload]: null },
        ),
      };
    case types.ORDER_GET_SHIPPING_RATES:
      return {
        ...state,
        shippingRates: {
          ...state.shippingRates,
          [action.payload.orderId]: [],
        },
      };
    case types.ORDER_GOT_SHIPPING_RATES:
      return {
        ...state,
        shippingRates: {
          ...state.shippingRates,
          [action.payload.id]: action.payload.shipping_rates,
        },
      };
    case types.ORDER_GET_SHIPPING_RATES_FAILED:
      return {
        ...state,
        getShippingRatesFailedMessage: {
          ...state.getShippingRatesFailedMessage,
          [action.payload.orderId]: {
            message: action.payload.message,
            type: 'error',
          },
        },
      };
    case types.INTERFACE_SET_CURRENT_UPDATE_ORDER_SHIPPING_METHOD_COMPONENT_KEY:
      return {
        ...state,
        currentUpdateOrderShippingMethodKey: {
          [action.payload]: {
            key: action.key,
          },
        },
      };
    case types.ORDER_UPDATED_NEXT_SHIP_DATE:
      return {
        ...state,
        updateNextShipDateMessage: {
          ...state.updateNextShipDateMessage,
          [action.payload.id]: {
            messageTextKey: 'next_ship_date_updated_message',
            type: 'success',
          },
        },
      };
    case types.ORDER_UPDATE_NEXT_SHIP_DATE_FAILED:
      return {
        ...state,
        updateNextShipDateMessage: {
          ...state.updateNextShipDateMessage,
          [action.payload.orderId]: {
            message: action.payload.message,
            type: 'error',
          },
        },
      };
    case types.ORDER_UPDATED_FREQUENCY_INTERVAL:
      return {
        ...state,
        frequencyIntervalMessage: {
          ...state.frequencyIntervalMessage,
          [action.payload.id]: {
            messageTextKey: 'frequency_interval_updated_message',
            type: 'success',
          },
        },
      };
    case types.ORDER_UPDATE_FREQUENCY_INTERVAL_FAILED:
      return {
        ...state,
        frequencyIntervalMessage: {
          ...state.frequencyIntervalMessage,
          [action.payload.orderId]: {
            message: action.payload.message,
            type: 'error',
          },
        },
      };
    case types.INTERFACE_DISMISS_FREQUENCY_INTERVAL_MESSAGE:
      return {
        ...state,
        frequencyIntervalMessage: Object.assign(
          {},
          state.frequencyIntervalMessage,
          { [action.payload]: null },
        ),
      };
    case types.INTERFACE_DISMISS_UPDATE_NEXT_SHIP_DATE_MESSAGE:
      return {
        ...state,
        updateNextShipDateMessage: Object.assign(
          {},
          state.updateNextShipDateMessage,
          { [action.payload]: null },
        ),
      };
    case types.ORDER_PRODUCT_SAVED_SWAP:
      return {
        ...state,
        productSwapMessages: {
          ...state.productSwapMessages,
          [action.payload.id]: {
            messageTextKey: 'swap_product_message',
            type: 'success',
          },
        },
      };
    case types.ORDER_PRODUCT_SAVE_SWAP_FAILED:
      return {
        ...state,
        productSwapMessages: {
          ...state.productSwapMessages,
          [action.payload.orderId]: {
            message: action.payload.message,
            type: 'error',
          },
        },
      };
    case types.ORDER_PRODUCT_SAVE_SWAP_CONFLICT:
      return {
        ...state,
        productSwapMessages: {
          ...state.productSwapMessages,
          [action.payload.orderId]: {
            type: 'conflict',
          },
        },
      };
    case types.ORDER_PRODUCT_RECEIVED_SWAP:
      return {
        ...state,
        swapProductsReceived: Object.assign(
          { [action.payload.product_internal_id]: true },
        ),
      };
    case types.ORDER_SKIPPED_ORDER:
    case types.ORDER_SKIP_ORDER_FAILED:
      return {
        ...state,
        skipLoading: false,
      };
    case types.ORDER_SKIPPING_ORDER:
      return {
        ...state,
        skipLoading: true,
      };
    case types.ORDER_RESUMED_ORDER:
    case types.ORDER_RESUME_ORDER_FAILED:
      return {
        ...state,
        resumeLoading: false,
      };
    case types.ORDER_RESUMING_ORDER:
      return {
        ...state,
        resumeLoading: true,
      };
    case types.ORDER_CANCELLED_ORDER:
      return {
        ...state,
        cancellingOrder: false,
        cancelOrderMessages: {
          ...state.cancelOrderMessages,
          [action.payload.id]: {
            messageTextKey: 'cancelled_order_message',
            type: 'success',
          },
        },
      };
    case types.ORDER_CANCEL_ORDER_FAILED:
      return {
        ...state,
        cancellingOrder: false,
        cancelOrderMessages: {
          ...state.cancelOrderMessages,
          [action.payload.orderId]: {
            message: action.payload.message,
            type: 'error',
          },
        },
      };
    case types.INTERFACE_DISMISS_CANCEL_ORDER_MESSAGE:
      return {
        ...state,
        cancelOrderMessages: Object.assign(
          {},
          state.cancelOrderMessages,
          { [action.payload]: null },
        ),
      };
    case types.ORDER_UPDATED_PREPAID_SETTINGS:
      return {
        ...state,
        updatingPrepaidSettings: false,
        updatePrepaidSettingsMessages: {
          ...state.updatePrepaidSettingsMessages,
          [action.payload.id]: {
            messageTextKey: 'order_prepaid_updated_message',
            type: 'success',
          },
        },
      };
    case types.ORDER_UPDATE_PREPAID_SETTINGS_FAILED:
      return {
        ...state,
        updatingPrepaidSettings: false,
        updatePrepaidSettingsMessages: {
          ...state.updatePrepaidSettingsMessages,
          [action.payload.orderId]: {
            message: action.payload.message,
            type: 'error',
          },
        },
      };
    case types.INTERFACE_DISMISS_UPDATE_PREPAID_SETTINGS_MESSAGE:
      return {
        ...state,
        updatePrepaidSettingsMessages: Object.assign(
          {},
          state.updatePrepaidSettingsMessages,
          { [action.payload]: null },
        ),
      };
    case types.ORDER_APPLYING_CANCEL_DISCOUNT:
      return {
        ...state,
        applyingCancelDiscount: true,
      };
    case types.ORDER_APPLIED_CANCEL_DISCOUNT:
      return {
        ...state,
        applyingCancelDiscount: false,
        cancelDiscountMessage: {
          ...state.cancelDiscountMessage,
          [action.payload.id]: {
            messageTextKey: 'cancel_discount_applied_message',
            type: 'success',
          },
        },
      };
    case types.ORDER_APPLY_CANCEL_DISCOUNT_FAILED:
      return {
        ...state,
        applyingCancelDiscount: false,
        cancelDiscountMessage: {
          ...state.cancelDiscountMessage,
          [action.payload.orderId]: {
            message: action.payload.message,
            type: 'error',
          },
        },
      };
    default:
      return state;
  }
}
