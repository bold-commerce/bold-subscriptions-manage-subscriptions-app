import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

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
    };

    this.handleSelectItem = this.handleSelectItem.bind(this);
    this.renderDetail = this.renderDetail.bind(this);
  }

  handleSelectItem(selected) {
    this.setState({ selected });
  }

  renderDetail() {
    const { selected } = this.state;
    const { orderId } = this.props;
    const Comp = menuItems[selected].component;

    return (
      <Comp orderId={orderId} />
    );
  }

  render() {
    const { selected } = this.state;
    const { cancellable } = this.props;

    return (
      <div className="subscription-flex">
        <div className="details-sidebar">
          {menuItems
            .filter(item => !(item.key === 'cancel_block_heading' && !cancellable))
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
    );
  }
}

DetailsLayout.propTypes = {
  orderId: PropTypes.number.isRequired,
  cancellable: PropTypes.bool.isRequired,
};

export default DetailsLayout;
