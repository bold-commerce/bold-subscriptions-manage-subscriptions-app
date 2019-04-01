import * as types from '../constants/actionTypes';

export default function groupsReducer(state, action) {
  switch (action.type) {
    case types.ORDER_PRODUCT_RECEIVED_SWAP:
      return state.map((group) => {
        if (group.id === action.payload.id) {
          return Object.assign({}, group, action.payload);
        }
        return group;
      });
    default:
      return state;
  }
}
