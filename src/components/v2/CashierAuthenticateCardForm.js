import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import ButtonGroup from '../v1/ButtonGroup';
import Button from '../v1/Button';
import * as actions from '../../actions';
import { ORDER_PROP_TYPE } from '../../constants/PropTypes';

class CashierAuthenticateCardForm extends Component {
  static buildCashierAuthenticationURL(authenticationPublicKey) {
    const {
      manageSubscription: { cashierURL },
      location: { hostname },
    } = window;
    const baseUrl = [
      cashierURL,
      'payment-method-authentication',
      'shopify',
      hostname,
      'get',
      authenticationPublicKey,
    ].join('/');
    return `${baseUrl}?auto_trigger=1`;
  }

  constructor(props) {
    super(props);

    this.iframe = null;
    this.setIframe = (element) => {
      this.iframe = element;
    };

    this.state = {
      processing: false,
    };
    this.handleInitializeCardAuth = this.handleInitializeCardAuth.bind(this);
    this.renderIframe = this.renderIframe.bind(this);
    this.cancel = this.cancel.bind(this);
    this.handleTokenResult = this.handleTokenResult.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.authenticateCardInitializeError) {
      this.setState({
        processing: false,
      });
    }
  }

  handleTokenResult(result) {
    const { saveCardAuth, onError, order } = this.props;
    this.setState({ processing: false });
    // Handle Error
    if (result.error) {
      onError(result.error.message);
      return;
    }

    saveCardAuth(order.id, result);
  }

  handleInitializeCardAuth() {
    const {
      order, initializeCardAuth, authenticateCardInitializeLoading, onStart,
    } = this.props;
    const { processing } = this.state;
    if (authenticateCardInitializeLoading || processing) {
      return;
    }

    this.setState({ processing: true });
    onStart();
    initializeCardAuth(order.id);
  }

  cancel() {
    this.setState({ processing: false });
  }

  renderIframe() {
    // eslint-disable-next-line camelcase
    const { authenticateCardInitializeData: { authentication_public_key, status } } = this.props;

    if (status && status === 'done') {
      return this.handleTokenResult({ success: true });
    }


    window.addEventListener('message', (e) => {
      if (!this.iframe || !(e.origin === window.manageSubscription.cashierURL && e.data && typeof e.data === 'object')
          || (e.origin === window.manageSubscription.cashierURL && e.data && e.data.message && e.data.message === 'Iframe height updated')
      ) {
        return;
      }

      const result = { success: e.data.success, error: null, message: null };

      if (!e.data.success) {
        result.error = { message: e.data.message };
      } else {
        result.message = e.data.message || '';
      }

      this.handleTokenResult(result);
    });

    return (
      <Modal
        isOpen={this.state.processing}
        onRequestClose={this.cancel}
        className="bold-msp-modal"
        overlayClassName="bold-msp-modal-overlay"
        shouldCloseOnEsc={false}
        shouldCloseOnOverlayClick={false}
        closeTimeoutMS={0}
      >
        <button className="bold-msp-modal-close" onClick={this.cancel}>&times;</button>
        <iframe
          className="cashier-card-iframe-2"
          title="cashier-edit-card"
          src={CashierAuthenticateCardForm.buildCashierAuthenticationURL(authentication_public_key)}
          allowFullScreen
          ref={this.setIframe}
        />
      </Modal>
    );
  }

  render() {
    const {
      authenticateCardSaveLoading,
      authenticateCardInitializeLoading,
      authenticateCardInitializeData,
      authenticateCardInitializeError,
    } = this.props;
    const { processing } = this.state;
    // eslint-disable-next-line max-len
    const isProcessing = (authenticateCardSaveLoading || authenticateCardInitializeLoading || processing)
     && !authenticateCardInitializeError;

    return (
      <React.Fragment>
        <ButtonGroup align="left">
          <Button
            name="reauth_credit_card"
            loading={isProcessing}
            type="submit"
            textKey="reauth_card_button_text"
            disabled={isProcessing}
            onClick={() => this.handleInitializeCardAuth()}
          />
        </ButtonGroup>
        {processing
        // eslint-disable-next-line max-len
        && (authenticateCardInitializeData && authenticateCardInitializeData.authentication_public_key)
        && this.renderIframe()}
      </React.Fragment>
    );
  }
}

CashierAuthenticateCardForm.propTypes = {
  order: ORDER_PROP_TYPE.isRequired,
  initializeCardAuth: PropTypes.func.isRequired,
  saveCardAuth: PropTypes.func.isRequired,
  authenticateCardInitializeLoading: PropTypes.bool,
  authenticateCardSaveLoading: PropTypes.bool,
  authenticateCardSaveData: PropTypes.shape({}),
  authenticateCardInitializeData: PropTypes.shape({
    authentication_public_key: PropTypes.string,
    status: PropTypes.string,
  }),
  authenticateCardInitializeError: PropTypes.shape({}),
  onError: PropTypes.func.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  onSuccess: PropTypes.func.isRequired,
  onStart: PropTypes.func.isRequired,
};

CashierAuthenticateCardForm.defaultProps = {
  authenticateCardInitializeLoading: false,
  authenticateCardSaveLoading: false,
  authenticateCardSaveData: { authentication_public_key: null },
  authenticateCardInitializeData: null,
  authenticateCardInitializeError: null,
};

const mapStateToProps = (state, ownProps) => {
  const { userInterface, data } = state;
  const order = data.orders.find(o => o.id === ownProps.orderId);
  // eslint-disable-next-line max-len
  const authenticateCardInitializeLoading = userInterface.authenticateCardInitializeLoading[ownProps.orderId] || false;
  // eslint-disable-next-line max-len
  const authenticateCardInitializeData = userInterface.authenticateCardInitializeData[ownProps.orderId] || { authentication_public_key: null, status: null };
  // eslint-disable-next-line max-len
  const authenticateCardSaveLoading = userInterface.authenticateCardSaveLoading[ownProps.orderId] || false;
  const authenticateCardSaveData = userInterface.authenticateCardSaveData[ownProps.orderId] || {};
  // eslint-disable-next-line max-len
  const authenticateCardInitializeError = userInterface.authenticateCardInitializeError[ownProps.orderId] || null;
  const cashierAuthenticationKey = null;

  return {
    order,
    authenticateCardInitializeLoading,
    authenticateCardSaveLoading,
    authenticateCardInitializeData,
    authenticateCardInitializeError,
    authenticateCardSaveData,
    cashierAuthenticationKey,
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

export default connect(mapStateToProps, mapDispatchToProps)(CashierAuthenticateCardForm);
