import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from './Button';
import Input from './Input';
import ButtonGroup from './ButtonGroup';
import Field from './Field';
import Message from './Message';
import { GATEWAY_INPUT_CLASSNAME, PAYMENT_GATEWAY_STYLES } from '../../constants';
import {
  copyThemeComputedStyles,
  CSS_PROPERTY_FORMAT,
  JS_PROPERTY_FORMAT,
} from '../../helpers/paymentGatewayHelpers';

const DEFAULT_INPUT_STYLES = {
  'font-family': 'Arial, Helvetica, sans-serif',
  '-webkit-font-smoothing': 'auto',
  position: 'absolute',
  left: '0px',
  top: '50%',
  width: '100%',
  transform: 'translateY(-50%)',
}; // spreedly only

export default class SpreedlyChangeCardForm extends Component {
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
      requiredThemeStyles: undefined,
    };

    this.onPaymentMethodReceived = this.onPaymentMethodReceived.bind(this);
    this.submitPaymentForm = this.submitPaymentForm.bind(this);
    this.onErrors = this.onErrors.bind(this);
    this.onFieldEvent = this.onFieldEvent.bind(this);
    this.saveOnClick = this.saveOnClick.bind(this);
  }

  componentWillMount() {
    const styles = copyThemeComputedStyles(['height', 'fontSize'], 'INPUT', JS_PROPERTY_FORMAT, this.state.customInputClassName || GATEWAY_INPUT_CLASSNAME);
    this.setState({
      requiredThemeStyles: styles,
    });
  }

  componentDidMount() {
    let styles = copyThemeComputedStyles(PAYMENT_GATEWAY_STYLES.theme.input, 'INPUT', CSS_PROPERTY_FORMAT, this.state.customInputClassName || GATEWAY_INPUT_CLASSNAME);

    // format styles for spreedly
    styles = { ...styles, ...DEFAULT_INPUT_STYLES };
    styles = Object.keys(styles).reduce((p, c) => `${p}${c}: ${c === 'height' ? 'auto' : styles[c]};`, '');

    Spreedly.removeHandlers();
    Spreedly.on('paymentMethod', this.onPaymentMethodReceived);
    Spreedly.on('errors', this.onErrors);
    Spreedly.on('fieldEvent', this.onFieldEvent);
    Spreedly.init(this.props.spreedlyPublishableKey, {
      numberEl: 'spreedly-number',
      cvvEl: 'spreedly-cvv',
    });
    Spreedly.on('ready', () => {
      // set labels and placeholders for accessibility
      Spreedly.setPlaceholder('number', '1234 1234 1234 1234');
      Spreedly.setPlaceholder('cvv', 'CVC');
      Spreedly.setLabel('number', '1234 1234 1234 1234');
      Spreedly.setLabel('cvv', 'CVC');
      Spreedly.setStyle('number', styles);
      Spreedly.setStyle('cvv', styles);
      Spreedly.setFieldType('number', 'text');
      Spreedly.setNumberFormat('prettyFormat');
      this.setState({
        loading: false,
      });
    });
  }

  onErrors(errors) {
    let errorMessage = '';
    for (let i = 0; i < errors.length; i += 1) {
      const error = errors[i];
      errorMessage += `${error.message}${i < errors.length - 1 ? '<br />' : ''}`;
    }

    if (errorMessage !== '') {
      this.setState({
        saveInProgress: false,
        errorMessage,
      });
      return;
    }

    this.setState({
      saveInProgress: false,
    });
  }

  onFieldEvent(name, type, activeEl, inputProperties) {
    let field = this.numberInputWrapper;
    if (name === 'cvv') {
      field = this.cvvInputWrapper;
    }
    switch (type) {
      case 'focus':
        if (!this.customInputClassName) {
          field.classList.add('SpreedlyElement--focus');
        }
        break;
      case 'blur':
        if (!this.customInputClassName) {
          field.classList.remove('SpreedlyElement--focus');
        }
        break;
      case 'type':
        if (!inputProperties.numberValid) {
          field.classList.add('SpreedlyElement--invalid');
        } else {
          field.classList.remove('SpreedlyElement--invalid');
        }
        break;
      default:
        break;
    }
  }

  onPaymentMethodReceived(token) {
    this.props.saveCard(token);
  }

  submitPaymentForm(e) {
    e.preventDefault();
    const options = {};

    options.month = document.getElementById('spreedly-month-input').value;
    options.year = document.getElementById('spreedly-year-input').value;

    options.first_name = this.props.billingAddress.first_name;
    options.last_name = this.props.billingAddress.last_name;
    options.full_name = `${options.first_name} ${options.last_name}`;
    options.email = this.props.customerEmail;
    options.address1 = this.props.billingAddress.address1;
    options.address2 = this.props.billingAddress.address2;
    options.city = this.props.billingAddress.city;
    options.state = this.props.billingAddress.province;
    options.zip = this.props.billingAddress.zip;
    options.country = this.props.billingAddress.country;
    options.phone_number = this.props.billingAddress.phone;

    options.shipping_address1 = this.props.shippingAddress.address1;
    options.shipping_address2 = this.props.shippingAddress.address2;
    options.shipping_city = this.props.shippingAddress.city;
    options.shipping_state = this.props.shippingAddress.province;
    options.shipping_zip = this.props.shippingAddress.zip;
    options.shipping_country = this.props.shippingAddress.country;
    options.shipping_phone_number = this.props.shippingAddress.phone;

    Spreedly.tokenizeCreditCard(options);
  }

  saveOnClick() {
    this.setState({
      saveInProgress: true,
    });
  }

  render() {
    const gatewayInputClass = this.state.customInputClassName ?
      `gateway-input-wrapper ${this.state.customInputClassName} gateway-input--spreedly` :
      'gateway-input-wrapper gateway-input--spreedly gateway-input--styled';

    const gatewayInputHeight = this.state.requiredThemeStyles.height;
    const themeInputStyles = {
      fontFamily: DEFAULT_INPUT_STYLES['font-family'],
      WebkitFontSmoothing: DEFAULT_INPUT_STYLES['-webkit-font-smoothing'],
      fontSize: this.state.requiredThemeStyles.fontSize,
    };

    return (
      <React.Fragment>
        {this.state.errorMessage ? <Message type="error">{this.state.errorMessage}</Message> : null}
        {
          this.state.loading ?
            <span className="subscription-loading-icon" /> : null
        }
        <form
          action="/"
          method="post"
          className="msp__payment-gateway-form"
          id="spreedly-card-form"
          onSubmit={this.submitPaymentForm}
        >
          <input type="hidden" name="payment_method_token" id="payment_method_token" />
          <div className="gateway-input-container">
            <Field labelTextKey="msp_card_number">
              <div
                className={gatewayInputClass}
                id="spreedly-number"
                style={({ height: gatewayInputHeight })}
                ref={(el) => { this.numberInputWrapper = el; }}
              />
            </Field>
            <Field labelTextKey="msp_expiration_month">
              <div>
                <Input
                  className={gatewayInputClass}
                  id="spreedly-month-input"
                  placeholder="MM"
                  style={themeInputStyles}
                  maxLength={2}
                />
              </div>
            </Field>
            <Field labelTextKey="msp_expiration_year">
              <div>
                <Input
                  className={gatewayInputClass}
                  id="spreedly-year-input"
                  placeholder="YYYY"
                  style={themeInputStyles}
                  maxLength={4}
                />
              </div>
            </Field>
            <Field labelTextKey="msp_card_cvc_label">
              <div
                className={gatewayInputClass}
                id="spreedly-cvv"
                style={({ height: gatewayInputHeight })}
                ref={(el) => { this.cvvInputWrapper = el; }}
              />
            </Field>
          </div>
          <ButtonGroup>
            <Button
              onClick={this.saveOnClick}
              loading={this.state.saveInProgress}
              textKey="save_button_text"
              type="submit"
            />
            <Button
              btnStyle="secondary"
              textKey="cancel_button_text"
              onClick={this.props.cancelOnClick}
            />
          </ButtonGroup>
        </form>
      </React.Fragment>
    );
  }
}

SpreedlyChangeCardForm.propTypes = {
  spreedlyPublishableKey: PropTypes.string.isRequired,
  cancelOnClick: PropTypes.func.isRequired,
  saveCard: PropTypes.func.isRequired,
  customerEmail: PropTypes.string.isRequired,
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
  shippingAddress: PropTypes.shape({
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

SpreedlyChangeCardForm.defaultValues = {
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
  shippingAddress: {
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
