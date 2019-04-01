import { call, put } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import { appAuthenticate, appInitializeData } from '../src/sagas/appSagas';
import * as actions from '../src/actions/index';
import * as requestHelpers from '../src/helpers/requestHelpers';

import windowSetup from './helpers/windowSetup';

beforeAll(() => {
  windowSetup();
});

describe('appAuthenticate saga', () => {
  const gen = cloneableGenerator(appAuthenticate)();

  it('should send authenticating action', () => {
    expect(gen.next().value)
      .toEqual(put(actions.appAuthenticating()));
  });

  it('should get the token', () => {
    expect(gen.next().value)
      .toEqual(call(requestHelpers.getRequest, 'test/api/auth/token?customer_id=123'));
  });

  it('should use token properly and start initialize', () => {
    const token = 'abc123';
    const genClone = gen.clone();

    expect(genClone.next({ success: true, data: { token } }).value)
      .toEqual(put(actions.appAuthenticated()));

    expect(window.manageSubscription.apiToken).toBe(token);

    expect(genClone.next().value)
      .toEqual(put(actions.appDataInitialize()));
    expect(genClone.next().done)
      .toEqual(true);
  });


  it('should fail on error response', () => {
    const genClone = gen.clone();

    expect(() => genClone.next({ error: '123' }))
      .toThrow();
    expect(genClone.next().done)
      .toEqual(true);
  });
});

describe('appInitializeData saga', () => {
  const gen = appInitializeData();

  it('should send initializing action', () => {
    expect(gen.next().value)
      .toEqual(put(actions.appDataInitializing()));
  });

  it('should request initial data', () => {
    expect(gen.next().value)
      .toEqual(call(requestHelpers.apiGetRequest, 'initial_data'));
  });

  it('should send initialized action with data', () => {
    const res = { success: true, data: { test: true } };

    expect(gen.next(res).value)
      .toEqual(put(actions.appDataInitialized(res.data)));
  });

  it('should send load products action', () => {
    expect(gen.next().value)
      .toEqual(put(actions.loadProducts()));
  });

  it('should send load cards action', () => {
    expect(gen.next().value)
      .toEqual(put(actions.orderLoadCards()));
  });

  it('should be done', () => {
    expect(gen.next().done)
      .toEqual(true);
  });
});
