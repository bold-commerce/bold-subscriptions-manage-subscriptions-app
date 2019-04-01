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

class SubscriptionGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentAltered: false,
    };

    this.toggleDetails = this.toggleDetails.bind(this);
  }

  toggleDetails() {
    this.setState({ contentAltered: !this.state.contentAltered });
  }

  render() {
    const { order, hasDeletedProducts } = this.props;

    return (
      <div className="subscription-container">
        <SubscriptionGroupHeader orderId={order.id} />
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
              <PaymentInformationBlock orderId={order.id} />
              <OrderProductsBlock orderId={order.id} />
              <UpcomingOrdersBlock orderId={order.id} />
              <OrderDiscountBlock orderId={order.id} />
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
};

const mapStateToProps = (state, ownProps) => ({
  order: state.data.orders.find(order => order.id === ownProps.orderId),
  hasDeletedProducts: state.data.orders.find(o => o.id === ownProps.orderId)
    .order_products.filter(prod => prod.status === 1).length > 0,
});

export default connect(mapStateToProps)(SubscriptionGroup);
