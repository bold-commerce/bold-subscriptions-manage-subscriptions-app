import * as types from '../constants/actionTypes';

export default function ordersReducer(state, action) {
  switch (action.type) {
    case types.ORDER_APPLIED_DISCOUNT_CODE:
    case types.ORDER_UPDATED_SHIPPING_ADDRESS:
    case types.ORDER_UPDATED_BILLING_ADDRESS:
    case types.ORDER_UPDATED_ORDER_SHIPPING_RATE:
    case types.ORDER_UPDATED_FREQUENCY_INTERVAL:
    case types.ORDER_GOT_SHIPPING_RATES:
    case types.ORDER_SKIPPED_ORDER:
    case types.ORDER_UPDATED_NEXT_SHIP_DATE:
    case types.ORDER_RESUMED_ORDER:
    case types.ORDER_PAUSED_SUBSCRIPTION:
    case types.ORDER_RESUMED_SUBSCRIPTION:
    case types.ORDER_PRODUCT_UPDATED_QUANTITY:
    case types.ORDER_PRODUCT_UPDATED_UPCOMING_QUANTITY:
    case types.ORDER_PRODUCT_SAVED_SWAP:
    case types.ORDER_PRODUCT_REMOVED:
    case types.ORDER_UPDATED_CARD:
    case types.ORDER_GOT_CARD:
    case types.ORDER_UPDATED_PREPAID_SETTINGS:
    case types.ORDER_GOT_CASHIER_CARD_DATA:
    case types.ORDER_CLEAR_CASHIER_CARD_DATA:
    case types.ORDER_APPLIED_CANCEL_DISCOUNT:
    case types.ORDER_GET_CASHIER_CARD_DATA_FAILED:
    case types.ORDER_AUTHENTICATE_CARD_SAVE_CLOSE:
    case types.ORDER_GET_CARD_FAILED: {
      const payload = Object.assign({}, action.payload);
      delete payload.gateway_token;
      return state.map((order) => {
        if (order.id === payload.id) {
          return Object.assign({}, order, payload);
        }

        return order;
      });
    }
    case types.ORDER_CANCELLED_ORDER: {
      const newState = Object.assign([], state);
      const indexOfOrderToDelete = newState.findIndex(order => order.id === action.payload.id);
      if (indexOfOrderToDelete !== -1) {
        newState.splice(indexOfOrderToDelete, 1);
      }
      return newState;
    }
    default:
      return state;
  }
}
