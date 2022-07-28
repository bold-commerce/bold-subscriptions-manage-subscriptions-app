import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Message from './Message';
import Translation from '../Translation';
// Components
import StripeAuthenticateCardForm from './StripeAuthenticateCardForm';
import * as actions from '../../actions';
import CashierAuthenticateCardForm from '../v2/CashierAuthenticateCardForm';
import BraintreeAuthenticateCardForm from './BraintreeAuthenticateCardForm';

class SubscriptionGroupAuthCreditCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      success: false,
      result: {},
      message: props.authenticateCardInitializeError ?
        {
          type: 'error',
          ...props.authenticateCardInitializeError,
        }
        : {},
    };

    this.handleAuthenticationError = this.handleAuthenticationError.bind(this);
    this.handleAuthenticationSuccess = this.handleAuthenticationSuccess.bind(this);
    this.handleAuthenticationStart = this.handleAuthenticationStart.bind(this);
    this.clearMessages = this.clearMessages.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.authenticateCardInitializeError) {
      this.setState({
        message: {
          type: 'error',
          // eslint-disable-next-line react/prop-types
          children: nextProps.authenticateCardInitializeError.message,
        },
      });
    } else if (nextProps.authenticateCardSaveData) {
      this.handleAuthenticationSuccess(nextProps.authenticateCardSaveData);
    }
  }

  clearMessages() {
    const { finishCardAuthentication, clearCardAuthentication, orderId } = this.props;
    let { result } = this.state;

    if (Object.keys(result).length > 0) {
      finishCardAuthentication(orderId, result);
      result = {};
    } else {
      clearCardAuthentication(orderId);
    }

    this.setState({
      result,
      message: {},
    });
  }

  handleAuthenticationStart() {
    this.clearMessages();
  }

  handleAuthenticationError(text) {
    const { clearCardAuthentication, orderId } = this.props;
    clearCardAuthentication(orderId);
    this.setState({
      success: false,
      message: {
        type: 'error',
        children: text,
      },
    });
  }

  handleAuthenticationSuccess(result) {
    this.setState({
      result,
      success: true,
      message: {
        type: 'success',
        children: (
          <div className="order-product-separator">
            <Translation textKey="reauth_card_success_text" />
          </div>
        ),
      },
    });
  }

  render() {
    const { orderId, gatewayName } = this.props;
    const { success, message } = this.state;
    let cardAuthenticationGateway;

    switch (gatewayName) {
      case 'stripe':
        cardAuthenticationGateway = (<StripeAuthenticateCardForm
          orderId={orderId}
          onStart={this.handleAuthenticationStart}
          onSuccess={this.handleAuthenticationSuccess}
          onError={this.handleAuthenticationError}
        />);
        break;
      case 'cashier':
        cardAuthenticationGateway = (<CashierAuthenticateCardForm
          orderId={orderId}
          onStart={this.handleAuthenticationStart}
          onSuccess={this.handleAuthenticationSuccess}
          onError={this.handleAuthenticationError}
        />);
        break;
      case 'braintree':
        cardAuthenticationGateway = (<BraintreeAuthenticateCardForm
          orderId={orderId}
          onStart={this.handleAuthenticationStart}
          onSuccess={this.handleAuthenticationSuccess}
          onError={this.handleAuthenticationError}
        />);
        break;
      default:
        cardAuthenticationGateway = null;
        break;
    }

    return (
      <div className="subscription-header">
        {success ?
          <Message
            dismissable
            onDismissClick={this.clearMessages}
            fullWidth
            {...message}
          />
          :
          <Message type="warning">
            <h2><Translation textKey="reauth_card_title_text" /></h2>
            <Translation textKey="reauth_card_description_text" />
            <div className="order-product-separator">
              {!message.text && !message.children
                ? <br />
                :
                <Message
                  dismissable
                  onDismissClick={this.clearMessages}
                  {...message}
                />
              }
              {cardAuthenticationGateway}
            </div>
          </Message>
        }
      </div>
    );
  }
}

SubscriptionGroupAuthCreditCard.propTypes = {
  orderId: PropTypes.number.isRequired,
  gatewayName: PropTypes.string.isRequired,
  clearCardAuthentication: PropTypes.func.isRequired,
  finishCardAuthentication: PropTypes.func.isRequired,
  authenticateCardInitializeError: PropTypes.shape({}).isRequired,
  authenticateCardSaveData: PropTypes.shape({}).isRequired,
};

const mapStateToProps = (state, ownProps) => {
  // eslint-disable-next-line max-len
  const { userInterface: { authenticateCardSaveData, authenticateCardInitializeError }, data } = state;
  const gatewayName = data.general_settings.gateway_name;
  return {
    gatewayName,
    authenticateCardInitializeError: authenticateCardInitializeError[ownProps.orderId] || null,
    authenticateCardSaveData: authenticateCardSaveData[ownProps.orderId] || null,
  };
};

const mapDispatchToProps = dispatch => ({
  clearCardAuthentication: (orderId) => {
    dispatch(actions.orderAuthenticateCardClear(orderId));
  },
  finishCardAuthentication: (orderId, result) => {
    dispatch(actions.orderAuthenticateCardSaveClose(orderId, result));
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(SubscriptionGroupAuthCreditCard);
