import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';

import Button from './Button';
import ButtonGroup from './ButtonGroup';
import Field from './Field';
import Translation from '../Translation';
import Input from './Input';
import * as actions from '../../actions';
import Message from './Message';

class CashierChangeCardForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mode: CashierChangeCardForm.MODES.LOADING,
      iframeSrc: '',
      iframeSandbox: '',
    };

    this.selectCardChange = this.selectCardChange.bind(this);
    this.editCardClick = this.editCardClick.bind(this);
    this.saveCardClick = this.saveCardClick.bind(this);
    this.doneEditingClick = this.doneEditingClick.bind(this);
  }

  componentDidMount() {
    this.resetCards();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.cardList !== null) {
      if (Array.isArray(nextProps.cardList)) {
        this.setState({
          mode: CashierChangeCardForm.MODES.SELECT,
          currentlySelectedCardId: nextProps.currentlySelectedCardId,
        });
      } else {
        this.setState({
          mode: CashierChangeCardForm.MODES.GET_CARDS_FAILED,
        });
      }
    }
  }

  resetCards() {
    this.props.clearCashierCardData(this.props.orderId);
    this.props.getCashierCardData(this.props.orderId);
  }

  saveCardClick() {
    this.setState({ saving: true });
    this.props.saveCard(this.state.currentlySelectedCardId);
  }

  editCardClick() {
    this.setState({
      mode: CashierChangeCardForm.MODES.LOADING,
    });

    fetch(`https://${window.location.hostname}/apps/checkout/customer-info?public_payment_id=${this.state.currentlySelectedCardId}`)
      .then((result) => {
        if (result.status === 200) {
          result.text().then((data) => {
            const element = document.createElement('div');
            element.innerHTML = data;
            const iframeElement = element.querySelector('iframe');
            if (typeof iframeElement !== 'undefined' && iframeElement) {
              this.setState({
                iframeSrc: iframeElement.getAttribute('src'),
                iframeSandbox: iframeElement.getAttribute('sandbox'),
                mode: CashierChangeCardForm.MODES.EDIT,
              });
            } else {
              this.props.customerLoggedOut();
            }
          });
        }
      });
  }

  doneEditingClick() {
    this.setState({ mode: CashierChangeCardForm.MODES.LOADING });
    this.resetCards();
  }

  selectCardChange(e) {
    this.setState({ currentlySelectedCardId: e.target.value });
  }

  renderEditCard() {
    return (
      <Fragment>
        <iframe
          className="cashier-card-iframe"
          title="cashier-edit-card"
          src={this.state.iframeSrc}
          sandbox={this.state.iframeSandbox}
        />
        <ButtonGroup align="right">
          <Button
            textKey="done_button_text"
            onClick={this.doneEditingClick}
          />
        </ButtonGroup>
      </Fragment>
    );
  }

  renderSelectCard() {
    return (
      <div>
        {
          this.props.cardList.map(card => (
            <Field key={card.public_id}>
              <label htmlFor={card.public_id}>
                <Input
                  type="radio"
                  id={card.public_id}
                  name="select_card"
                  value={card.public_id}
                  checked={card.public_id === this.state.currentlySelectedCardId}
                  onChange={this.selectCardChange}
                />
                <div className="cashier-card-label">
                  <div>
                    <Translation textKey="last_four" mergeFields={card} />
                  </div>
                  <div>
                    {moment(card.expiration.date).format('MM/YY')}
                    &nbsp;
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
                </div>
              </label>
            </Field>
          ))
        }
        <ButtonGroup align="right">
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
            onClick={this.props.cancelOnClick}
          />
        </ButtonGroup>
      </div>
    );
  }

  render() {
    switch (this.state.mode) {
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
  cancelOnClick: PropTypes.func.isRequired,
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
};

CashierChangeCardForm.defaultProps = {
  cardList: null,
  currentlySelectedCardId: '',
};

const mapStateToProps = (state, ownProps) => {
  const order = state.data.orders.find(o => o.id === ownProps.orderId);

  return {
    cardList: order.cashier_cards,
    currentlySelectedCardId: order.cashier_selected_card_id,
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
});

export default connect(mapStateToProps, mapDispatchToProps)(CashierChangeCardForm);
