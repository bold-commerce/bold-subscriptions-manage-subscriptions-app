import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import Translation from '../Translation';
import Message from './Message';
import SubscriptionContentBlock from './SubscriptionContentBlock';
import StripeChangeCardForm from './StripeChangeCardForm';
import BraintreeChangeCardForm from './BraintreeChangeCardForm';
import SpreedlyChangeCardForm from './SpreedlyChangeCardForm';
import CashierChangeCardForm from './CashierChangeCardForm';
import { MESSAGE_PROP_TYPE, ORDER_PROP_TYPE } from '../../constants/PropTypes';
import CardInformationBlock from './CardInformationBlock';

class PaymentInformationBlock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false,
    };

    this.toggleEditing = this.toggleEditing.bind(this);
    this.updateCard = this.updateCard.bind(this);
    this.dismissMessage = this.dismissMessage.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.editing && nextProps.updateCardMessage) {
      this.toggleEditing();
    }
  }

  getGatewayChangeCardForm() {
    const { order } = this.props;
    const billingAddress = {
      first_name: order.billing_first_name || '',
      last_name: order.billing_last_name || '',
      address1: order.billing_address1 || '',
      address2: order.billing_address2 || '',
      city: order.billing_city || '',
      country: order.billing_country || '',
      province: order.billing_province || '',
      zip: order.billing_zip || '',
      phone: order.billing_phone || '',
    };
    const shippingAddress = {
      first_name: order.first_name || '',
      last_name: order.last_name || '',
      address1: order.address1 || '',
      address2: order.address2 || '',
      city: order.city || '',
      country: order.country || '',
      province: order.province || '',
      zip: order.zip || '',
      phone: order.phone || '',
    };
    const customerEmail = order.customer_email;
    let paymentGatewayForm = null;

    const baseProps = {
      saveCard: this.updateCard,
      cancelOnClick: this.toggleEditing,
      orderId: this.props.orderId,
      billingAddress,
    };

    switch (this.props.gatewayName) {
      case 'stripe':
        paymentGatewayForm = (
          <StripeChangeCardForm
            {...baseProps}
            stripePublishableKey={this.props.gatewayToken}
          />
        );
        break;
      case 'cashier':
        paymentGatewayForm = (
          <CashierChangeCardForm
            {...baseProps}
          />
        );
        break;
      case 'braintree':
        paymentGatewayForm = (
          <BraintreeChangeCardForm
            {...baseProps}
            braintreePublishableKey={this.props.gatewayToken}
          />
        );
        break;
      case 'spreedly':
        paymentGatewayForm = (
          <SpreedlyChangeCardForm
            {...baseProps}
            customerEmail={customerEmail}
            shippingAddress={shippingAddress}
            spreedlyPublishableKey={this.props.gatewayToken}
          />
        );
        break;
      default:
        return null;
    }

    return (
      <div className="msp__payment-gateway-container">
        {paymentGatewayForm}
      </div>
    );
  }

  updateCard(paymentToken) {
    this.props.updateCard(this.props.orderId, paymentToken);
  }

  toggleEditing() {
    this.setState({ editing: !this.state.editing });

    if (!this.state.editing) {
      this.dismissMessage();
    }
  }

  dismissMessage() {
    this.props.dismissCardMessage(this.props.orderId);
  }

  renderEditButton() {
    return (
      <div>
        <span role="presentation" className="text-button" onClick={this.toggleEditing}>
          <Translation textKey="edit_button_text" />
        </span>
      </div>
    );
  }

  render() {
    const { order } = this.props;

    let body = <p><Translation textKey="credit_card_loading" /></p>;

    if (this.state.editing) {
      body = this.getGatewayChangeCardForm();
    } else {
      body = (
        <React.Fragment>
          <CardInformationBlock card={order.credit_card} withLabels />
          {this.renderEditButton()}
        </React.Fragment>
      );
    }

    const hasCardError = order.credit_card && order.credit_card.error;

    return (
      <SubscriptionContentBlock
        titleTranslationKey="payment_information_title"
        editTitleTranslationKey={hasCardError ? 'msp_update_card_text' : 'edit_button_text'}
        showEditTitle={!(hasCardError && this.props.gatewayName === 'cashier')}
        editOnClick={this.toggleEditing}
      >
        {
          this.props.updateCardMessage ?
            <Message
              key="billing-address-message"
              title={this.props.updateCardMessage.message}
              titleTextKey={this.props.updateCardMessage.messageTextKey}
              type={this.props.updateCardMessage.type}
              dismissable
              onDismissClick={this.dismissMessage}
            />
            : null
        }
        {body}
      </SubscriptionContentBlock>
    );
  }
}

PaymentInformationBlock.propTypes = {
  order: ORDER_PROP_TYPE.isRequired,
  gatewayName: PropTypes.string.isRequired,
  gatewayToken: PropTypes.string.isRequired,
  updateCard: PropTypes.func.isRequired,
  orderId: PropTypes.number.isRequired,
  updateCardMessage: MESSAGE_PROP_TYPE,
  dismissCardMessage: PropTypes.func.isRequired,
};

PaymentInformationBlock.defaultProps = {
  updateCardMessage: null,
};

const mapStateToProps = (state, ownProps) => ({
  order: state.data.orders.find(order => order.id === ownProps.orderId),
  updateCardMessage: state.userInterface.updateCardMessages[ownProps.orderId],
  gatewayName: state.data.general_settings.gateway_name,
  gatewayToken: state.data.general_settings.gateway_token,
});

const mapDispatchToProps = dispatch => ({
  updateCard: (orderId, token, expiryMonth, expiryYear, lastFour) => {
    dispatch(actions.orderUpdateCard(orderId, token, expiryMonth, expiryYear, lastFour));
  },
  dismissCardMessage: (orderId) => {
    dispatch(actions.dismissCardMessage(orderId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PaymentInformationBlock);
