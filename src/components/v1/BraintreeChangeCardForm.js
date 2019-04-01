import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from './Button';
import ButtonGroup from './ButtonGroup';
import Field from './Field';
import Message from './Message';
import { PAYMENT_GATEWAY_STYLES, GATEWAY_INPUT_CLASSNAME } from '../../constants';
import { copyThemeComputedStyles, CSS_PROPERTY_FORMAT } from '../../helpers/paymentGatewayHelpers';

export default class BraintreeChangeCardForm extends Component {
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

    this.onPaymentMethodReceived = this.onPaymentMethodReceived.bind(this);
    this.saveOnClick = this.saveOnClick.bind(this);
    this.onError = this.onError.bind(this);
  }

  componentDidMount() {
    const styles = copyThemeComputedStyles(PAYMENT_GATEWAY_STYLES.theme.input, 'INPUT', CSS_PROPERTY_FORMAT, this.state.customInputClassName || GATEWAY_INPUT_CLASSNAME);

    braintree.client.create({
      authorization: this.props.braintreePublishableKey,
    }, (err, clientInstance) => {
      braintree.hostedFields.create({
        client: clientInstance,
        styles: {
          input: styles,
          '.invalid': {
            color: '#eb1c26',
          },
        },
        fields: {
          number: {
            selector: '#braintree-number-field',
            placeholder: '1234 1234 1234 1234',
          },
          expirationDate: {
            selector: '#braintree-expiration-field',
            placeholder: 'MM / YY',
          },
          cvv: {
            selector: '#braintree-cvv-field',
            placeholder: 'CVC',
          },
        },
      }, (hostedFieldsErr, hostedFieldsInstance) => {
        if (hostedFieldsErr) {
          this.onError(hostedFieldsErr);
          return;
        }

        this.setState({
          loading: false,
        });
        this.paymentForm.addEventListener('submit', (e) => {
          e.preventDefault();
          hostedFieldsInstance.tokenize(this.onPaymentMethodReceived);
        });
      });
    });
  }

  onPaymentMethodReceived(tokenizeErr, payload) {
    if (tokenizeErr) {
      this.onError(tokenizeErr);
      return;
    }
    if (payload && payload.nonce) {
      this.props.saveCard(payload.nonce);
    }
  }

  onError(error) {
    if (error && error.message) {
      this.setState({
        saveInProgress: false,
        errorMessage: error.message,
      });
      return;
    }

    this.setState({
      saveInProgress: false,
    });
  }

  saveOnClick() {
    this.setState({
      saveInProgress: true,
    });
  }

  render() {
    const gatewayInputClass = this.state.customInputClassName ?
      `gateway-input-wrapper ${this.state.customInputClassName} gateway-input--braintree` :
      'gateway-input-wrapper gateway-input--braintree gateway-input--styled';

    const styles = copyThemeComputedStyles(['height'], 'INPUT', CSS_PROPERTY_FORMAT, this.state.customInputClassName || GATEWAY_INPUT_CLASSNAME);
    const gatewayInputHeight = styles.height;

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
          id="braintree-card-form"
          ref={(el) => { this.paymentForm = el; }}
        >
          <div className="gateway-input-container">
            <Field labelTextKey="msp_card_number">
              <div
                className={gatewayInputClass}
                id="braintree-number-field"
                style={({ height: gatewayInputHeight })}
              />
            </Field>
            <Field labelTextKey="expiry_date">
              <div
                className={gatewayInputClass}
                id="braintree-expiration-field"
                style={({ height: gatewayInputHeight })}
              />
            </Field>
            <Field labelTextKey="msp_card_cvc_label">
              <div
                className={gatewayInputClass}
                id="braintree-cvv-field"
                style={({ height: gatewayInputHeight })}
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

BraintreeChangeCardForm.propTypes = {
  braintreePublishableKey: PropTypes.string.isRequired,
  cancelOnClick: PropTypes.func.isRequired,
  saveCard: PropTypes.func.isRequired,
};
