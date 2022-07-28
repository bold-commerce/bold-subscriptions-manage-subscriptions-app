import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';

import Button from '../v1/Button';
import ButtonGroup from '../v1/ButtonGroup';
import Field from '../v1/Field';
import Translation from '../Translation';
import Input from '../v1/Input';
import * as actions from '../../actions';
import Message from '../v1/Message';

class CashierChangeCardForm extends Component {
  constructor(props) {
    super(props);

    this.iframeContainer = null;
    this.setIframeContainer = (element) => { this.iframeContainer = element; };
    this.state = {
      mode: CashierChangeCardForm.MODES.LOADING,
      iframe: '',
      saving: this.props.saving,
      hasChanges: false,
    };
    this.props.setBlockMode('editing');

    this.selectCardChange = this.selectCardChange.bind(this);
    this.editCardClick = this.editCardClick.bind(this);
    this.saveCardClick = this.saveCardClick.bind(this);
    this.doneEditingClick = this.doneEditingClick.bind(this);
    this.addCardClick = this.addCardClick.bind(this);
    this.handleAddPaymentMethodSuccess = this.handleAddPaymentMethodSuccess.bind(this);
    this.resetCards = this.resetCards.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  componentDidMount() {
    window.addEventListener('message', this.handleAddPaymentMethodSuccess);
    this.resetCards();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.cardList !== null) {
      const mode = ['iframe'].indexOf(nextProps.blockMode) >= 0
        ? CashierChangeCardForm.MODES.EDIT
        : CashierChangeCardForm.MODES.SELECT;

      if (Array.isArray(nextProps.cardList)) {
        this.setState({
          mode,
          currentlySelectedCardId: nextProps.currentlySelectedCardId,
          hasChanges: false,
          saving: false,
        });
      } else {
        this.setState({
          mode: CashierChangeCardForm.MODES.GET_CARDS_FAILED,
        });
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const saving = ['saving'].indexOf(nextProps.blockMode) >= 0;
    const iframeOpened = (nextState.mode === CashierChangeCardForm.MODES.EDIT
      && this.iframeContainer !== null);

    // Don't re-render if iframe is open
    if (saving || iframeOpened) {
      return false;
    }

    return true;
  }

  resetCards() {
    this.props.clearCashierCardData(this.props.orderId);
    this.props.getCashierCardData(this.props.orderId);
    this.setState({
      saving: false,
      hasChanges: false,
    });
  }

  saveCardClick() {
    this.setState(
      { hasChanges: true, saving: true, mode: CashierChangeCardForm.MODES.SELECT },
      () => {
        this.props.setBlockMode('saving');
        this.props.saveCashierPaymentMethod(this.props.orderId, this.state.currentlySelectedCardId);
      },
    );
  }

  fetchCashierIframe(extraParams = {}) {
    const queryStringAppend = Object.entries(extraParams)
      .reduce((p, [key, value]) => `${p}&${key}=${value}`, '');

    if (!window.links) {
      window.links = [];
    }

    window.links.push(`https://${window.location.hostname}/apps/checkout/payment-method-management/${this.props.shopUrl}/shopify?currency=${this.props.currency}&customer_public_id=${this.props.customerPublicId}&billing_address=${this.props.billingAddress}${queryStringAppend}`);

    fetch(`https://${window.location.hostname}/apps/checkout/payment-method-management/${this.props.shopUrl}/shopify?currency=${this.props.currency}&customer_public_id=${this.props.customerPublicId}&billing_address=${this.props.billingAddress}${queryStringAppend}`)
      .then((result) => {
        if (result.status === 200) {
          result.text().then((data) => {
            if (data.indexOf('iframe') >= 0) {
              this.setState({
                iframe: data,
                mode: CashierChangeCardForm.MODES.EDIT,
              }, () => {
                // Scroll to payment block
                this.props.setBlockMode('iframe');

                // Block Header
                const paymentBlock = this.iframeContainer.parentNode.parentNode.parentNode;
                paymentBlock.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                  inline: 'start',
                });
              });
            } else {
              this.props.customerLoggedOut();
            }
          });
        }
      });
  }

  addCardClick() {
    this.setState({
      mode: CashierChangeCardForm.MODES.LOADING,
    });

    this.fetchCashierIframe();
  }

  editCardClick() {
    this.setState({
      mode: CashierChangeCardForm.MODES.LOADING,
    });

    this.fetchCashierIframe({
      public_payment_id: this.state.currentlySelectedCardId,
    });
  }

  doneEditingClick() {
    this.setState({ mode: CashierChangeCardForm.MODES.LOADING });
    this.resetCards();
  }

  selectCardChange(e) {
    this.setState({ currentlySelectedCardId: e.target.value, hasChanges: true });
  }

  cancel() {
    this.setState({
      currentlySelectedCardId: this.props.currentlySelectedCardId,
      hasChanges: false,
    });
  }

  handleAddPaymentMethodSuccess(e) {
    if (e.origin === window.manageSubscription.cashierURL
      && (e.data && e.data.success === true && e.data.paymentMethodData)) {
      this.props.saveNewCashierPaymentMethod(
        this.props.orderId,
        e.data.paymentMethodData.credit_card_last_four_digits,
        e.data.paymentMethodData.credit_card_expiration_date,
      );
      this.iframeContainer = null;
      this.setState({ hasChanges: true, saving: true, mode: CashierChangeCardForm.MODES.SELECT });
      this.props.setBlockMode('saving');
    }
  }

  renderEditCard() {
    return (
      <div className="full-screen-iframe" ref={this.setIframeContainer}>
        {this.state.iframe && <div dangerouslySetInnerHTML={{ __html: this.state.iframe }} />}
      </div>
    );
  }

  renderSelectCard() {
    const { currentlySelectedCardId, hasChanges } = this.state;
    const { cardList, orderId } = this.props;
    const sortedCardList =
      cardList.sort((a, b) => {
        const nameA = a.type.toLowerCase();
        const nameB = b.type.toLowerCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });

    return (
      <div>
        {
          sortedCardList.map(card => (
            <Field key={`${orderId}-${card.public_id}`}>
              <label htmlFor={`${orderId}-${card.public_id}`}>
                <Input
                  type="radio"
                  id={`${orderId}-${card.public_id}`}
                  name={`select_card-${orderId}`}
                  value={card.public_id}
                  checked={card.public_id === currentlySelectedCardId}
                  onChange={this.selectCardChange}
                  disabled={this.state.saving}
                />
                { this.renderPaymentMethodInfo(card) }
              </label>
            </Field>
          ))
        }
        <ButtonGroup align="split">
          { sortedCardList.length && hasChanges > 0 ?
            <ButtonGroup>
              <Button
                textKey="save_button_text"
                disabled={this.state.saving}
                loading={this.state.saving}
                onClick={this.saveCardClick}
              />
              <Button
                btnStyle="secondary"
                textKey="cancel_button_text"
                disabled={this.state.saving}
                onClick={this.cancel}
              />
            </ButtonGroup> : null }
          <Button
            btnStyle="link"
            textKey="add_payment_text"
            disabled={this.state.saving}
            onClick={this.addCardClick}
          />
        </ButtonGroup>
      </div>
    );
  }

  renderPaymentMethodInfo(card) {
    const { currentlySelectedCardId } = this.state;

    if (card.type === 'paypal') {
      return (
        <div className="cashier-card-label">
          <div>PayPal - {card.paypal_email}</div>
          {
            card.public_id === this.state.currentlySelectedCardId ?
              <Button
                btnStyle="link"
                textKey="edit_card_button_text"
                onClick={this.editCardClick}
              />
              : null
          }
        </div>
      );
    }
    if (card.type === 'venmo') {
      return (
        <div className="cashier-card-label">
          <div>Venmo - {card.venmo_username}</div>
          {
            card.public_id === this.state.currentlySelectedCardId ?
              <Button
                btnStyle="link"
                textKey="edit_card_button_text"
                onClick={this.editCardClick}
              />
              : null
          }
        </div>
      );
    }

    return (
      <div className="cashier-card-label">
        <div>
          <Translation textKey="last_four" mergeFields={card} />
        </div>
        <div>
          {moment(card.expiration.date).format('MM/YY')}
          &nbsp;
          {
            card.public_id === currentlySelectedCardId
              ? (
                <Button
                  btnStyle="link"
                  textKey="edit_card_button_text"
                  onClick={this.editCardClick}
                />
              )
              : null
          }
        </div>
      </div>
    );
  }

  render() {
    const { mode } = this.state;
    switch (mode) {
      case CashierChangeCardForm.MODES.LOADING:
        return <div><Translation textKey="credit_card_loading" /></div>;
      case CashierChangeCardForm.MODES.SELECT:
        return this.renderSelectCard();
      case CashierChangeCardForm.MODES.EDIT:
        return this.renderEditCard();
      case CashierChangeCardForm.MODES.GET_CARDS_FAILED:
        return <Message type="error"><Translation textKey="msp_get_cards_failed" /></Message>;
      default:
        return null;
    }
  }
}

CashierChangeCardForm.MODES = {
  LOADING: 'loading',
  SELECT: 'select',
  EDIT: 'edit',
  GET_CARDS_FAILED: 'get_cards_failed',
};

CashierChangeCardForm.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  cancelOnClick: PropTypes.func.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  saveCard: PropTypes.func.isRequired,
  getCashierCardData: PropTypes.func.isRequired,
  orderId: PropTypes.number.isRequired,
  cardList: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape({})),
    PropTypes.shape({}),
  ]),
  currentlySelectedCardId: PropTypes.string,
  clearCashierCardData: PropTypes.func.isRequired,
  customerLoggedOut: PropTypes.func.isRequired,
  customerPublicId: PropTypes.string,
  billingAddress: PropTypes.string,
  currency: PropTypes.string,
  shopUrl: PropTypes.string,
  saveNewCashierPaymentMethod: PropTypes.func.isRequired,
  saving: PropTypes.bool,
  setBlockMode: PropTypes.func.isRequired,
  blockMode: PropTypes.string,
  saveCashierPaymentMethod: PropTypes.func.isRequired,
};

CashierChangeCardForm.defaultProps = {
  cardList: null,
  currentlySelectedCardId: '',
  saving: false,
  blockMode: 'editing',
  shopUrl: '',
  currency: '',
  billingAddress: '',
  customerPublicId: '',
};

const mapStateToProps = (state, ownProps) => {
  const order = state.data.orders.find(o => o.id === ownProps.orderId);
  const billingAddress = encodeURIComponent(JSON.stringify({
    address_line1: order.billing_address1 || '',
    address_line2: order.billing_address2 || '',
    address_city: order.billing_city || '',
    address_country: order.billing_country || '',
    address_state: order.billing_province || '',
    address_zip: order.billing_zip || '',
  }));
  return {
    cardList: order.cashier_cards,
    currentlySelectedCardId: order.cashier_selected_card_id,
    customerPublicId: order.cashier_customer_id,
    billingAddress,
    currency: order.currency ?
      order.currency
      : window.BOLD.common.Shopify.shop.currency,
    shopUrl: window.BOLD.common.Shopify.shop.permanent_domain,
  };
};

const mapDispatchToProps = dispatch => ({
  getCashierCardData: (orderId) => {
    dispatch(actions.orderGetCashierCardData(orderId));
  },
  clearCashierCardData: (orderId) => {
    dispatch(actions.orderClearCashierCardData(orderId));
  },
  customerLoggedOut: () => {
    dispatch(actions.customerLoggedOut());
  },
  saveNewCashierPaymentMethod: (orderId, lastFour, expiryDate) => {
    dispatch(actions.orderSaveNewCashierPaymentMethod(orderId, lastFour, expiryDate));
  },
  saveCashierPaymentMethod: (orderId, paymentToken) => {
    dispatch(actions.orderSaveCashierPaymentMethod(orderId, paymentToken));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CashierChangeCardForm);
