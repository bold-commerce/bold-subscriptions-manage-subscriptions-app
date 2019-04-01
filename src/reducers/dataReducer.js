import * as types from '../constants/actionTypes';
import productsReducer from './productsReducer';
import ordersReducer from './ordersReducer';
import groupsReducer from './groupsReducer';
import generalSettingsReducer from './generalSettingsReducer';

const initialState = {
  provinces: {},
};

export default function data(passedState, action) {
  let state = passedState;
  if (typeof state === 'undefined') {
    state = {
      ...initialState,
      ...window.manageSubscription.initialState.data,
    };
  }

  switch (action.type) {
    case types.APP_DATA_INITIALIZED:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return {
        ...state,
        products: productsReducer(state.products, action),
        orders: ordersReducer(state.orders, action),
        groups: groupsReducer(state.groups, action),
        general_settings: generalSettingsReducer(state.general_settings, action),
      };
  }
}
