import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ButtonGroup from './ButtonGroup';
import Button from './Button';
import Field from './Field';
import Message from './Message';
import { PAYMENT_GATEWAY_STYLES, GATEWAY_INPUT_CLASSNAME } from '../../constants';
import { copyThemeComputedStyles, JS_PROPERTY_FORMAT } from '../../helpers/paymentGatewayHelpers';

export default class StripeChangeCardForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      saveInProgress: false,
      customInputClassName:
      window
        .manageSubscription
        .displaySettings
        .input_classname || null,
    };

    this.stripeApi = Stripe(props.stripePublishableKey);

    this.saveOnClick = this.saveOnClick.bind(this);
    this.createTokenHandler = this.createTokenHandler.bind(this);
  }

  componentDidMount() {
    const styles = copyThemeComputedStyles(PAYMENT_GATEWAY_STYLES.theme.input, 'INPUT', JS_PROPERTY_FORMAT, this.state.customInputClassName || GATEWAY_INPUT_CLASSNAME);
    const options = {
      style: {
        base: styles,
      },
    };

    const elements = this.stripeApi.elements();
    this.stripeCardNumber = elements.create('cardNumber', options);
    this.stripeCardExpiry = elements.create('cardExpiry', options);
    this.stripeCardCVC = elements.create('cardCvc', options);

    this.stripeCardNumber.mount(this.stripeCardNumberMountElement);
    this.stripeCardExpiry.mount(this.stripeCardExpiryMountElement);
    this.stripeCardCVC.mount(this.stripeCardCVCMountElement);

    this.stripeCardCVC.on('ready', () => {
      this.setState({
        loading: false,
      });
    });
  }

  createTokenHandler(response) {
    if (response.error) {
      this.setState({
        saveInProgress: false,
        errorMessage: response.error.message,
      });
      return;
    }

    this.props.saveCard(response.token.id);
  }

  saveOnClick() {
    this.setState({
      saveInProgress: true,
    });

    this.stripeApi.createToken(
      this.stripeCardNumber,
      {
        address_line1: this.props.billingAddress.address1,
        address_line2: this.props.billingAddress.address2,
        address_city: this.props.billingAddress.city,
        address_state: this.props.billingAddress.province,
        address_zip: this.props.billingAddress.zip,
        address_country: this.props.billingAddress.country,
      },
    ).then(this.createTokenHandler);
  }

  render() {
    const gatewayInputClass = this.state.customInputClassName ?
      `gateway-input-wrapper ${this.state.customInputClassName}` :
      'gateway-input-wrapper gateway-input--styled';

    return (
      <React.Fragment>
        {this.state.loading ? <span className="subscription-loading-icon" /> : null}
        <div className="msp__payment-gateway-form">
          <div className="gateway-input-container">
            {
              this.state.errorMessage ?
                <Message type="error">{this.state.errorMessage}</Message> :
                null
            }
            <Field labelTextKey="msp_card_number">
              <div
                className={gatewayInputClass}
                ref={(el) => { this.stripeCardNumberMountElement = el; }}
              />
            </Field>
            <Field labelTextKey="expiry_date">
              <div
                className={gatewayInputClass}
                ref={(el) => { this.stripeCardExpiryMountElement = el; }}
              />
            </Field>
            <Field labelTextKey="msp_card_cvc_label">
              <div
                className={gatewayInputClass}
                ref={(el) => { this.stripeCardCVCMountElement = el; }}
              />
            </Field>
          </div>
          <ButtonGroup>
            <Button
              textKey="save_button_text"
              onClick={this.saveOnClick}
              loading={this.state.saveInProgress}
            />
            <Button
              textKey="cancel_button_text"
              onClick={this.props.cancelOnClick}
              btnStyle="secondary"
            />
          </ButtonGroup>
        </div>
      </React.Fragment>
    );
  }
}

StripeChangeCardForm.propTypes = {
  stripePublishableKey: PropTypes.string.isRequired,
  cancelOnClick: PropTypes.func.isRequired,
  saveCard: PropTypes.func.isRequired,
  billingAddress: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    address1: PropTypes.string,
    address2: PropTypes.string,
    city: PropTypes.string,
    province: PropTypes.string,
    zip: PropTypes.string,
    country: PropTypes.string,
    phone: PropTypes.string,
  }).isRequired,
};

StripeChangeCardForm.defaultValues = {
  billingAddress: {
    first_name: '',
    last_name: '',
    address1: '',
    address2: '',
    city: '',
    province: '',
    zip: '',
    country: '',
    phone: '',
  },
};
