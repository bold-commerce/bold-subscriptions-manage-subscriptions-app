import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getQuantity } from '../../helpers/validationHelpers';

import * as actions from '../../actions';

import Translation from '../Translation';
import OrderProductEditQuantityItem from './OrderProductEditQuantityItem';
import UpdateOrderShippingMethod from './UpdateOrderShippingMethod';
import Message from './Message';
import Button from './Button';
import ButtonGroup from './ButtonGroup';
import { ORDER_PROP_TYPE, MESSAGE_PROP_TYPE } from '../../constants/PropTypes';
import formatMoney from '../../helpers/moneyFormatHelpers';

class OrderProductEditQuantityBlock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isUpdateButtonDisabled: true,
      updatingQuantity: false,
      dismissConflict: false,
      orderProducts: {},
      subtotal: this.calculateInitalSubtotal(),
    };

    this.saveQuantity = this.saveQuantity.bind(this);
    this.onChangeValidate = this.onChangeValidate.bind(this);
    this.onBlurValidate = this.onBlurValidate.bind(this);
    this.dismissMessage = this.dismissMessage.bind(this);
    this.saveFromUpdateShippingMethod = this.saveFromUpdateShippingMethod.bind(this);
    this.calculateSubtotal = this.calculateSubtotal.bind(this);
    this.cancelShippingRates = this.cancelShippingRates.bind(this);
    this.calculateLineSubtotal = this.calculateLineSubtotal.bind(this);
    this.shippingMethodInfo = this.shippingMethodInfo.bind(this);
    this.formElement = null;

    this.props.dismissProductQuantityMessage(this.props.order.id);
    this.props.dismissProductUpcomingQuantityMessage(this.props.order.id);
    this.props.dismissGetShippingRatesFailedMessage(this.props.order.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.productQuantityMessage || nextProps.productUpcomingQuantityMessage) {
      if ((nextProps.productQuantityMessage && nextProps.productQuantityMessage.type === 'success')
        || (nextProps.productUpcomingQuantityMessage && nextProps.productUpcomingQuantityMessage.type === 'success')) {
        this.props.toggleEdit();
      } else {
        this.setState({
          isUpdateButtonDisabled: false,
        });
      }
      this.setState({
        updatingQuantity: false,
      });
    }
    if (nextProps.getShippingRatesFailedMessage) {
      this.setState({
        dismissConflict: true,
      });
    }
  }

  onChangeValidate(e) {
    const { target: { value } } = e;

    if (value !== '' && value !== ' ' && value > -1 && this.hasMinOrderQuantity()) {
      this.setState({
        isUpdateButtonDisabled: false,
        dismissConflict: true,
      });
    } else {
      this.setState({
        isUpdateButtonDisabled: true,
        dismissConflict: true,
      });
    }
    this.calculateSubtotal();
  }

  onBlurValidate(e) {
    const { target: { value } } = e;

    if (value === '' || value === ' ' || value < 0) {
      e.target.value = 0;
      this.onChangeValidate(e);
    }
  }

  hasMinOrderQuantity() {
    const { order, orderDate } = this.props;
    const inputData = new FormData(this.formElement);

    let result = false;
    if (orderDate === null) {
      for (let i = 0; i < order.order_products.length; i += 1) {
        const value = parseInt(inputData.get(`product_editing_quantity_${order.order_products[i].id}`), 10);
        if (value > 0 && !Number.isNaN(value)) {
          result = true;
        }
      }
    } else {
      result = true;
    }

    return result;
  }

  calculateInitalSubtotal() {
    const { order, orderDate } = this.props;
    const productTotals = order.order_products.map((prod) => {
      const qty = orderDate !== null &&
      order.order_product_exceptions.find(exception => exception.date === orderDate) &&
      order.order_product_exceptions.find(exception => exception.date === orderDate)
        .products.find(product => product.product_internal_id === prod.id)
        ? order.order_product_exceptions.find(exception => exception.date === orderDate)
          .products.find(product => product.product_internal_id === prod.id).quantity
        : prod.quantity;
      const basePrice = (prod.converted_price > 0 ? (prod.converted_price / 100).toFixed(2).toString() : prod.price);

      return parseFloat(basePrice * parseInt(qty, 10));
    });
    return 100 * productTotals.reduce((a, b) => parseFloat(a + b));
  }

  calculateSubtotal() {
    const { order } = this.props;
    const inputData = new FormData(this.formElement);
    const productTotals = order.order_products.map((prod) => {
      const basePrice = (prod.converted_price > 0 ? (prod.converted_price / 100).toFixed(2).toString() : prod.price);

      return parseFloat(basePrice * getQuantity(parseInt(inputData.get(`product_editing_quantity_${prod.id}`), 10)));
    });
    const subtotal = 100 * productTotals.reduce((a, b) => parseFloat(a + b));
    this.setState({ subtotal });
  }

  calculateLineSubtotal(id, price, quantity) {
    let multiplier = quantity;
    if (this.formElement !== null) {
      const inputData = new FormData(this.formElement);
      multiplier = getQuantity(parseInt(inputData.get(`product_editing_quantity_${id}`), 10));
    }

    return 100 * (price * multiplier);
  }

  cancelShippingRates() {
    this.dismissMessage();
    this.setState({
      updatingQuantity: false,
    });
    this.props.toggleEdit();
  }

  dismissMessage() {
    const { order } = this.props;

    this.props.dismissProductQuantityMessage(order.id);
    this.props.dismissProductUpcomingQuantityMessage(order.id);
    this.props.dismissGetShippingRatesFailedMessage(order.id);
    this.setState({
      dismissConflict: false,
    });
  }

  saveFromUpdateShippingMethod(shippingMethod) {
    const { order, orderDate } = this.props;
    if (this.props.orderDate !== null) {
      this.props.updateUpcomingQuantity(
        order.id,
        this.state.orderProducts,
        orderDate,
        shippingMethod,
      );
    } else {
      this.props.updateQuantity(
        this.props.orderId,
        this.state.orderProducts,
        shippingMethod,
      );
    }
  }

  saveQuantity(e) {
    const { order, orderDate } = this.props;
    const inputData = new FormData(this.formElement);

    this.dismissMessage();

    e.preventDefault();
    const products = order.order_products.map(prod => (
      {
        product_internal_id: prod.id,
        quantity: inputData.get(`product_editing_quantity_${prod.id}`),
        is_deleted: false,
      }
    ));

    const orderProducts = { order_products: products };
    this.setState({
      isUpdateButtonDisabled: true,
      updatingQuantity: true,
      orderProducts,
    });

    if (orderDate !== null) {
      this.props.updateUpcomingQuantity(
        order.id,
        orderProducts,
        orderDate,
        order.order_shipping_rate,
      );
    } else {
      this.props.updateQuantity(
        order.id,
        orderProducts,
        order.order_shipping_rate,
      );
    }
  }

  shippingMethodInfo() {
    return {
      order_products:
        this.state.orderProducts.order_products ?
          JSON.stringify(this.state.orderProducts.order_products).toString() : {},
    };
  }

  render() {
    const { order, orderDate } = this.props;

    return (
      <div className="order-product-edit">
        <div className="order-product-edit-header">
          <div className="flex-column flex-column-fifteen order-product-edit-images" />
          <div className="flex-column flex-column-half">
            <h5><Translation textKey="product_editing_details" /></h5>
          </div>
          <div className="flex-column flex-column-fifteen order-product-edit-quantity">
            <h5><Translation textKey="product_editing_quantity" /></h5>
          </div>
          <div className="flex-column flex-column-twenty order-product-edit-line-subtotal">
            <h5><Translation textKey="product_editing_line_total" /></h5>
          </div>
        </div>
        <form
          onSubmit={this.saveQuantity}
          ref={(el) => {
            this.formElement = el;
          }}
        >
          {
            order.order_products.map(d => (
              <OrderProductEditQuantityItem
                orderId={order.id}
                productId={d.id}
                orderDate={orderDate}
                key={`${order.id}-prod-${d.id}`}
                calculateLineSubtotal={this.calculateLineSubtotal}
                onChangeValidate={this.onChangeValidate}
                onBlurValidate={this.onBlurValidate}
              />
            ))}
          <div className="order-product-subtotal">
            <h6>
              <Translation textKey="product_editing_subtotal" />
              <span
                className="product-info-price"
                dangerouslySetInnerHTML={{ __html: formatMoney(this.state.subtotal, order.currency_format) }}
              />
            </h6>
          </div>
          {
            (!this.state.dismissConflict && this.props.productQuantityMessage && this.props.productQuantityMessage.type === 'conflict') ?
              null
              :
              <p className="order-product-shipping-rates-desc">
                <Translation textKey="product_editing_shipping_rates_desc" />
              </p>
          }
          {
            this.props.productQuantityMessage && this.props.productQuantityMessage.type === 'error' ?
              <div className="order-product-edit-message">
                <Message
                  key="product-quantity-message"
                  title={this.props.productQuantityMessage.message}
                  titleTextKey={this.props.productQuantityMessage.messageTextKey}
                  type={this.props.productQuantityMessage.type}
                  dismissable
                  onDismissClick={this.dismissMessage}
                />
              </div>
              : null
          }
          {
            this.props.getShippingRatesFailedMessage ?
              <div className="order-product-edit-message">
                <Message
                  key="shipping-rates-message"
                  title={this.props.getShippingRatesFailedMessage.message}
                  titleTextKey={this.props.getShippingRatesFailedMessage.messageTextKey}
                  type={this.props.getShippingRatesFailedMessage.type}
                  dismissable
                  onDismissClick={this.dismissMessage}
                />
              </div>
              : null
          }
          {
            (!this.state.dismissConflict && this.props.productQuantityMessage && this.props.productQuantityMessage.type === 'conflict') ?
              null
              :
              <ButtonGroup align="right">
                <Button
                  textKey="update_quantity_button_text"
                  type="submit"
                  disabled={this.state.isUpdateButtonDisabled}
                  loading={this.state.updatingQuantity}
                />
                <Button
                  textKey="cancel_button_text"
                  className=""
                  onClick={() => this.props.toggleEdit()}
                  btnStyle="secondary"
                />
              </ButtonGroup>
          }
        </form>
        {
          (!this.state.dismissConflict && this.props.productQuantityMessage && this.props.productQuantityMessage.type === 'conflict') ?
            <div className="align-right order-product-edit-shipping-rates">
              <UpdateOrderShippingMethod
                order={order}
                orderId={this.props.orderId}
                saveOnClick={this.saveFromUpdateShippingMethod}
                cancelOnClick={this.cancelShippingRates}
                formInformation={this.shippingMethodInfo()}
              />
            </div>
            : null
        }
      </div>
    );
  }
}

OrderProductEditQuantityBlock.propTypes = {
  toggleEdit: PropTypes.func.isRequired,
  order: ORDER_PROP_TYPE.isRequired,
  orderId: PropTypes.number.isRequired,
  orderDate: PropTypes.string,
  productQuantityMessage: MESSAGE_PROP_TYPE,
  dismissProductQuantityMessage: PropTypes.func.isRequired,
  productUpcomingQuantityMessage: MESSAGE_PROP_TYPE,
  dismissProductUpcomingQuantityMessage: PropTypes.func.isRequired,
  updateQuantity: PropTypes.func.isRequired,
  updateUpcomingQuantity: PropTypes.func.isRequired,
  getShippingRatesFailedMessage: MESSAGE_PROP_TYPE,
  dismissGetShippingRatesFailedMessage: PropTypes.func.isRequired,
};

OrderProductEditQuantityBlock.defaultProps = {
  productQuantityMessage: null,
  productUpcomingQuantityMessage: null,
  getShippingRatesFailedMessage: null,
  orderDate: null,
};

const mapStateToProps = (state, ownProps) => ({
  order: state.data.orders.find(order => order.id === ownProps.orderId),
  productQuantityMessage: state.userInterface.productQuantityMessages[ownProps.orderId],
  productUpcomingQuantityMessage:
    state.userInterface.productUpcomingQuantityMessages[ownProps.orderId],
  getShippingRatesFailedMessage:
    state.userInterface.getShippingRatesFailedMessage[ownProps.orderId],
  shippingRates: state.userInterface.shippingRates[ownProps.orderId],
});

const mapDispatchToProps = dispatch => ({
  updateQuantity: (orderId, products, orderShippingRate) => {
    dispatch(actions.orderProductUpdateQuantity(orderId, products, orderShippingRate));
  },
  updateUpcomingQuantity: (orderId, products, orderDate, orderShippingRate) => {
    dispatch(actions.orderProductUpdateUpcomingQuantity(
      orderId, products, orderDate, orderShippingRate,
    ));
  },
  dismissProductQuantityMessage: (orderId, productId) => {
    dispatch(actions.dismissProductQuantityMessage(orderId, productId));
  },
  dismissProductUpcomingQuantityMessage: (orderId, productId) => {
    dispatch(actions.dismissProductUpcomingQuantityMessage(orderId, productId));
  },
  dismissGetShippingRatesFailedMessage: (orderId) => {
    dispatch(actions.dismissGetShippingRatesFailedMessage(orderId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderProductEditQuantityBlock);
