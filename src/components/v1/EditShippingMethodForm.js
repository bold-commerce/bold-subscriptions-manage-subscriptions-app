import { connect } from 'react-redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import UpdateOrderShippingMethod from './UpdateOrderShippingMethod';
import Message from './Message';
import Translation from '../Translation';
import * as actions from '../../actions';
import { MESSAGE_PROP_TYPE, ORDER_PROP_TYPE } from '../../constants/PropTypes';

class EditShippingMethodForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false,
    };

    this.enableEditing = this.enableEditing.bind(this);
    this.disableEditing = this.disableEditing.bind(this);
    this.dismissMessage = this.dismissMessage.bind(this);
    this.saveShippingMethod = this.saveShippingMethod.bind(this);
    this.formElement = null;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.shippingMethodMessage) {
      this.setState({
        editing: false,
      });
    }
  }

  saveShippingMethod(shippingMethod) {
    this.props.updateOrderShippingRate(this.props.orderId, shippingMethod);
  }

  enableEditing() {
    this.dismissMessage();
    this.setState({
      editing: true,
    });
  }

  disableEditing() {
    this.setState({
      editing: false,
    });
  }

  dismissMessage() {
    const { order } = this.props;

    this.props.dismissShippingMethodMessage(order.id);
  }

  renderEditButton() {
    const { order } = this.props;

    if (order.has_prepaid) {
      return null;
    }
    return (
      <span
        key="edit-button"
        role="presentation"
        className="text-button"
        onClick={this.enableEditing}
      >
        <Translation textKey="edit_button_text" />
      </span>
    );
  }

  render() {
    const {
      order,
      shippingMethodMessage,
      allowMulticurrencyDisplay,
      disabled,
    } = this.props;

    const exchangeRate = !allowMulticurrencyDisplay ? 1 : order.currency_exchange_rate;
    const currencyFormat = !allowMulticurrencyDisplay ? null : order.currency_format;

    return (
      <div>
        <div className="subscription-details-block">
          <p><Translation textKey="shipping_method" /></p>
          {this.state.editing ?
            <UpdateOrderShippingMethod
              order={order}
              orderId={this.props.orderId}
              cancelOnClick={this.disableEditing}
              saveOnClick={this.saveShippingMethod}
            />
            : (
              <React.Fragment>
                <p dangerouslySetInnerHTML={{
                  __html: UpdateOrderShippingMethod.showShippingSource(
                    order.order_shipping_rate,
                    exchangeRate,
                    currencyFormat,
                    ),
                }}
                />
                {disabled ? null : this.renderEditButton()}
              </React.Fragment>
            )
          }
        </div>
        {shippingMethodMessage ?
          <Message
            key="shipping-address-message"
            title={shippingMethodMessage.message}
            titleTextKey={shippingMethodMessage.messageTextKey}
            type={shippingMethodMessage.type}
            dismissable
            onDismissClick={this.dismissMessage}
          /> : null}
      </div>
    );
  }
}

EditShippingMethodForm.propTypes = {
  orderId: PropTypes.number.isRequired,
  order: ORDER_PROP_TYPE.isRequired,
  updateOrderShippingRate: PropTypes.func.isRequired,
  dismissShippingMethodMessage: PropTypes.func.isRequired,
  shippingMethodMessage: MESSAGE_PROP_TYPE,
  allowMulticurrencyDisplay: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
};

EditShippingMethodForm.defaultProps = {
  shippingMethodMessage: null,
  disabled: false,
};

const mapDispatchToProps = dispatch => ({
  updateOrderShippingRate: (orderId, orderShippingRate) => {
    dispatch(actions.orderUpdateOrderShippingRate(orderId, orderShippingRate));
  },
  dismissShippingMethodMessage: (orderId) => {
    dispatch(actions.dismissShippingMethodMessage(orderId));
  },
});

const mapStateToProps = (state, ownProps) => ({
  order: state.data.orders.find(order => order.id === ownProps.orderId),
  shippingMethodMessage: state.userInterface.shippingMethodMessage[ownProps.orderId],
  allowMulticurrencyDisplay: state.data.general_settings.allow_multicurrency_display,
});

export default connect(mapStateToProps, mapDispatchToProps)(EditShippingMethodForm);
