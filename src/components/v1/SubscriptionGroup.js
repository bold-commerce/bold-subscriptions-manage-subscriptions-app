import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';

import AddressShippingBlock from './AddressShippingBlock';
import OrderDiscountBlock from './OrderDiscountBlock';
import OrderProductsBlock from './OrderProductsBlock';
import PaymentInformationBlock from './PaymentInformationBlock';
import SubscriptionGroupHeader from './SubscriptionGroupHeader';
import TransactionHistoryBlock from './TransactionHistoryBlock';
import Translation from '../Translation';
import UpcomingOrdersBlock from './UpcomingOrdersBlock';
import OrderCancellationBlock from './OrderCancellationBlock';
import { ORDER_PROP_TYPE } from '../../constants/PropTypes';
import SubscriptionGroupAuthCreditCard from './SubscriptionGroupAuthCreditCard';

class SubscriptionGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentAltered: false,
    };

    this.toggleDetails = this.toggleDetails.bind(this);
  }

  componentDidMount() {
    this.oneSub();
  }

  oneSub() {
    if (this.props.orderCount === 1) {
      this.setState({ contentAltered: !this.state.contentAltered });
    }
  }

  toggleDetails() {
    this.setState({ contentAltered: !this.state.contentAltered });
  }

  render() {
    const { order, hasDeletedProducts } = this.props;

    return (
      <div className="subscription-container">
        <SubscriptionGroupHeader orderId={order.id} />
        {order.status === 2 ? <SubscriptionGroupAuthCreditCard orderId={order.id} /> : null}
        {
          hasDeletedProducts ? null :
          <div className="subscription-content-container">
            <div
              className="toggle-subscription-content text-button"
              onClick={this.toggleDetails}
              role="presentation"
            >
              <p>
                <Translation
                  textKey={
                    this.state.contentAltered ?
                      'toggle_subscription_details_altered' :
                      'toggle_subscription_details'
                  }
                />
              </p>
            </div>
            <div className={classnames('subscription-content', this.state.contentAltered ? '' : 'altered')}>
              <AddressShippingBlock orderId={order.id} />
              <PaymentInformationBlock orderId={order.id} status={order.status} />
              <OrderProductsBlock orderId={order.id} disabled={order.status !== 0} />
              <UpcomingOrdersBlock orderId={order.id} disabled={order.status !== 0} />
              <OrderDiscountBlock orderId={order.id} disabled={order.status !== 0} />
              <TransactionHistoryBlock orderId={order.id} />
              {
                (order.is_cancellable) ?
                  <OrderCancellationBlock orderId={order.id} /> :
                  null
              }
            </div>
          </div>
        }
      </div>
    );
  }
}

SubscriptionGroup.propTypes = {
  order: ORDER_PROP_TYPE.isRequired,
  hasDeletedProducts: PropTypes.bool.isRequired,
  orderCount: PropTypes.number.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  order: state.data.orders.find(order => order.id === ownProps.orderId),
  hasDeletedProducts: state.data.orders.find(o => o.id === ownProps.orderId)
    .order_products.filter(prod => prod.status === 1).length > 0,
  orderCount: state.data.orders.length,
});

export default connect(mapStateToProps)(SubscriptionGroup);
