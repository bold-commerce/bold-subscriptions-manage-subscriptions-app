import React, { Component } from 'react';
import { connect } from 'react-redux';
import formatMoney from '../../helpers/moneyFormatHelpers';
import Table from './Table';
import Translation from '../Translation';
import SubscriptionContentBlock from './SubscriptionContentBlock';
import { ORDER_PROP_TYPE } from '../../constants/PropTypes';

class TransactionHistoryBlock extends Component {
  render() {
    const { order } = this.props;
    let content = null;

    if (order.order_logs.length > 0) {
      // eslint-disable-next-line max-len
      const applyExchangeRate = (columnValue, exchangeRate, currencyFormat) => formatMoney((columnValue * exchangeRate) * 100, currencyFormat);

      const headerTranslationKeys = [
        'order_log_shopify_order_id_header',
        'order_log_price_header',
        'order_log_tax_header',
        'order_log_shipping_header',
        'order_log_coupon_header',
        'order_log_date_created_header',
      ];
      const logKeys = ['shopify_order_num', 'price', 'tax', 'shipping', 'discount_amount', 'purchase_date'];
      const tableHeaders = headerTranslationKeys.map(t => <Translation textKey={t} />);
      const tableRowKeys = order.order_logs.map(log => log.id);
      const tableRowData = order.order_logs.map((log) => {
        // eslint-disable-next-line max-len
        const exchangeRate = log.order_log_currency && log.order_log_currency.currency_exchange_rate > 0
          ? log.order_log_currency.currency_exchange_rate : 1;
        // eslint-disable-next-line max-len
        const currencyFormat = log.order_log_currency && log.order_log_currency.currency_format.length > 0
          ? `${log.order_log_currency.currency_format} ${log.order_log_currency.currency}` : '';

        return logKeys.reduce((carry, columnName) => {
          const columnValue = log[columnName];
          if (columnName === 'shopify_order_num') {
            if (log.shopify_order_token) {
              carry.push(
                <a href={`/account/orders/${log.shopify_order_token}`} className="text-button" target="_blank">
                  {columnValue}
                </a>,
              );
            } else {
              carry.push(
                <span className="transaction-skipped">
                  {columnValue}
                </span>,
              );
            }
          } else if (columnName === 'price' || columnName === 'tax' || columnName === 'shipping') {
            carry.push(`${applyExchangeRate(columnValue, exchangeRate, currencyFormat)}`);
          } else if (columnName === 'discount_amount') {
            if (log.free_shipping_discount_applied === 1 && log.shipping > 0) {
              carry.push(`-${applyExchangeRate(log.shipping, exchangeRate, currencyFormat)}`);
            } else if (columnValue > 0) {
              carry.push(`-${applyExchangeRate(columnValue, exchangeRate, currencyFormat)}`);
            } else {
              carry.push(`${applyExchangeRate(columnValue, exchangeRate, currencyFormat)}`);
            }
          } else {
            carry.push(columnValue);
          }
          return carry;
        }, []);
      });

      content = (<Table
        headers={tableHeaders}
        rowData={tableRowData}
        rowKeys={tableRowKeys}
        columnKeys={logKeys}
      />);
    }

    return (
      <SubscriptionContentBlock titleTranslationKey="transaction_history_title" >
        {content}
      </SubscriptionContentBlock>
    );
  }
}

TransactionHistoryBlock.propTypes = {
  order: ORDER_PROP_TYPE.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  order: state.data.orders.find(order => order.id === ownProps.orderId),
});


export default connect(mapStateToProps)(TransactionHistoryBlock);
