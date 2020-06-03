import * as types from '../constants/actionTypes';

export default function generalSettingsReducer(state, action) {
  switch (action.type) {
    case types.ORDER_UPDATED_CARD: {
      if (action.payload.gateway_token && action.payload.gateway_token.length > 0) {
        return {
          ...state,
          gateway_token: action.payload.gateway_token,
        };
      }
      return state;
    }
    default:
      return state;
  }
}
