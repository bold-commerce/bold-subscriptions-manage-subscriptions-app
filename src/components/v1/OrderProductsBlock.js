import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import SubscriptionContentBlock from './SubscriptionContentBlock';
import OrderProductSwap from './OrderProductSwap';
import OrderProducts from './OrderProducts';
import OrderProductEditQuantityBlock from './OrderProductEditQuantityBlock';
import Message from './Message';
import { ORDER_PROP_TYPE, MESSAGE_PROP_TYPE } from '../../constants/PropTypes';

class OrderProductsBlock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editingQuantity: false,
      swapping: false,
      productId: null,
      groupId: null,
    };

    this.toggleEditing = this.toggleEditing.bind(this);
    this.toggleSwap = this.toggleSwap.bind(this);
    this.dismissMessage = this.dismissMessage.bind(this);
  }

  toggleSwap(orderId, productId, groupId) {
    if (!this.state.swapping) {
      this.props.getSwapProducts(orderId, productId, groupId);
      this.dismissMessage();
    }
    this.setState({
      swapping: !this.state.swapping,
      productId,
      groupId,
    });
  }

  toggleEditing() {
    this.setState({
      editingQuantity: !this.state.editingQuantity,
    });
    if (!this.state.editingQuantity) {
      this.dismissMessage();
    }
  }

  dismissMessage() {
    const { order } = this.props;

    this.props.dismissProductQuantityMessage(order.id);
    this.props.dismissProductSwapMessage(order.id);
  }

  render() {
    const { order, productQuantityMessage, productSwapMessage } = this.props;

    let productList;
    if (order.build_a_box) {
      return null;
    } else if (this.state.swapping) {
      productList = (
        <OrderProductSwap
          orderId={order.id}
          productId={this.state.productId}
          groupId={this.state.groupId}
          toggleSwap={this.toggleSwap}
        />
      );
    } else if (this.state.editingQuantity) {
      productList = (
        <OrderProductEditQuantityBlock
          orderId={order.id}
          toggleEdit={this.toggleEditing}
        />
      );
    } else {
      productList = (
        <OrderProducts
          orderId={order.id}
          toggleSwap={this.toggleSwap}
          toggleEdit={this.toggleEditing}
        />
      );
    }

    let editQuantityMessage = null;
    if (productQuantityMessage && productQuantityMessage.type === 'success') {
      editQuantityMessage = (
        <Message
          key="edit-quantity-message"
          title={productQuantityMessage.message}
          titleTextKey={productQuantityMessage.messageTextKey}
          type={productQuantityMessage.type}
          dismissable
          onDismissClick={this.dismissMessage}
        />);
    }
    let swapProductMessage = null;
    if (productSwapMessage && productSwapMessage.type === 'success') {
      swapProductMessage = (
        <Message
          key="edit-quantity-message"
          title={this.props.productSwapMessage.message}
          titleTextKey={this.props.productSwapMessage.messageTextKey}
          type={this.props.productSwapMessage.type}
          dismissable
          onDismissClick={this.dismissMessage}
        />
      );
    }
    if (productSwapMessage && productSwapMessage.type === 'error') {
      swapProductMessage = (
        <Message
          key="edit-quantity-message"
          title={this.props.productSwapMessage.message}
          type={this.props.productSwapMessage.type}
          dismissable
          onDismissClick={this.dismissMessage}
        />
      );
    }

    if (order.has_prepaid || order.order_hooks.length > 0 || this.state.swapping) {
      return (
        <SubscriptionContentBlock
          titleTranslationKey="order_products_title"
        >
          {swapProductMessage}
          {productList}
        </SubscriptionContentBlock>
      );
    }

    if (order.build_a_box) {
      return (
        <SubscriptionContentBlock
          titleTranslationKey="order_products_title"
        >
          {editQuantityMessage}
          {productList}
        </SubscriptionContentBlock>
      );
    }
    return (
      <SubscriptionContentBlock
        titleTranslationKey="order_products_title"
        editTitleTranslationKey="edit_quantity_button_text"
        editOnClick={this.toggleEditing}
      >
        {editQuantityMessage}
        {swapProductMessage}
        {productList}
      </SubscriptionContentBlock>
    );
  }
}

OrderProductsBlock.propTypes = {
  order: ORDER_PROP_TYPE.isRequired,
  productQuantityMessage: MESSAGE_PROP_TYPE,
  productSwapMessage: MESSAGE_PROP_TYPE,
  dismissProductQuantityMessage: PropTypes.func.isRequired,
  dismissProductSwapMessage: PropTypes.func.isRequired,
  getSwapProducts: PropTypes.func.isRequired,
};

OrderProductsBlock.defaultProps = {
  productQuantityMessage: null,
  productSwapMessage: null,
};

const mapStateToProps = (state, ownProps) => ({
  order: state.data.orders.find(order => order.id === ownProps.orderId),
  productQuantityMessage: state.userInterface.productQuantityMessages[ownProps.orderId],
  productSwapMessage: state.userInterface.productSwapMessages[ownProps.orderId],
});

const mapDispatchToProps = dispatch => ({
  dismissProductQuantityMessage: (orderId, productId) => {
    dispatch(actions.dismissProductQuantityMessage(orderId, productId));
  },
  dismissProductSwapMessage: (orderId, productId) => {
    dispatch(actions.dismissProductSwapMessage(orderId, productId));
  },
  getSwapProducts: (orderId, productId, groupId) => {
    dispatch(actions.orderProductGetSwap(orderId, productId, groupId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderProductsBlock);
