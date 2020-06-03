import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ButtonGroup from './ButtonGroup';
import Button from './Button';
import * as actions from '../../actions';
import { ORDER_PROP_TYPE } from '../../constants/PropTypes';


class StripeAuthenticateCardForm extends Component {
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
      initialized: false,
      processing: false,
    };
    this.handleInitializeCardAuth = this.handleInitializeCardAuth.bind(this);
    this.createTokenHandler = this.createTokenHandler.bind(this);
    this.handleTokenResult = this.handleTokenResult.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    // Preventing infinite loop on tokenHandler due to any other state changes on component
    if (this.props.authenticateCardInitializeData === prevProps.authenticateCardInitializeData
      && this.state.initialized === prevState.initialized
      && this.props.authenticateCardSaveData === prevProps.authenticateCardSaveData) {
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

    if (processing && initialized) {
      return;
    }

    this.setState({
      processing: true,
      initialized: true,
    });

    this.stripeApi
      .handleCardSetup(response.client_secret, { payment_method: response.payment_method })
      .then(result => this.handleTokenResult(result));
  }

  handleTokenResult(result) {
    const { saveCardAuth, onError, orderId } = this.props;
    this.setState({ processing: false });
    // Handle Error
    if (result.error && !(result.error.setup_intent && result.error.setup_intent.status === 'succeeded')) {
      onError(result.error.message);
      return;
    }

    // eslint-disable-next-line max-len
    saveCardAuth(orderId, result.error && result.error.setup_intent
      ? result.error.setup_intent
      : result.setupIntent);
  }

  handleInitializeCardAuth() {
    const {
      order, initializeCardAuth, authenticateCardInitializeLoading, onStart,
    } = this.props;
    const { processing } = this.state;
    if (authenticateCardInitializeLoading || processing) {
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
    const { sdkInitialized, processing } = this.state;
    const isProcessing = authenticateCardSaveLoading
      || authenticateCardInitializeLoading || processing;

    return (
      <React.Fragment>
        <ButtonGroup align="left">
          <Button
            name="reauth_credit_card"
            loading={isProcessing}
            type="submit"
            textKey="reauth_card_button_text"
            disabled={isProcessing}
            onClick={() => sdkInitialized && this.handleInitializeCardAuth()}
          />
        </ButtonGroup>
      </React.Fragment>
    );
  }
}

StripeAuthenticateCardForm.propTypes = {
  order: ORDER_PROP_TYPE.isRequired,
  stripePublishableKey: PropTypes.string.isRequired,
  initializeCardAuth: PropTypes.func.isRequired,
  saveCardAuth: PropTypes.func.isRequired,
  authenticateCardInitializeLoading: PropTypes.bool,
  authenticateCardSaveLoading: PropTypes.bool,
  authenticateCardSaveData: PropTypes.shape({}),
  authenticateCardInitializeData: PropTypes.shape({}),
  onError: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onStart: PropTypes.func.isRequired,
};

StripeAuthenticateCardForm.defaultProps = {
  authenticateCardInitializeLoading: false,
  authenticateCardSaveLoading: false,
  authenticateCardSaveData: {},
  authenticateCardInitializeData: {},
}

const mapStateToProps = (state, ownProps) => {
  const { userInterface, data } = state;
  const order = data.orders.find(o => o.id === ownProps.orderId);
  // eslint-disable-next-line max-len
  const authenticateCardInitializeLoading = userInterface.authenticateCardInitializeLoading[ownProps.orderId] || false;
  // eslint-disable-next-line max-len
  const authenticateCardInitializeData = userInterface.authenticateCardInitializeData[ownProps.orderId] || {};
  // eslint-disable-next-line max-len
  const authenticateCardSaveLoading = userInterface.authenticateCardSaveLoading[ownProps.orderId] || false;
  const authenticateCardSaveData = userInterface.authenticateCardSaveData[ownProps.orderId] || {};
  const stripePublishableKey = state.data.general_settings.gateway_token;

  return {
    order,
    authenticateCardInitializeLoading,
    authenticateCardSaveLoading,
    authenticateCardInitializeData,
    authenticateCardSaveData,
    stripePublishableKey,
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

export default connect(mapStateToProps, mapDispatchToProps)(StripeAuthenticateCardForm);
