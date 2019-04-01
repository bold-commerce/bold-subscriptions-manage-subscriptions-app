import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from './Button';
import Message from './Message';
import OrderCancelButton from './OrderCancelButton';
import SubscriptionContentBlock from './SubscriptionContentBlock';
import * as actions from '../../actions';
import Translation from '../Translation';
import InputField from './InputField';
import Input from './Input';
import ButtonGroup from './ButtonGroup';
import OrderCancellationCancelOffers from './OrderCancellationCancelOffers';
import { ORDER_PROP_TYPE, MESSAGE_PROP_TYPE } from '../../constants/PropTypes';

class OrderCancellationCustomReasonsBlock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      reasonSelectedOption: '0',
      reasonSelectedDetail: 'No Reason',
      confirmingCancellation: false,
      showOtherReasonInputBox: false,
      renderCancelOffer: false,
    };

    this.dismissMessage = this.dismissMessage.bind(this);
    this.toggleConfirmingCancellation = this.toggleConfirmingCancellation.bind(this);
    this.handleReasonOptionChange = this.handleReasonOptionChange.bind(this);
    this.recordOtherReason = this.recordOtherReason.bind(this);
    this.cancelOfferClick = this.cancelOfferClick.bind(this);
    this.exitCancelOffer = this.exitCancelOffer.bind(this);
  }

  dismissMessage() {
    this.props.dismissCancelOrderMessage(this.props.order.id);
  }

  toggleConfirmingCancellation() {
    this.setState({
      confirmingCancellation: !this.state.confirmingCancellation,
    });
  }

  handleReasonOptionChange(event) {
    const { cancelReasons } = this.props;

    if (event.target.value === 'cancel_reason_other') {
      this.setState({
        reasonSelectedOption: 'cancel_reason_other',
        reasonSelectedDetail: 'other',
        showOtherReasonInputBox: true,
      });
    } else {
      this.setState({
        reasonSelectedOption: event.target.value,
        reasonSelectedDetail: cancelReasons.find(cancelReason =>
          `${cancelReason.id}` === event.target.value).cancel_reason,
        showOtherReasonInputBox: false,
      });
    }
  }

  recordOtherReason(event) {
    this.setState({
      reasonSelectedDetail: event.target.value,
    });
  }

  cancelOfferClick() {
    this.setState({ renderCancelOffer: true });
  }

  exitCancelOffer() {
    this.setState({ renderCancelOffer: false });
  }

  renderReasonsList() {
    const { order, cancelReasons } = this.props;

    const customReasons = cancelReasons.map(cancelReason => (
      <div key={`cancel-reason-block-${cancelReason.id}`}>
        <label htmlFor={`${order.id} - ${cancelReason.id}`}>
          <Input
            type="radio"
            id={`${order.id} - ${cancelReason.id}`}
            value={`${cancelReason.id}`}
            checked={this.state.reasonSelectedOption === `${cancelReason.id}`}
            onChange={this.handleReasonOptionChange}
          />
          {cancelReason.cancel_reason}
        </label>
      </div>
    ));

    const otherReason = (
      <div>
        <label htmlFor={`${order.id} - cancel_reason_other`}>
          <Input
            type="radio"
            id={`${order.id} - cancel_reason_other`}
            value="cancel_reason_other"
            checked={this.state.reasonSelectedOption === 'cancel_reason_other'}
            onChange={this.handleReasonOptionChange}
          />
          <Translation textKey="cancel_block_other_reason" />
        </label>
      </div>
    );

    if (cancelReasons.length !== 0) {
      return (
        <Fragment>
          { customReasons }
          { otherReason }
          { this.state.showOtherReasonInputBox ?
            <InputField
              name="cancelReasonOtherDetail"
              id="cancelReasonOtherDetail"
              type="text"
              onChange={this.recordOtherReason}
            /> :
            null }
        </Fragment>);
    }
    return null;
  }

  renderCancelButton() {
    const { cancelOrderMessage, order } = this.props;

    if (this.state.confirmingCancellation) {
      return (
        <div className="cancel-order-confirm">
          { cancelOrderMessage ?
            <Message
              title={cancelOrderMessage.message}
              titleTextKey={cancelOrderMessage.messageTextKey}
              type={cancelOrderMessage.type}
              dismissable
              onDismissClick={this.dismissMessage}
            /> : null }
          <ButtonGroup>
            <Button
              textKey="cancel_block_confirm_cancel"
              onClick={this.toggleConfirmingCancellation}
            />
            <OrderCancelButton orderId={order.id} cancelReason={this.state.reasonSelectedDetail} />
          </ButtonGroup>
        </div>
      );
    }
    return (
      <ButtonGroup>
        <Button
          textKey="cancel_block_heading"
          onClick={this.toggleConfirmingCancellation}
          btnStyle="alert"
        />
      </ButtonGroup>
    );
  }

  renderCancelOfferButton() {
    if (this.state.reasonSelectedOption !== 'cancel_reason_other') {
      return (
        <ButtonGroup>
          <Button
            btnStyle="alert"
            textKey="cancel_block_heading"
            onClick={this.cancelOfferClick}
            disabled={this.state.reasonSelectedOption === '0'}
          />
        </ButtonGroup>);
    }
    return this.renderCancelButton();
  }

  render() {
    const {
      order,
      customCancelMessageEnabled,
      customCancelMessage,
      provideCancelIncentivesEnabled,
    } = this.props;

    if (this.state.renderCancelOffer) {
      return (
        <SubscriptionContentBlock
          titleTranslationKey="cancel_block_heading"
          editTitleTranslationKey="edit"
          editOnClick={this.toggleEditing}
        >
          <OrderCancellationCancelOffers
            orderId={order.id}
            cancelReasonId={Math.trunc(this.state.reasonSelectedOption)}
            exitCancelOffer={this.exitCancelOffer}
          />
        </SubscriptionContentBlock>
      );
    }
    return (
      <SubscriptionContentBlock
        titleTranslationKey="cancel_block_heading"
        editTitleTranslationKey="edit"
        editOnClick={this.toggleEditing}
      >
        { customCancelMessageEnabled ?
          <Message type="info">
            <div dangerouslySetInnerHTML={{ __html: customCancelMessage }} />
          </Message> :
          null}
        { <h6><Translation textKey="cancel_block_ask_for_reasons" /></h6> }
        { this.renderReasonsList() }
        {
          provideCancelIncentivesEnabled ?
          this.renderCancelOfferButton() :
          this.renderCancelButton()
        }
      </SubscriptionContentBlock>
    );
  }
}

OrderCancellationCustomReasonsBlock.propTypes = {
  order: ORDER_PROP_TYPE.isRequired,
  customCancelMessageEnabled: PropTypes.bool.isRequired,
  provideCancelIncentivesEnabled: PropTypes.bool.isRequired,
  customCancelMessage: PropTypes.string,
  dismissCancelOrderMessage: PropTypes.func,
  cancelOrderMessage: MESSAGE_PROP_TYPE,
  cancelReasons: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    cancel_reason: PropTypes.string.isRequired,
    custom_text: PropTypes.string,
    response_incentive_type: PropTypes.string,
    cancel_offers: PropTypes.arrayOf(PropTypes.shape()),
  })),

};

OrderCancellationCustomReasonsBlock.defaultProps = {
  dismissCancelOrderMessage: null,
  cancelOrderMessage: null,
  customCancelMessage: null,
  cancelReasons: [],
};

const mapStateToProps = (state, ownProps) => ({
  order: state.data.orders.find(order => order.id === ownProps.orderId),
  provideCancelIncentivesEnabled: state.data.general_settings.provide_cancel_incentives_enabled,
  customCancelMessageEnabled: state.data.general_settings.custom_cancel_message_enabled,
  customCancelMessage: state.data.general_settings.custom_cancel_message,
  cancelReasons: state.data.general_settings.cancel_reasons,
  cancelOrderMessage: state.userInterface.cancelOrderMessages[ownProps.orderId],
});

const mapDispatchToProps = dispatch => ({
  dismissCancelOrderMessage: (orderId) => {
    dispatch(actions.dismissCancelOrderMessage(orderId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderCancellationCustomReasonsBlock);
