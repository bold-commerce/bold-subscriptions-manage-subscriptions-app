import { call, put } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';

import { orderUpdateNextShipDate } from '../src/sagas/orderNextShipDateSagas';
import * as actions from '../src/actions/index';
import * as requestHelpers from '../src/helpers/requestHelpers';

import windowSetup from './helpers/windowSetup';
import moment from "moment/moment";

beforeAll(() => {
    windowSetup();
});

describe('orderNextShipDate saga', () => {
    const orderId = 1;
    const newNextShipDate = moment().format('YYYY-MM-DD');
    const action = actions.orderUpdateNextShipDate(orderId, newNextShipDate);
    const gen = cloneableGenerator(orderUpdateNextShipDate)(action);

    it('should send the order updating next ship date action', () => {
        expect(gen.next().value)
            .toEqual(put(actions.orderUpdatingNextShipDate()));
    });

    it('should make an api call to apply the new next ship date', () => {
        expect(gen.next().value)
            .toEqual(call(requestHelpers.apiPutRequest, `orders/${orderId}/next_ship_date`, {
                next_shipping_date: newNextShipDate,
            }));
    });

    it('should take the response from the server and send next ship date updated action', () => {
        const response = {
            success: true,
        };
        const genClone = gen.clone();

        expect(genClone.next(response).value)
            .toEqual(put(actions.orderUpdatedNextShipDate()));
    });

    it('should take the response from the server and send error message action', () => {
        const response = {
            success: false,
            message: 'Invalid data.',
        };
        const genClone = gen.clone();

        expect(genClone.next(response).value)
            .toEqual(put(actions.orderUpdateNextShipDateFailed(orderId, response.message)));
    });
});
