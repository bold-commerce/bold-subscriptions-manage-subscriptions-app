import dataReducer from '../src/reducers/dataReducer';
import * as actions from '../src/actions/index';

import windowSetup from './helpers/windowSetup';

beforeAll(() => {
  windowSetup();
});

describe('data reducer', () => {
  it('should contain the initial state from the window', () => {
    const result = dataReducer(undefined, {});

    Object.keys(window.manageSubscription.initialState.data)
      .forEach(key => expect(result).toHaveProperty(key));
  });

  it('should handle APP_DATA_INITIALIZED', () => {
    const testData = { test: true };
    expect(dataReducer({}, actions.appDataInitialized(testData)))
      .toEqual(testData);
  });
});
