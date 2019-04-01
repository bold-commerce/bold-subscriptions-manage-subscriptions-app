import * as types from '../constants/actionTypes';

export default function productsReducer(state, action) {
  switch (action.type) {
    case types.ORDER_PRODUCT_RECEIVED_SWAP: {
      const newState = state;
      action.payload.products_with_price_difference.forEach((swapProd) => {
        if (!newState.find(product => product.product_id === swapProd.product_id)) {
          newState.push({
            product_id: swapProd.product_id,
            handle: swapProd.handle,
          });
        }
      });
      return newState;
    }
    case types.LOADED_PRODUCT: {
      const newState = state.filter(product => product.product_id !== action.payload.id);
      const oldProductData = state.find(product => product.product_id === action.payload.id);
      newState.push({ ...oldProductData, shopify_data: action.payload });
      return newState;
    }
    default:
      return state;
  }
}
