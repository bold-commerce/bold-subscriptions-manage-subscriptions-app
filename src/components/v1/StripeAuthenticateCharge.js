import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import ButtonGroup from './ButtonGroup';
import Button from './Button';


class StripeAuthenticateCharge extends Component {
  constructor(props) {
    super(props);

    let sdkInitialized = true;

    try {
      this.stripeApi = Stripe(props.stripePublishableKey);
    } catch (e) {
      sdkInitialized = false;
    }

    this.state = {
      sdkInitialized,
      processing: false,
    };

    this.handleConfirmCardResult = this.handleConfirmCardResult.bind(this);
    this.handleAuthenticateCharge = this.handleAuthenticateCharge.bind(this);
  }

  handleAuthenticateCharge() {
    const { processing } = this.state;

    if (processing) {
      return;
    }

    this.setState({
      processing: true,
    });

    this.stripeApi
      .confirmCardPayment(this.props.productSwapMessages.token,
        { payment_method: this.props.productSwapMessages.paymentMethod })
      .then(result => this.handleConfirmCardResult(result));
  }

  handleConfirmCardResult(result) {
    if (result.paymentIntent.status === 'succeeded') {
      this.setState({
        processing: false,
      });
      // actually save the swap.
      this.props.onAuthSuccess(result.paymentIntent.id);
    }
  }

  render() {
    const { sdkInitialized, processing } = this.state;

    return (
      <div className="align-right">
        <ButtonGroup >
          <Button
            name="reauth_credit_card"
            loading={processing}
            type="submit"
            textKey="reauth_card_button_text"
            disabled={processing}
            onClick={() => sdkInitialized && this.handleAuthenticateCharge()}
          />
        </ButtonGroup>
      </div>
    );
  }
}


StripeAuthenticateCharge.propTypes = {
  stripePublishableKey: PropTypes.string.isRequired,
  productSwapMessages: PropTypes.string,
  onAuthSuccess: PropTypes.func.isRequired,
};

StripeAuthenticateCharge.defaultProps = {
  productSwapMessages: null,
};

const mapStateToProps = (state, ownProps) => {
  const { userInterface, data } = state;
  const order = data.orders.find(o => o.id === ownProps.orderId);
  const productSwapMessages = userInterface.productSwapMessages[ownProps.orderId];
  const stripePublishableKey = state.data.general_settings.gateway_token;

  return {
    order,
    productSwapMessages,
    stripePublishableKey,
  };
};

export default connect(mapStateToProps)(StripeAuthenticateCharge);
