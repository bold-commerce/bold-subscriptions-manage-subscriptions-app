import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import SubscriptionDetailHeader from './SubscriptionDetailHeader';
import AddressShippingBlock from '../AddressShippingBlock';
import OrderProductsBlock from '../OrderProductsBlock';
import PaymentInformationBlock from '../PaymentInformationBlock';
import TransactionHistoryBlock from '../TransactionHistoryBlock';
import OrderCancellationBlock from '../OrderCancellationBlock';
import Translation from '../../Translation';

const menuItems = [
  {
    key: 'address_and_shipping_title',
    component: AddressShippingBlock,
  },
  {
    key: 'payment_information_title',
    component: PaymentInformationBlock,
  },
  {
    key: 'order_products_title',
    component: OrderProductsBlock,
  },
  // {
  //   key: 'upcoming_order_date',
  //   component: UpcomingOrdersBlock,
  // },
  // {
  //   key: 'order_discount_title',
  //   component: OrderDiscountBlock,
  // },
  {
    key: 'transaction_history_title',
    component: TransactionHistoryBlock,
  },
  {
    key: 'cancel_block_heading',
    component: OrderCancellationBlock,
  },
];

class DetailsLayout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: 0,
      selectedOrder: 0,
    };

    this.handleSelectItem = this.handleSelectItem.bind(this);
    this.handleOrderChange = this.handleOrderChange.bind(this);
    this.renderDetail = this.renderDetail.bind(this);
  }

  handleSelectItem(selected) {
    this.setState({ selected });
  }

  handleOrderChange(e) {
    this.setState({ selectedOrder: e.target.value });
  }

  renderDetail() {
    const { selected, selectedOrder } = this.state;
    const { orders } = this.props;
    const Comp = menuItems[selected].component;

    return (
      <Comp orderId={orders[selectedOrder].id} />
    );
  }

  render() {
    const { selected, selectedOrder } = this.state;
    const { orders } = this.props;
    const curOrder = orders[selectedOrder];

    return (
      <div className="subscription-content">
        <div className="subscription-flex topheader">
          <div className="subscription-select-container">
            <select
              className="select-box"
              value={selectedOrder}
              onChange={this.handleOrderChange}
            >
              {orders.map((order, id) => (
                <option
                  key={id}
                  value={id}
                >
                  {`Subscription - #${order.id}`}
                </option>
              ))}
            </select>
          </div>
          <div className="subscription-title">
            <SubscriptionDetailHeader orderId={curOrder.id} />
          </div>
        </div>
        <div className="subscription-flex">
          <div className="details-sidebar">
            {menuItems
              .filter(item => !(item.key === 'cancel_block_heading' && !curOrder.cancellable))
              .map((item, id) => (
                <div
                  key={id}
                  className={classnames('sidebar-item', selected === id ? 'selected' : '')}
                  onClick={() => this.handleSelectItem(id)}
                >
                  <Translation textKey={item.key} />
                </div>
            ))}
          </div>
          <div className="details-content">
            {this.renderDetail()}
          </div>
        </div>
      </div>
    );
  }
}

DetailsLayout.propTypes = {
  orders: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default DetailsLayout;
