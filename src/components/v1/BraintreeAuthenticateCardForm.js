import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ButtonGroup from '../v1/ButtonGroup';
import Button from '../v1/Button';
import * as actions from '../../actions';
import { ORDER_PROP_TYPE } from '../../constants/PropTypes';
import { GENERIC_ERROR_MESSAGE } from '../../constants';
import orderTotal from '../../helpers/orderHelpers';

class BraintreeAuthenticateCardForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      processing: false,
    };
    this.handleInitializeCardAuth = this.handleInitializeCardAuth.bind(this);
    this.createTokenHandler = this.createTokenHandler.bind(this);
    this.handleTokenResult = this.handleTokenResult.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    // Preventing infinite loop on tokenHandler due to any other state changes on component
    if (this.props.authenticateCardInitializeData === prevProps.authenticateCardInitializeData
      || (this.state.initialized === prevState.initialized
      && this.props.authenticateCardSaveData === prevProps.authenticateCardSaveData)) {
      return;
    }

    // eslint-disable-next-line max-len
    if (Object.keys(this.props.authenticateCardInitializeData).length > 0 && !this.state.initialized) {
      this.createTokenHandler(this.props.authenticateCardInitializeData);
    } else if (Object.keys(this.props.authenticateCardSaveData).length > 0) {
      this.props.onSuccess(this.props.authenticateCardSaveData);
    }
  }

  createTokenHandler(response) {
    const { processing, initialized } = this.state;
    const orderAmount = orderTotal(this.props.order);

    if (processing && initialized) {
      return;
    }
    this.setState({
      processing: true,
      initialized: true,
    });

    braintree.client.create({
      // Use the generated client token to instantiate the Braintree client.
      authorization: this.props.braintreePublishableKey,
    }).then(clientInstance => braintree.threeDSecure.create({
      version: 2,
      client: clientInstance,
    })).then((threeDSecureInstance) => {
      threeDSecureInstance.on('lookup-complete', (data, next) => {
        next();
      });
      threeDSecureInstance.verifyCard({
        amount: orderAmount > 0 ? orderAmount : 0.01, // amount must be > 0
        nonce: response.nonce,
        bin: response.bin,
      }).then((resp) => {
        this.handleTokenResult(resp);
      }).catch((err) => {
        this.handleTokenResult({
          error: err,
          threeDSecureInfo: {},
          status: 'error',
        });
      });
    }).catch(() => {
      this.props.onError(GENERIC_ERROR_MESSAGE);
    });
  }

  handleTokenResult(result) {
    const {
      onError, saveCardAuth, orderId,
    } = this.props;
    const allowableStatus = [
      'authentication_unavailable',
      'lookup_bypassed',
      'lookup_not_enrolled',
      'unsupported_card',
    ];
    this.setState({ processing: false });
    const { threeDSecureInfo } = result;
    if (threeDSecureInfo.liabilityShiftPossible) {
      if (threeDSecureInfo.liabilityShifted) {
        saveCardAuth(orderId, result);
      } else {
        onError(GENERIC_ERROR_MESSAGE);
      }
    } else if (allowableStatus.includes(threeDSecureInfo.status)) {
      saveCardAuth(orderId, result);
    } else {
      onError(GENERIC_ERROR_MESSAGE);
    }
  }

  handleInitializeCardAuth() {
    const {
      order, initializeCardAuth, authenticateCardInitializeLoading, onStart,
    } = this.props;
    if (authenticateCardInitializeLoading) {
      return;
    }
    this.setState({ initialized: false });
    onStart();
    initializeCardAuth(order.id);
  }

  render() {
    const {
      authenticateCardSaveLoading,
      authenticateCardInitializeLoading,
    } = this.props;
    const isProcessing = authenticateCardSaveLoading
      || authenticateCardInitializeLoading;

    return (
      <React.Fragment>
        <ButtonGroup align={this.props.buttonAlignment}>
          <Button
            name="reauth_credit_card"
            loading={isProcessing || this.state.processing}
            type="submit"
            textKey="reauth_card_button_text"
            disabled={isProcessing || this.state.processing}
            onClick={() => this.handleInitializeCardAuth()}
          />
        </ButtonGroup>
      </React.Fragment>
    );
  }
}

BraintreeAuthenticateCardForm.propTypes = {
  orderId: PropTypes.number,
  order: ORDER_PROP_TYPE.isRequired,
  braintreePublishableKey: PropTypes.string.isRequired,
  initializeCardAuth: PropTypes.func.isRequired,
  saveCardAuth: PropTypes.func.isRequired,
  authenticateCardInitializeLoading: PropTypes.bool,
  authenticateCardSaveLoading: PropTypes.bool,
  authenticateCardSaveData: PropTypes.shape({}),
  authenticateCardInitializeData: PropTypes.shape({}),
  onError: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onStart: PropTypes.func.isRequired,
  buttonAlignment: PropTypes.string,
};

BraintreeAuthenticateCardForm.defaultProps = {
  orderId: null,
  authenticateCardInitializeLoading: false,
  authenticateCardSaveLoading: false,
  authenticateCardSaveData: {},
  authenticateCardInitializeData: {},
  buttonAlignment: 'left',
};

const mapStateToProps = (state, ownProps) => {
  const { userInterface, data } = state;
  const order = data.orders.find(o => o.id === ownProps.orderId);
  const alignment = data.buttonAlignment;
  // eslint-disable-next-line max-len
  const authenticateCardInitializeLoading = userInterface.authenticateCardInitializeLoading[ownProps.orderId] || false;
  // eslint-disable-next-line max-len
  const authenticateCardInitializeData = userInterface.authenticateCardInitializeData[ownProps.orderId] || {};
  // eslint-disable-next-line max-len
  const authenticateCardSaveLoading = userInterface.authenticateCardSaveLoading[ownProps.orderId] || false;
  const authenticateCardSaveData = userInterface.authenticateCardSaveData[ownProps.orderId] || {};
  const braintreePublishableKey = state.data.general_settings.gateway_token;

  return {
    order,
    authenticateCardInitializeLoading,
    authenticateCardSaveLoading,
    authenticateCardInitializeData,
    authenticateCardSaveData,
    braintreePublishableKey,
    alignment,
  };
};

const mapDispatchToProps = dispatch => ({
  initializeCardAuth: (orderId) => {
    dispatch(actions.orderAuthenticateCardInitialize(orderId));
  },
  saveCardAuth: (orderId, result) => {
    dispatch(actions.orderAuthenticateCardSave(orderId, result));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(BraintreeAuthenticateCardForm);
