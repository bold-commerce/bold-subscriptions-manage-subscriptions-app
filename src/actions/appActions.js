import * as types from '../constants/actionTypes';

export const appAuthenticate = () => ({ type: types.APP_AUTHENTICATE });
export const appAuthenticating = () => ({ type: types.APP_AUTHENTICATING });
export const appAuthenticated = () => ({ type: types.APP_AUTHENTICATED });

export const appDataInitialize = () => ({ type: types.APP_DATA_INITIALIZE });
export const appDataInitializing = () => ({ type: types.APP_DATA_INITIALIZING });
export const appDataInitialized = data => ({
  type: types.APP_DATA_INITIALIZED,
  payload: data,
});
