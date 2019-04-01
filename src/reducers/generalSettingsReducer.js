import * as types from '../constants/actionTypes';

export default function generalSettingsReducer(state, action) {
  switch (action.type) {
    case types.ORDER_UPDATED_CARD: {
      return { ...state, gateway_token: action.payload.gateway_token };
    }
    default:
      return state;
  }
}
