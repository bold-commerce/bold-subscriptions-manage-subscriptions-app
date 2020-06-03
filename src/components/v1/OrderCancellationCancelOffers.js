import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import * as OrderCancellationStates from '../../constants/OrderCancellationStates';
import Translation from '../Translation';
import Button from './Button';
import Message from './Message';
import Input from './Input';
import OrderCancelButton from './OrderCancelButton';
import SkipOrdersList from './SkipOrdersList';
import OrderProductEditQuantityBlock from './OrderProductEditQuantityBlock';
import OrderProductSwap from './OrderProductSwap';
import OrderProducts from './OrderProducts';
import ButtonGroup from './ButtonGroup';
import { ORDER_PROP_TYPE, MESSAGE_PROP_TYPE } from '../../constants/PropTypes';
import OrderCancellationPauseButton from './OrderCancellationPauseButton';

class OrderCancellationCancelOffers extends Component {
  static renderCancelOfferDetail(cancelOffer) {
    switch (cancelOffer.offer_type) {
      case OrderCancellationStates.OFFER_TYPE_SKIP_SHIPMENT:
        return (<Translation textKey="cancel_offer_skip_order" />);
      case OrderCancellationStates.OFFER_TYPE_SWAP_PRODUCT:
        return (<Translation textKey="cancel_offer_swap_product" />);
      case OrderCancellationStates.OFFER_TYPE_MODIFY_QUANTITY:
        return (<Translation textKey="cancel_offer_change_quantity" />);
      case OrderCancellationStates.OFFER_TYPE_DISCOUNT_CODE:
        return (`${cancelOffer.discount_code} - ${cancelOffer.discount_detail}`);
      case OrderCancellationStates.OFFER_TYPE_PAUSE_SUBSCRIPTION:
        return (<Translation textKey="cancel_offer_pause_subscription" />);
      default:
        return null;
    }
  }

  constructor(props) {
    super(props);

    const numOffers = this.props.cancelReason.cancel_offers
      ? this.props.cancelReason.cancel_offers.length
      : 0;

    this.state = {
      offerSelectedOption: '0',
      currIncentiveType: null,
      numOffers,
      confirmingCancellation: !numOffers,
      renderSettingPart: false,
      renderSavedPage: false,
      swapping: false,
      swapProductId: null,
      swapGroupId: null,
      applyingCancelDiscount: false,
    };

    this.dismissMessage = this.dismissMessage.bind(this);
    this.chooseIncentive = this.chooseIncentive.bind(this);
    this.handleOfferOptionChange = this.handleOfferOptionChange.bind(this);
    this.toggleConfirmingCancellation = this.toggleConfirmingCancellation.bind(this);
    this.showSavedPage = this.showSavedPage.bind(this);
    this.toggleSwap = this.toggleSwap.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.applyingCancelDiscount && nextProps.cancelDiscountMessage) {
      this.setState({
        applyingCancelDiscount: false,
      });
    }
  }

  dismissMessage() {
    const { order } = this.props;
    this.props.dismissCancelOrderMessage(order.id);
    this.props.dismissProductSwapMessage(order.id);
  }

  toggleConfirmingCancellation() {
    const { cancelReason, order } = this.props;
    this.props.saveAttemptedCancellation(order.id, cancelReason.cancel_reason);
    this.setState({
      confirmingCancellation: !this.state.confirmingCancellation,
    });
  }

  handleOfferOptionChange(event) {
    this.setState({
      offerSelectedOption: event.target.value,
      confirmingCancellation: false,
    });
  }

  chooseIncentive() {
    const { cancelReason, order } = this.props;
    const currCancelOffer = cancelReason.cancel_offers
      .find(cancelOffer => `${cancelOffer.id}` === this.state.offerSelectedOption);

    if (currCancelOffer.offer_type === OrderCancellationStates.OFFER_TYPE_DISCOUNT_CODE) {
      this.props.applyCancelDiscount(order.id, currCancelOffer.discount_code, cancelReason.id);
      this.setState({
        renderSettingPart: false,
        applyingCancelDiscount: true,
      });
    } else {
      this.setState({
        renderSettingPart: true,
        currIncentiveType: currCancelOffer.offer_type,
      });
    }
    this.props.saveAttemptedCancellation(order.id, cancelReason.cancel_reason);
  }

  showSavedPage() {
    this.setState({ renderSavedPage: true });
  }

  toggleSwap(orderId, productId, groupId) {
    if (!this.state.swapping) {
      this.props.getSwapProducts(orderId, productId, groupId);
      this.dismissMessage();
    }
    this.setState({
      swapping: !this.state.swapping,
      swapProductId: productId,
      swapGroupId: groupId,
    });
  }

  renderOffersList() {
    const { cancelReason, order } = this.props;

    const cancelOffers = cancelReason.cancel_offers.map(cancelOffer => (
      <div key={`cancel-offer-block-${cancelOffer.id}`}>
        <label htmlFor={`${order.id}-${cancelReason.id}-${cancelOffer.id}`}>
          <Input
            type="radio"
            id={`${order.id}-${cancelReason.id}-${cancelOffer.id}`}
            value={`${cancelOffer.id}`}
            checked={this.state.offerSelectedOption === `${cancelOffer.id}`}
            onChange={this.handleOfferOptionChange}
          />
          { OrderCancellationCancelOffers.renderCancelOfferDetail(cancelOffer) }
        </label>
      </div>
    ));

    const cancelOfferCancel = (
      <div>
        <label htmlFor={`${order.id}-${cancelReason.id}-cancel_offer_cancel`}>
          <Input
            type="radio"
            id={`${order.id}-${cancelReason.id}-cancel_offer_cancel`}
            value="cancel_offer_cancel"
            checked={this.state.offerSelectedOption === 'cancel_offer_cancel'}
            onChange={this.handleOfferOptionChange}
          />
          <Translation textKey="cancel_offer_cancel" />
        </label>
      </div>
    );

    if (cancelReason.cancel_offers.length !== 0) {
      return (
        <div>
          { cancelOffers }
          { cancelOfferCancel }
        </div>);
    }
    return null;
  }

  renderSettingPart() {
    const { order, productSwapMessage } = this.props;

    let swapProductMessage = null;
    if (productSwapMessage && productSwapMessage.type === 'success') {
      swapProductMessage = (
        <Message
          key="edit-quantity-message"
          title={productSwapMessage.message}
          titleTextKey={productSwapMessage.messageTextKey}
          type={productSwapMessage.type}
          dismissable
          onDismissClick={this.dismissMessage}
        />
      );
    }
    if (productSwapMessage && productSwapMessage.type === 'error') {
      swapProductMessage = (
        <Message
          key="edit-quantity-message"
          title={productSwapMessage.message}
          type={productSwapMessage.type}
          dismissable
          onDismissClick={this.dismissMessage}
        />
      );
    }

    switch (this.state.currIncentiveType) {
      case OrderCancellationStates.OFFER_TYPE_SKIP_SHIPMENT:
        return (
          <div>
            <h6><Translation textKey="cancel_offer_skip_order" /></h6>
            <SkipOrdersList orderId={order.id} />
            { this.renderSaveChangeButton() }
          </div>
        );
      case OrderCancellationStates.OFFER_TYPE_SWAP_PRODUCT:
        return (
          <div>
            <h6><Translation textKey="cancel_offer_swap_product" /></h6>
            { swapProductMessage }
            { this.state.swapping ?
              <OrderProductSwap
                orderId={order.id}
                productId={this.state.swapProductId}
                groupId={this.state.swapGroupId}
                toggleSwap={this.toggleSwap}
              /> :
              <div>
                <OrderProducts
                  orderId={order.id}
                  toggleSwap={this.toggleSwap}
                />
                { this.renderSaveChangeButton() }
              </div>}
          </div>
        );
      case OrderCancellationStates.OFFER_TYPE_MODIFY_QUANTITY:
        return (
          <div>
            <h6><Translation textKey="cancel_offer_change_quantity" /></h6>
            <OrderProductEditQuantityBlock orderId={order.id} toggleEdit={this.showSavedPage} />
          </div>
        );
      case OrderCancellationStates.OFFER_TYPE_PAUSE_SUBSCRIPTION:
        return (
          <div>
            <h6><Translation textKey="cancel_offer_pause_subscription" /></h6>
            <Message
              type="info"
              titleTextKey="pause_subscription_confirmation"
            />
            <div>
              <Translation textKey="subscription_status_heading" />
            </div>
            {this.renderPauseResumeStatus()}
            <ButtonGroup>
              <OrderCancellationPauseButton order={order} />
            </ButtonGroup>
          </div>
        );
      default:
        return null;
    }
  }

  renderCancelButton() {
    const { cancelOrderMessage, order, cancelReason } = this.props;
    const { numOffers } = this.state;

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
            {numOffers > 0 ? (
              <Button
                textKey="cancel_block_confirm_cancel"
                onClick={this.toggleConfirmingCancellation}
              />
            ) : (
              <Button
                textKey="cancel_block_confirm_cancel"
                onClick={this.props.exitCancelOffer}
              />
            )}
            <OrderCancelButton orderId={order.id} cancelReason={cancelReason.cancel_reason} />
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
    if (this.state.offerSelectedOption !== 'cancel_offer_cancel' && this.props.cancelReason.cancel_offers.length > 0) {
      return (
        <div>
          <ButtonGroup>
            <Button
              textKey="cancel_block_confirm_cancel"
              loading={this.state.applyingCancelDiscount}
              disabled={this.state.applyingCancelDiscount || this.state.offerSelectedOption === '0'}
              onClick={this.chooseIncentive}
            />
          </ButtonGroup>
        </div>);
    }
    return this.renderCancelButton();
  }

  renderSaveChangeButton() {
    return (
      <ButtonGroup>
        <Button
          textKey="save_button_text"
          onClick={this.showSavedPage}
          btnStyle="primary"
        />
      </ButtonGroup>
    );
  }

  renderPauseResumeStatus() {
    const { order } = this.props;
    return (
      <React.Fragment>
        { order.is_paused ?
          <Translation textKey="paused_subscription_status" /> :
          <Translation textKey="active_subscription_status" />
        }
      </React.Fragment>
    );
  }
  render() {
    const { cancelDiscountMessage, cancelReason } = this.props;
    const { numOffers } = this.state;

    if (cancelDiscountMessage) {
      return (
        <Message
          title={cancelDiscountMessage.message}
          titleTextKey={cancelDiscountMessage.messageTextKey}
          type={cancelDiscountMessage.type}
        />
      );
    } else if (this.state.renderSavedPage) {
      return (
        <div>
          <Message type="success" titleTextKey="cancel_offer_changes_applied_msg" />
        </div>
      );
    } else if (this.state.renderSettingPart) {
      return (this.renderSettingPart());
    } else if (cancelReason.response_incentive_type ===
      OrderCancellationStates.RESPONSE_INCENTIVE_TYPE_CUSTOM_TEXT) {
      return (
        <div>
          <h6>{cancelReason.cancel_reason}</h6>
          {cancelReason.custom_text && cancelReason.custom_text !== '' ? (
            <Message type="info">
              <div dangerouslySetInnerHTML={{ __html: cancelReason.custom_text }} />
            </Message>
          ) : null}
          { this.renderCancelButton() }
        </div>
      );
    }
    return (
      <div>
        <h6>{cancelReason.cancel_reason}</h6>
        { this.renderOffersList() }
        { this.renderCancelOfferButton() }
      </div>
    );
  }
}

OrderCancellationCancelOffers.propTypes = {
  order: ORDER_PROP_TYPE.isRequired,
  cancelReason: PropTypes.shape({
    id: PropTypes.number,
    cancel_reason: PropTypes.string,
    custom_text: PropTypes.string,
    response_incentive_type: PropTypes.string,
    cancel_offers: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      offer_type: PropTypes.string,
      discount_code_id: PropTypes.number,
      discount_code: PropTypes.string,
      discount_detail: PropTypes.string,
    })),
  }).isRequired,
  applyCancelDiscount: PropTypes.func.isRequired,
  cancelOrderMessage: MESSAGE_PROP_TYPE,
  cancelDiscountMessage: MESSAGE_PROP_TYPE,
  productSwapMessage: MESSAGE_PROP_TYPE,
  dismissProductSwapMessage: PropTypes.func,
  dismissCancelOrderMessage: PropTypes.func,
  getSwapProducts: PropTypes.func.isRequired,
  exitCancelOffer: PropTypes.func.isRequired,
  saveAttemptedCancellation: PropTypes.func.isRequired,
};

OrderCancellationCancelOffers.defaultProps = {
  dismissCancelOrderMessage: null,
  dismissProductSwapMessage: null,
  cancelOrderMessage: null,
  cancelDiscountMessage: null,
  productSwapMessage: null,
};

const mapStateToProps = (state, ownProps) => ({
  order: state.data.orders.find(order => order.id === ownProps.orderId),
  cancelReason: state.data.general_settings.cancel_reasons
    .find(cancelReason => cancelReason.id === ownProps.cancelReasonId),
  cancelOrderMessage: state.userInterface.cancelOrderMessages[ownProps.orderId],
  cancelDiscountMessage: state.userInterface.cancelDiscountMessage[ownProps.orderId],
  productSwapMessage: state.userInterface.productSwapMessages[ownProps.orderId],
});

const mapDispatchToProps = dispatch => ({
  dismissCancelOrderMessage: (orderId) => {
    dispatch(actions.dismissCancelOrderMessage(orderId));
  },
  applyCancelDiscount: (orderId, discountCode, reasonId) => {
    dispatch(actions.applyCancelDiscount(orderId, discountCode, reasonId));
  },
  dismissProductSwapMessage: (orderId, productId) => {
    dispatch(actions.dismissProductSwapMessage(orderId, productId));
  },
  getSwapProducts: (orderId, productId, groupId) => {
    dispatch(actions.orderProductGetSwap(orderId, productId, groupId));
  },
  saveAttemptedCancellation: (orderId, cancelReason) => {
    dispatch(actions.orderAttemptedCancellation(orderId, cancelReason));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderCancellationCancelOffers);
