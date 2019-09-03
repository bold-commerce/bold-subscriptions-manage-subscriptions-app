import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import OrderProduct from './OrderProduct';
import Message from './Message';
import { ORDER_PROP_TYPE, MESSAGE_PROP_TYPE } from '../../constants/PropTypes';

class OrderProducts extends Component {
  constructor(props) {
    super(props);

    this.toggleSwapOnClick = this.toggleSwapOnClick.bind(this);
    this.dismissMessage = this.dismissMessage.bind(this);
  }

  toggleSwapOnClick(productId, groupId) {
    this.props.toggleSwap(this.props.order.id, productId, groupId);
  }

  dismissMessage() {
    const { order } = this.props;

    this.props.dismissGetShippingRatesFailedMessage(order.id);
  }

  render() {
    const { order } = this.props;

    return (
      <div className="order-products">
        {
          this.props.getShippingRatesFailedMessage &&
          this.props.getShippingRatesFailedMessage.message ?
            <Message
              key="shipping-rates-message"
              title={this.props.getShippingRatesFailedMessage.message}
              titleTextKey={this.props.getShippingRatesFailedMessage.messageTextKey}
              type={this.props.getShippingRatesFailedMessage.type}
              dismissable
              onDismissClick={this.dismissMessage}
            />
            : null
        }
        {
          order.order_products.map(d => (
            <OrderProduct
              key={`${order.id}-prod-${d.id}`}
              toggleSwap={this.props.toggleSwap}
              productId={d.id}
              orderId={order.id}
            />
        ))}
      </div>
    );
  }
}

OrderProducts.propTypes = {
  order: ORDER_PROP_TYPE.isRequired,
  toggleSwap: PropTypes.func,
  dismissGetShippingRatesFailedMessage: PropTypes.func.isRequired,
  getShippingRatesFailedMessage: MESSAGE_PROP_TYPE,
};

OrderProducts.defaultProps = {
  toggleSwap: null,
  getShippingRatesFailedMessage: null,
};

const mapStateToProps = (state, ownProps) => ({
  order: state.data.orders.find(order => order.id === ownProps.orderId),
  getShippingRatesFailedMessage:
    state.userInterface.getShippingRatesFailedMessage[ownProps.orderId],
});

const mapDispatchToProps = dispatch => ({
  dismissGetShippingRatesFailedMessage: (orderId) => {
    dispatch(actions.dismissGetShippingRatesFailedMessage(orderId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderProducts);
