import { all, call, put, takeLatest, select } from 'redux-saga/effects';
import moment from 'moment';

import * as requestHelpers from '../helpers/requestHelpers';
import * as types from '../constants/actionTypes';
import * as actions from '../actions/index';

export function* orderUpdateNextShipDate(action) {
  yield put(actions.orderUpdatingNextShipDate());

  const response = yield call(requestHelpers.apiPutRequest, `orders/${action.payload.orderId}/next_ship_date`, {
    next_shipping_date: action.payload.nextShipDate,
  });

  if (response.success) {
    yield put(actions.orderUpdatedNextShipDate(response.data));
  } else {
    yield put(actions.orderUpdateNextShipDateFailed(
      action.payload.orderId, response.errors.message,
    ));
  }
}

export function* updateOrdersNextShipDate() {
  yield put(actions.updatingOrdersNextShipDate());

  const state = yield select();

  const invalidOrderIds = [];
  const nextOrderDates = [];
  state.data.orders.forEach((order) => {
    const purDate = moment(order.purchase_date);
    const { interval_type: intervalType } = order.order_interval_type;
    if (intervalType === 'month') {
      const nextOrderDate =
        purDate
          .add(order.interval_number, 'months')
          .subtract(5, 'day')
          .format('YYYY-MM-DD');
      if (nextOrderDate !== order.next_orders[0]) {
        invalidOrderIds.push(order.id);
        nextOrderDates.push(nextOrderDate);
      }
    }
  });

  if (invalidOrderIds.length) {
    yield all(
      invalidOrderIds.map(
        (orderId, i) =>
          call(orderUpdateNextShipDate, { payload: { orderId, nextShipDate: nextOrderDates[i] } }),
      ),
    );
  }

  yield put(actions.updatedOrdersNextShipDate());
}

function* watchOrderUpdateNextShipDate() {
  yield takeLatest(types.ORDER_UPDATE_NEXT_SHIP_DATE, orderUpdateNextShipDate);
}

function* watchUpdateOrdersNextShipDate() {
  yield takeLatest(types.UPDATE_ORDERS_NEXT_SHIP_DATE, updateOrdersNextShipDate);
}

export default function* orderNextShipDateSagas() {
  yield all([
    watchUpdateOrdersNextShipDate(),
    watchOrderUpdateNextShipDate(),
  ]);
}
