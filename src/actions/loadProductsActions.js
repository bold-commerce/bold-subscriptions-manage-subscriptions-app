import * as types from '../constants/actionTypes';

export const loadProducts = () => ({ type: types.LOAD_PRODUCTS });
export const loadingProducts = () => ({ type: types.LOADING_PRODUCTS });
export const loadedProducts = () => ({ type: types.LOADED_PRODUCTS });

export const loadingProduct = product => ({ type: types.LOADING_PRODUCT, payload: product });
export const loadedProduct = product => ({ type: types.LOADED_PRODUCT, payload: product });
