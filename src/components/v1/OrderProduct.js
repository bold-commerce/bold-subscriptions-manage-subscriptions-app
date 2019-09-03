import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as actions from '../../actions';

import ProductImages from './ProductImages';
import UpdateOrderShippingMethod from './UpdateOrderShippingMethod';
import Button from './Button';
import Translation from '../Translation';
import formatMoney from '../../helpers/moneyFormatHelpers';
import { safeParseJson } from '../../helpers/validationHelpers';
import ButtonGroup from './ButtonGroup';
import { ORDER_PROP_TYPE, MESSAGE_PROP_TYPE, PRODUCT_PROP_TYPE } from '../../constants/PropTypes';
import ProductTitleTranslation from './ProductTitleTranslation';

class OrderProduct extends Component {
  constructor(props) {
    super(props);

    this.state = {
      removingProduct: false,
      isRemoveButtonDisabled: false,
      dismissConflict: false,
      orderProducts: {},
    };

    this.dismissMessage = this.dismissMessage.bind(this);
    this.toggleSwapOnClick = this.toggleSwapOnClick.bind(this);
    this.toggleEditingOnClick = this.toggleEditingOnClick.bind(this);
    this.toggleRemoveProduct = this.toggleRemoveProduct.bind(this);
    this.toggleEditingFrequencyOnClick = this.toggleEditingFrequencyOnClick.bind(this);
    this.cancelShippingMethod = this.cancelShippingMethod.bind(this);
    this.removeProductOnClick = this.removeProductOnClick.bind(this);
    this.removeProductFromShippingMethod = this.removeProductFromShippingMethod.bind(this);

    this.props.dismissProductRemoveMessage(props.product.id);
    this.props.dismissGetShippingRatesFailedMessage(props.order.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.productRemoveMessage) {
      if (nextProps.productRemoveMessage.type === 'success') {
        this.toggleRemoveProduct();
      } else {
        this.setState({
          isRemoveButtonDisabled: false,
        });
      }
      this.setState({
        removingProduct: false,
      });
    }
    if (nextProps.getShippingRatesFailedMessage) {
      this.setState({
        dismissConflict: true,
      });
    }
  }

  toggleSwapOnClick() {
    this.props.toggleSwap(
      this.props.order.id,
      this.props.product.id,
      this.props.product.properties_group_id,
    );
  }

  toggleEditingOnClick() {
    this.props.toggleEdit();
  }

  toggleEditingFrequencyOnClick() {
    this.props.toggleEditFrequency();
  }

  toggleRemoveProduct() {
    this.setState({
      removingProduct: !this.state.removingProduct,
      dismissConflict: true,
    });
  }

  cancelShippingMethod() {
    this.setState({
      removingProduct: false,
      dismissConflict: true,
    });
  }

  dismissMessage() {
    const { order, product } = this.props;

    this.props.dismissProductRemoveMessage(product.id);
    this.props.dismissGetShippingRatesFailedMessage(order.id);
    this.setState({
      dismissConflict: false,
    });
  }

  removeProductFromShippingMethod(shippingMethod) {
    this.props.removeProduct(
      this.props.orderId,
      this.state.orderProducts,
      shippingMethod,
    );
  }

  removeProductOnClick() {
    const { order, product } = this.props;

    this.dismissMessage();
    const products = [{
      product_internal_id: product.id,
      quantity: 0,
      is_deleted: true,
    }];

    const orderProducts = { order_products: products };

    this.setState({
      isRemoveButtonDisabled: true,
      removingProduct: true,
      orderProducts,
    });

    this.props.dismissProductRemoveMessage(product.id);
    this.props.removeProduct(
      order.id,
      orderProducts,
      order.order_shipping_rate,
    );
  }

  shippingMethodInfo() {
    return {
      order_products:
        this.state.orderProducts.order_products ?
          JSON.stringify(this.state.orderProducts.order_products).toString() : {},
    };
  }

  renderProductTitle() {
    const { product } = this.props;

    if (product.variant_title) {
      return (
        <p>
          <ProductTitleTranslation
            productTitle={product.product_title || ''}
            variantTitle={product.variant_title || ''}
          />
        </p>
      );
    }
    return (
      <p>
        <Translation
          textKey="product_without_variant_title"
          mergeFields={{
            product_title: product.product_title || '',
          }}
        />
      </p>
    );
  }

  renderProductProperties() {
    const { disallowedLineItemProperties, product, order } = this.props;
    const lineItemProperties = product.properties !== null
      && safeParseJson(product.properties);
    if (lineItemProperties) {
      return Object.entries(lineItemProperties).map((property) => {
        if (!disallowedLineItemProperties.includes(property[0]) && property[0].charAt(0) !== '_' && typeof property[1] === 'string') {
          return (
            <p key={`${order.id}-${product.id}-${property[0]}`} >
              {property[0]}: {property[1]}
              {property[0] === 'delivery_frequency' && (
                <span onClick={this.toggleEditingFrequencyOnClick}>
                  <img
                    className="edit-btn"
                    src="https://img.icons8.com/ultraviolet/40/000000/pencil.png"
                    alt="edit_icon"
                  />
                </span>
              )}
            </p>
          );
        }
        return null;
      });
    }
    return null;
  }

  render() {
    const {
      order, product, group, productRemoveMessage, allowMulticurrencyDisplay,
    } = this.props;
    let removeButtons;
    const exchangeRate = [0, 1, '', null].indexOf(order.currency_exchange_rate) === -1 && allowMulticurrencyDisplay ? order.currency_exchange_rate : 1;
    const currencyFormat = !allowMulticurrencyDisplay ? null : order.currency_format;
    const price = (exchangeRate * product.price) * 100;

    if (order.order_hooks.length > 0) {
      removeButtons = null;
    } else if (!this.state.dismissConflict && productRemoveMessage && productRemoveMessage.type === 'conflict') {
      removeButtons = (
        <div className="align-left order-product-remove-shipping-rates">
          <UpdateOrderShippingMethod
            order={order}
            orderId={this.props.orderId}
            saveOnClick={this.removeProductFromShippingMethod}
            cancelOnClick={this.cancelShippingMethod}
            formInformation={this.shippingMethodInfo()}
          />
        </div>
      );
    } else if (this.state.removingProduct) {
      removeButtons = (
        <div className="order-product-remove align-right">
          <p className="order-product-remove-message">
            <Translation textKey="product_remove_confirm_message" />
          </p>
          <div className="order-product-remove-buttons">
            <ButtonGroup>
              <Button
                textKey="remove_product_button_text"
                className=""
                type="submit"
                loading={this.state.isRemoveButtonDisabled}
                disabled={this.state.isRemoveButtonDisabled}
                onClick={this.removeProductOnClick}
              />
              <Button
                textKey="cancel_button_text"
                className=""
                onClick={this.toggleRemoveProduct}
                btnStyle="secondary"
              />
            </ButtonGroup>
          </div>
        </div>
      );
    } else {
      removeButtons = (
        <div className="order-product-action-buttons flex-column align-left">
          {
            group && group.is_swap_enabled ?
              <p>
                <Button
                  textKey="swap_product_button_text"
                  onClick={this.toggleSwapOnClick}
                  btnStyle="link"
                />
              </p>
              : null
          }
          {
            order.order_products.length === 1 || order.has_prepaid ? null :
            <p>
              <Button
                textKey="remove_product_button_text"
                onClick={this.toggleRemoveProduct}
                btnStyle="alert-link"
              />
            </p>
          }
        </div>
      );
    }

    return (
      <div className="order-product" >
        <div className="flex-column flex-column-quarter">
          <ProductImages products={[product]} />
        </div>
        <div className="flex-column flex-column-three-quarters">
          <div className="order-product-details">
            <div className="flex-column">
              <div className="subscription-details-block">
                { this.renderProductTitle() }
                { this.renderProductProperties() }
                <p>
                  <span
                    className="product-info-price"
                    dangerouslySetInnerHTML={{ __html: formatMoney(price, currencyFormat) }}
                  />
                </p>
                <p className="editable">
                  <Translation
                    textKey="product_info_quantity"
                    mergeFields={{
                      quantity: product.quantity,
                    }}
                  />
                  <span onClick={this.toggleEditingOnClick}>
                    <img
                      className="edit-btn"
                      src="https://img.icons8.com/ultraviolet/40/000000/pencil.png"
                      alt="edit_icon"
                    />
                  </span>
                </p>
              </div>
            </div>
            {removeButtons}
          </div>
        </div>
      </div>
    );
  }
}

OrderProduct.propTypes = {
  orderId: PropTypes.number.isRequired,
  order: ORDER_PROP_TYPE.isRequired,
  product: PRODUCT_PROP_TYPE.isRequired,
  group: PropTypes.shape({
    id: PropTypes.number.isRequired,
    is_swap_enabled: PropTypes.bool.isRequired,
  }),
  toggleSwap: PropTypes.func,
  toggleEdit: PropTypes.func,
  toggleEditFrequency: PropTypes.func,
  removeProduct: PropTypes.func.isRequired,
  productRemoveMessage: MESSAGE_PROP_TYPE,
  getShippingRatesFailedMessage: MESSAGE_PROP_TYPE,
  dismissProductRemoveMessage: PropTypes.func.isRequired,
  dismissGetShippingRatesFailedMessage: PropTypes.func.isRequired,
  disallowedLineItemProperties: PropTypes.arrayOf(PropTypes.string).isRequired,
  allowMulticurrencyDisplay: PropTypes.bool.isRequired,
};

OrderProduct.defaultProps = {
  toggleSwap: null,
  toggleEdit: null,
  toggleEditFrequency: null,
  productRemoveMessage: null,
  getShippingRatesFailedMessage: null,
  group: null,
  allowMulticurrencyDisplay: 0,
};

const mapStateToProps = (state, ownProps) => {
  const order = state.data.orders.find(o => o.id === ownProps.orderId);
  const product = order.order_products.find(p => p.id === ownProps.productId);
  const group = state.data.groups.find(g => g.id === product.properties_group_id);
  return {
    order,
    product,
    group,
    productRemoveMessage: state.userInterface.productRemoveMessages[ownProps.productId],
    getShippingRatesFailedMessage:
      state.userInterface.getShippingRatesFailedMessage[ownProps.orderId],
    shippingRates: state.userInterface.shippingRates[ownProps.orderId],
    disallowedLineItemProperties: state.data.general_settings.disallowed_line_item_properties,
    allowMulticurrencyDisplay: state.data.general_settings.allow_multicurrency_display,
  };
};

const mapDispatchToProps = dispatch => ({
  removeProduct: (orderId, products, orderShippingRate) => {
    dispatch(actions.orderProductRemove(orderId, products, orderShippingRate));
  },
  dismissProductRemoveMessage: (productId) => {
    dispatch(actions.dismissProductRemoveMessage(productId));
  },
  dismissGetShippingRatesFailedMessage: (orderId) => {
    dispatch(actions.dismissGetShippingRatesFailedMessage(orderId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderProduct);
