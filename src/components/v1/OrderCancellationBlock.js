import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from './Button';
import Message from './Message';
import OrderCancelButton from './OrderCancelButton';
import SubscriptionContentBlock from './SubscriptionContentBlock';
import * as actions from '../../actions';
import * as OrderCancellationStates from '../../constants/OrderCancellationStates';
import ButtonGroup from './ButtonGroup';
import OrderCancellationCustomReasonsBlock from './OrderCancellationCustomReasonsBlock';
import { ORDER_PROP_TYPE, MESSAGE_PROP_TYPE } from '../../constants/PropTypes';
import OrderPrepaidBlock from './OrderPrepaidBlock';

class OrderCancellationBlock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmingCancellation: false,
    };

    this.dismissMessage = this.dismissMessage.bind(this);
    this.cancelWarning = this.cancelWarning.bind(this);
    this.toggleConfirmingCancellation = this.toggleConfirmingCancellation.bind(this);
    this.confirmKeepSubscription = this.confirmKeepSubscription.bind(this);
  }

  cancelWarning() {
    const { order, cancelMode, cancelInfo } = this.props;
    let warningMessage;

    if (cancelMode === OrderCancellationStates.CANCEL_MODE_SPECIAL_INSTRUCTION) {
      warningMessage = (
        <Message
          type="info"
          title={cancelInfo}
        />);
    } else if (cancelMode === OrderCancellationStates.CANCEL_MODE_STANDARD ||
        cancelMode === OrderCancellationStates.CANCEL_MODE_CUSTOM_REASONS) {
      const mergeFields = {
        order_id: order.id,
        product_title: order.order_products[0].product_title,
        product_count: order.order_products.length,
      };

      if (this.state.confirmingCancellation) {
        warningMessage = (
          <Message
            type="warning"
            titleTextKey="cancel_block_confirm_message"
          />);
      } else if (order.order_products.length === 1) {
        warningMessage = (
          <Message
            type="warning"
            titleTextKey="cancel_block_alert_one_product"
            mergeFields={mergeFields}
          />
        );
      } else {
        warningMessage = (
          <Message
            type="warning"
            titleTextKey="cancel_block_alert_multiple_products"
            mergeFields={mergeFields}
          />
        );
      }
    }

    return warningMessage;
  }

  toggleConfirmingCancellation() {
    this.setState({
      confirmingCancellation: !this.state.confirmingCancellation,
    });
  }

  confirmKeepSubscription() {
    this.props.saveAttemptedCancellation(this.props.order.id, 'No Reason');
    this.setState({
      confirmingCancellation: !this.state.confirmingCancellation,
    });
  }

  dismissMessage() {
    this.props.dismissCancelOrderMessage(this.props.order.id);
  }

  render() {
    const { cancelOrderMessage, cancelMode, order } = this.props;
    if (order.has_prepaid) {
      return (
        <SubscriptionContentBlock
          titleTranslationKey="cancel_block_heading"
          editTitleTranslationKey="edit"
          editOnClick={this.toggleEditing}
        >
          <OrderPrepaidBlock orderId={order.id} />
        </SubscriptionContentBlock>
      );
    }
    let cancelButton;
    if (this.state.confirmingCancellation) {
      cancelButton = (
        <div className="cancel-order-confirm">
          { cancelOrderMessage ?
            <Message
              title={cancelOrderMessage.message}
              titleTextKey={cancelOrderMessage.messageTextKey}
              type={cancelOrderMessage.type}
              dismissable
              onDismissClick={this.dismissMessage}
            /> :
            null }
          <ButtonGroup>
            <Button
              textKey="cancel_block_confirm_cancel"
              onClick={this.confirmKeepSubscription}
            />
            <OrderCancelButton orderId={order.id} />
          </ButtonGroup>
        </div>
      );
    } else {
      cancelButton = (
        <ButtonGroup>
          <Button
            textKey="cancel_block_heading"
            onClick={this.toggleConfirmingCancellation}
            btnStyle="alert"
          />
        </ButtonGroup>
      );
    }

    switch (cancelMode) {
      case OrderCancellationStates.CANCEL_MODE_CUSTOM_REASONS:
        return (<OrderCancellationCustomReasonsBlock orderId={order.id} />);
      case OrderCancellationStates.CANCEL_MODE_SPECIAL_INSTRUCTION:
      case OrderCancellationStates.CANCEL_MODE_STANDARD:
        return (
          <SubscriptionContentBlock
            titleTranslationKey="cancel_block_heading"
            editTitleTranslationKey="edit"
            editOnClick={this.toggleEditing}
          >
            <div>
              {this.cancelWarning()}
            </div>
            { cancelMode === OrderCancellationStates.CANCEL_MODE_SPECIAL_INSTRUCTION ?
              null :
              cancelButton }
          </SubscriptionContentBlock>
        );
      case OrderCancellationStates.CANCEL_MODE_OFF:
      default:
        return null;
    }
  }
}

OrderCancellationBlock.propTypes = {
  order: ORDER_PROP_TYPE.isRequired,
  cancelMode: PropTypes.string.isRequired,
  cancelInfo: PropTypes.string,
  dismissCancelOrderMessage: PropTypes.func,
  saveAttemptedCancellation: PropTypes.func.isRequired,
  cancelOrderMessage: MESSAGE_PROP_TYPE,
};

OrderCancellationBlock.defaultProps = {
  dismissCancelOrderMessage: null,
  cancelOrderMessage: null,
  cancelInfo: null,
};

const mapStateToProps = (state, ownProps) => ({
  order: state.data.orders.find(order => order.id === ownProps.orderId),
  cancelMode: state.data.general_settings.cancel_mode,
  cancelInfo: state.data.general_settings.cancel_info,
  cancelOrderMessage: state.userInterface.cancelOrderMessages[ownProps.orderId],
});

const mapDispatchToProps = dispatch => ({
  dismissCancelOrderMessage: (orderId) => {
    dispatch(actions.dismissCancelOrderMessage(orderId));
  },
  saveAttemptedCancellation: (orderId, cancelReason) => {
    dispatch(actions.orderAttemptedCancellation(orderId, cancelReason));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderCancellationBlock);
