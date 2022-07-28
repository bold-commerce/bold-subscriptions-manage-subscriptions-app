import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from './Button';
import ButtonGroup from './ButtonGroup';
import Field from './Field';
import Message from './Message';
import { PAYMENT_GATEWAY_STYLES, GATEWAY_INPUT_CLASSNAME, GENERIC_ERROR_MESSAGE, FEATURES } from '../../constants';
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

    if (FEATURES.includes('ro-sca-compatibility')) {
      const { orderTotal } = this.props;
      const allowableStatus = [
        'authentication_unavailable',
        'lookup_bypassed',
        'lookup_not_enrolled',
        'unsupported_card',
      ];
      braintree.client.create({
        authorization: this.props.braintreePublishableKey,
      }).then((clientInstance) => {
        Promise.all([
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
          }),
          braintree.threeDSecure.create({
            version: 2,
            client: clientInstance,
          }),
        ]).then((instances) => {
          const hostedFieldsInstance = instances[0];
          const threeDSecureInstance = instances[1];

          this.setState({
            loading: false,
          });

          this.paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            hostedFieldsInstance.tokenize().then((tokenizePayload) => {
              threeDSecureInstance.on('lookup-complete', (data, next) => {
                next();
              });
              threeDSecureInstance.verifyCard({
                amount: orderTotal > 0 ? orderTotal.toFixed(2) : 0.01, // amount must be > 0
                nonce: tokenizePayload.nonce,
                bin: tokenizePayload.details.bin,
                email: this.props.customerEmail,
                exemptionRequested: false, // Apply for an exemption.
                challengeRequested: true, // Attempt to force the 3DS challenge.
                billingAddress: {
                  givenName: this.props.billingAddress.first_name,
                  surname: this.props.billingAddress.last_name,
                  phoneNumber: this.props.billingAddress.phone,
                  streetAddress: this.props.billingAddress.address1,
                  extendedAddress: this.props.billingAddress.address2,
                  locality: this.props.billingAddress.city,
                  postalCode: this.props.billingAddress.zip,
                  countryCodeName: this.props.billingAddress.country,
                },
                additionalInformation: {
                  shippingGivenName: this.props.shippingAddress.first_name,
                  shippingSurname: this.props.shippingAddress.last_name,
                  shippingPhone: this.props.shippingAddress.phone,
                  shippingAddress: {
                    streetAddress: this.props.shippingAddress.address1,
                    extendedAddress: this.props.shippingAddress.address2,
                    locality: this.props.shippingAddress.city,
                    postalCode: this.props.shippingAddress.zip,
                    countryCodeName: this.props.shippingAddress.country,
                  },
                },
              }).then((verifyCardPayload) => {
                const { threeDSecureInfo } = verifyCardPayload;
                if (threeDSecureInfo.liabilityShiftPossible) {
                  if (threeDSecureInfo.liabilityShifted) {
                    this.props.saveCard(verifyCardPayload.nonce);
                  } else {
                    this.onError({ message: GENERIC_ERROR_MESSAGE });
                  }
                } else if (allowableStatus.includes(threeDSecureInfo.status)) {
                  this.props.saveCard(verifyCardPayload.nonce);
                } else {
                  this.onError({ message: GENERIC_ERROR_MESSAGE });
                }
              }).catch((verifyCardErr) => {
                let verifyError = verifyCardErr;
                if (typeof verifyError.details !== 'undefined' &&
                    typeof verifyError.details.originalError !== 'undefined' &&
                    typeof verifyError.details.originalError.details !== 'undefined' &&
                    typeof verifyError.details.originalError.details.originalError !== 'undefined' &&
                    typeof verifyError.details.originalError.details.originalError.error !== 'undefined'
                ) {
                  verifyError = verifyError.details.originalError.details.originalError.error;
                }
                // We'd still like to have this error log out
                // so it's easier to troublehsoot the SCA errors.
                // eslint-disable-next-line no-console
                console.error(verifyCardErr);
                this.onError(verifyError);
              });
            }).catch((tokenizeErr) => {
              this.onError(tokenizeErr);
            });
          });
        }).catch((instancesErr) => {
          this.onError(instancesErr);
        });
      }).catch((clientErr) => {
        this.onError(clientErr);
      });
    } else {
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
  customerEmail: PropTypes.string.isRequired,
  orderTotal: PropTypes.number.isRequired,
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
