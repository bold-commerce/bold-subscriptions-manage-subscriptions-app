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
import V2CashierChangeCardForm from '../v2/CashierChangeCardForm';
import { MESSAGE_PROP_TYPE, ORDER_PROP_TYPE } from '../../constants/PropTypes';
import CardInformationBlock from './CardInformationBlock';
import orderTotal from '../../helpers/orderHelpers';

class PaymentInformationBlock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false,
      saving: false,
      showCloseButton: false,
      mode: null,
    };

    this.toggleEditing = this.toggleEditing.bind(this);
    this.updateCard = this.updateCard.bind(this);
    this.dismissMessage = this.dismissMessage.bind(this);
    this.setVisibility = this.setVisibility.bind(this);
    this.setBlockMode = this.setBlockMode.bind(this);
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
      setBlockMode: this.setBlockMode,
      saving: this.state.saving,
      editing: this.state.editing,
      blockMode: this.state.mode,
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
        paymentGatewayForm = (<V2CashierChangeCardForm
          {...baseProps}
        />);
        break;
      case 'braintree':
        paymentGatewayForm = (
          <BraintreeChangeCardForm
            {...baseProps}
            customerEmail={customerEmail}
            shippingAddress={shippingAddress}
            orderTotal={orderTotal(order)}
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

  setBlockMode(mode) {
    let changes = {};

    switch (mode) {
      case 'editing':
        changes = { editing: true, saving: false, showCloseButton: false };
        break;
      case 'iframe':
        this.dismissMessage();
        changes = { editing: true, saving: false, showCloseButton: true };
        break;
      case 'saving':
        this.dismissMessage();
        changes = { editing: true, saving: true, showCloseButton: false };
        break;
      default: {
        const editing = this.props.gatewayName === 'cashier' || false;
        changes = {
          editing,
          saving: false,
          showCloseButton: false,
        };
      }
    }

    this.setState({ mode, ...changes });
  }

  setVisibility(editing) {
    this.setBlockMode(editing ? 'editing' : null);
  }

  updateCard(paymentToken) {
    this.props.updateCard(this.props.orderId, paymentToken);
  }

  toggleEditing() {
    const editing = this.props.gatewayName === 'cashier' || !this.state.editing;
    this.setState({ editing });
    this.setVisibility(editing);

    if (!this.state.editing) {
      this.dismissMessage();
    }
  }

  dismissMessage() {
    this.props.dismissCardMessage(this.props.orderId);
  }

  render() {
    const { order } = this.props;
    const { editing, saving } = this.state;
    const hasCardError = order.credit_card && order.credit_card.error;
    let body = <p><Translation textKey="credit_card_loading" /></p>;
    let blockProps;

    if ((editing || saving)) {
      body = this.getGatewayChangeCardForm();
    } else {
      body = (
        <CardInformationBlock
          card={order.credit_card}
          gateway={this.props.gatewayName}
          withLabels
        />
      );
    }

    if (this.props.gatewayName === 'cashier') {
      const showEditTitle = this.state.showCloseButton;

      blockProps = {
        showEditTitle,
        editTitleIcon: 'X',
      };
    } else {
      const editTitleTranslationKey = hasCardError && !(this.props.gatewayName === 'cashier') ? 'msp_update_card_text' : 'edit_button_text';
      const showEditTitle = (!saving && !editing);

      blockProps = {
        showEditTitle,
        editTitleTranslationKey,
      };
    }

    return (
      <SubscriptionContentBlock
        titleTranslationKey="payment_information_title"
        editOnClick={this.toggleEditing}
        toggleVisibility={this.setVisibility}
        className={this.state.mode}
        {...blockProps}
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
  status: PropTypes.number.isRequired,
  saving: PropTypes.bool.isRequired,
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
