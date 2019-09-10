import { all, call, put, takeLatest } from 'redux-saga/effects';

import * as requestHelpers from '../helpers/requestHelpers';
import * as types from '../constants/actionTypes';
import * as actions from '../actions/index';

export function* appAuthenticate() {
  yield put(actions.appAuthenticating());

  const { customerToken, customerId } = requestHelpers.getCustomerDataFromQuery();
  if (customerToken && customerId) {
    // authenticate with token directly
    window.manageSubscription.apiToken = customerToken;
    window.manageSubscription.shopifyCustomerId = customerId;

    yield put(actions.appAuthenticated());
    yield put(actions.appDataInitialize());
  } else {
    // authenticate regularly
    const response = yield call(
      requestHelpers.getRequest,
      `${window.manageSubscription.proxyEndpoint}/api/auth/token?customer_id=${window.manageSubscription.shopifyCustomerId}`,
    );

    if (response.success) {
      window.manageSubscription.apiToken = response.data.token;
      yield put(actions.appAuthenticated());
      yield put(actions.appDataInitialize());
    } else {
      throw new Error('Failed to Authenticate');
    }
  }
}

function* watchAppAuthenticate() {
  yield takeLatest(types.APP_AUTHENTICATE, appAuthenticate);
}

export function* appInitializeData() {
  yield put(actions.appDataInitializing());

  const response = yield call(requestHelpers.apiGetRequest, 'initial_data');

  if (response.success) {
    yield put(actions.appDataInitialized(response.data));
    yield put(actions.updateOrdersNextShipDate());
    yield put(actions.loadProducts());
    yield put(actions.orderLoadCards());
  } else {
    // todo: response.errors
  }
}

function* watchAppInitializeData() {
  yield takeLatest(types.APP_DATA_INITIALIZE, appInitializeData);
}

export default function* appSagas() {
  yield all([
    watchAppAuthenticate(),
    watchAppInitializeData(),
  ]);
}
