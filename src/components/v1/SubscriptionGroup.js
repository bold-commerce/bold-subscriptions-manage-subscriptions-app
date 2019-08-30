import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';

import SubscriptionGroupHeader from './SubscriptionGroupHeader';
import Translation from '../Translation';
import SubscriptionDetails from './subscription';
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
              <SubscriptionDetails orderId={order.id} cancellable={order.is_cancellable} />
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
