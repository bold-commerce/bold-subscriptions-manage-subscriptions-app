import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import ProductImages from './ProductImages';
import Separator from './Separator';
import Translation from '../Translation';
import Message from './Message';
import UpdateOrderShippingMethod from './UpdateOrderShippingMethod';
import formatMoney from '../../helpers/moneyFormatHelpers';
import ProductTitleTranslation from './ProductTitleTranslation';
import StripeAuthenticateCharge from './StripeAuthenticateCharge';
import BraintreeAuthenticateCardForm from './BraintreeAuthenticateCardForm';

class OrderProductSwapConfirm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      shippingRate: null,
    };

    this.dismissMessage = this.dismissMessage.bind(this);
    this.saveFromUpdateShippingMethod = this.saveFromUpdateShippingMethod.bind(this);
    this.onChangeShippingMethod = this.onChangeShippingMethod.bind(this);
    this.cancelShippingRates = this.cancelShippingRates.bind(this);
    this.getShippingMethodInfo = this.getShippingMethodInfo.bind(this);
    this.onAuthSuccess = this.onAuthSuccess.bind(this);
    this.onAuthError = this.onAuthError.bind(this);

    this.props.dismissProductSwapMessage(props.order.id);
    this.props.dismissGetShippingRatesFailedMessage(props.order.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.productSwapMessage) {
      if (nextProps.productSwapMessage.type === 'success' ||
        ((nextProps.productSwapMessage.type === 'error') && typeof nextProps.productSwapMessage.token === 'undefined')) {
        this.props.toggleSwap();
      }
    }
  }

  onChangeShippingMethod(shippingMethod) {
    this.setState({
      shippingRate: shippingMethod,
    });
  }

  /* eslint-disable class-methods-use-this */
  onAuthStart() {
    // Nothing required.
  }
  /* eslint-enable class-methods-use-this */

  onAuthSuccess(paymentId) {
    const {
      order, group, swapProduct, product, saveSwapProduct, variant,
    } = this.props;

    const shippingMethod = this.state.shippingRate;

    saveSwapProduct(
      order.id,
      group.id,
      swapProduct.id,
      product.product_id,
      variant.id,
      shippingMethod,
      paymentId,
    );
  }

  onAuthError(error) {
    if (!error) {
      return;
    }

    // Wipe out the "requires authentication" token.
    // This will "reset" the authentication component.
    this.props.productSwapMessage.token = null;

    this.setState({
      // eslint-disable-next-line react/no-unused-state
      updatingShippingMethod: false,
      authError: error,
    });
  }

  getPrepaidShippingTotal() {
    const { order } = this.props;
    let shippingTotal = 0;
    if (this.state.shippingRate !== null &&
      this.state.shippingRate.price - order.order_shipping_rate.price > 0) {
      shippingTotal = ((this.state.shippingRate.price - order.order_shipping_rate.price)
        * 100 * (order.order_fixed_recurrences.total_recurrences -
        order.order_fixed_recurrences.recurrence_count));
    }

    return shippingTotal;
  }

  getShippingMethodInfo() {
    const { product, variant, swapProduct } = this.props;
    return {
      product_internal_id: swapProduct.id,
      product_id: product.product_id,
      variant_id: variant.id,
    };
  }

  cancelShippingRates() {
    this.dismissMessage();
    this.props.toggleSwap();
  }

  dismissMessage() {
    const { order } = this.props;
    this.props.dismissProductSwapMessage(order.id);
    this.props.dismissGetShippingRatesFailedMessage(order.id);
  }

  saveFromUpdateShippingMethod(shippingMethod) {
    const {
      order, group, swapProduct, product, saveSwapProduct, variant,
    } = this.props;

    saveSwapProduct(
      order.id,
      group.id,
      swapProduct.id,
      product.product_id,
      variant.id,
      shippingMethod,
    );
  }

  render() {
    const {
      product, variant, order, allowMulticurrencyDisplay,
    } = this.props;
    const exchangeRate = [0, 1, '', null].indexOf(order.currency_exchange_rate) === -1 && allowMulticurrencyDisplay ? order.currency_exchange_rate : 1;
    const currencyFormat = !allowMulticurrencyDisplay ? null : order.currency_format;
    const price = variant.price * exchangeRate;

    let swapProductMessage = null;
    if (variant.price_difference > 0) {
      const priceDifference = variant.price_difference * exchangeRate;
      swapProductMessage = (
        <p>
          <Translation
            textKey="order_product_swap_future_charge"
            mergeFields={{
              price_difference: formatMoney(
                priceDifference, currencyFormat,
              ),
            }}
          />
        </p>
      );

      if (order.order_fixed_recurrences !== null
        && !order.order_fixed_recurrences.recur_after_limit) {
        swapProductMessage = (
          <p>
            <Translation
              textKey="order_product_swap_limited_length_charge"
              mergeFields={{
                price_difference: formatMoney(
                  priceDifference, currencyFormat,
                ),
                recurrences_remaining: order.order_fixed_recurrences.total_recurrences
                - order.order_fixed_recurrences.recurrence_count,
              }}
            />
          </p>
        );
      }
      if (order.order_fixed_recurrences !== null && order.order_fixed_recurrences.one_charge_only) {
        const prepaidPriceDifference = variant.prepaid_price_difference * exchangeRate;
        const shippingDifference = this.state.shippingRate !== null ?
          (this.state.shippingRate.price - order.order_shipping_rate.price) * exchangeRate * 100 :
          null;
        const shippingTotal = this.getPrepaidShippingTotal() * exchangeRate;

        swapProductMessage = (
          <Fragment>
            <Translation
              textKey="order_product_swap_prepaid_charge"
              mergeFields={{
                price_difference: formatMoney(
                  priceDifference, currencyFormat,
                ),
                recurrences_remaining: order.order_fixed_recurrences.total_recurrences
                - order.order_fixed_recurrences.recurrence_count,
                prepaid_additional_charge: formatMoney(
                  prepaidPriceDifference, currencyFormat,
                ),
              }}
            />
            {
              this.state.shippingRate !== null &&
              this.state.shippingRate.price - order.order_shipping_rate.price > 0 ?
                <Fragment>
                  <br />
                  <Translation
                    textKey="swap_product_prepaid_shipping_text"
                    mergeFields={{
                      recurrences_remaining: order.order_fixed_recurrences.total_recurrences
                      - order.order_fixed_recurrences.recurrence_count,
                      shipping_difference: formatMoney(
                        shippingDifference,
                        currencyFormat,
                      ),
                      shipping_total: formatMoney(
                        shippingTotal,
                        currencyFormat,
                      ),
                    }}
                  />
                </Fragment> : null
            }
          </Fragment>
        );
      }
    }

    let authenticateCardComponent = null;
    if (this.props.productSwapMessage && this.props.productSwapMessage.token) {
      switch (this.props.gatewayName) {
        case 'stripe': {
          authenticateCardComponent = (
            <StripeAuthenticateCharge
              orderId={order.id}
              onAuthSuccess={this.onAuthSuccess}
            />
          );
          break;
        }
        case 'braintree': {
          authenticateCardComponent = (
            <BraintreeAuthenticateCardForm
              orderId={order.id}
              onStart={this.onAuthStart}
              onSuccess={this.onAuthSuccess}
              onError={this.onAuthError}
              buttonAlignment="right"
            />
          );
          break;
        }
        default: {
          authenticateCardComponent = null;
          break;
        }
      }
    }

    return (
      <Fragment>
        <Separator icon="&#8633;" textKey="order_product_swap_separator" key={`order-${order.id}`} />
        <div className="order-product">
          <div className="flex-column flex-column-quarter">
            <ProductImages products={[product]} />
          </div>
          <div className="flex-column flex-column-three-quarters">
            <div className="order-product-details">
              <div className="flex-column flex-column-three-quarters">
                <div className="subscription-details-block">
                  <p>
                    <ProductTitleTranslation
                      productTitle={product.shopify_data.title || ''}
                      variantTitle={variant.title || ''}
                    />
                  </p>
                  <p>
                    <span
                      className="product-info-price"
                      dangerouslySetInnerHTML={{ __html: formatMoney(price, currencyFormat) }}
                    />
                  </p>
                  {swapProductMessage}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="align-right order-product-edit-shipping-rates">
          <UpdateOrderShippingMethod
            order={order}
            orderId={order.id}
            saveOnClick={this.saveFromUpdateShippingMethod}
            cancelOnClick={this.cancelShippingRates}
            formInformation={this.getShippingMethodInfo()}
            onChange={this.onChangeShippingMethod}
          >
            {
              order.order_fixed_recurrences !== null &&
              (variant.prepaid_price_difference > 0 ||
                this.getPrepaidShippingTotal() > 0) ?
                  <div className="align-right product-swap-total">
                    <h6>
                      <Translation
                        textKey="swap_product_prepaid_total_text"
                        mergeFields={{
                          total_prepaid_charges: formatMoney(
                              (variant.prepaid_price_difference + this.getPrepaidShippingTotal())
                              * exchangeRate,
                            order.currency_format,
                          ),
                        }}
                      />
                    </h6>
                  </div> : null
            }
          </UpdateOrderShippingMethod>
        </div>
        {authenticateCardComponent}
        {this.state.authError ? <Message type="error">{this.state.authError}</Message> : null}
      </Fragment>
    );
  }
}

OrderProductSwapConfirm.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.number.isRequired,
    currency_format: PropTypes.string,
    currency_exchange_rate: PropTypes.string,
    order_shipping_rate: PropTypes.shape({
      price: PropTypes.string,
    }),
    order_fixed_recurrences: PropTypes.shape({
      total_recurrences: PropTypes.number,
      recurrence_count: PropTypes.number,
      recur_after_limit: PropTypes.number,
      one_charge_only: PropTypes.number,
    }),
  }),
  product: PropTypes.shape({
    product_id: PropTypes.number.isRequired,
    shopify_data: PropTypes.shape().isRequired,
  }).isRequired,
  group: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
  swapProduct: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  variant: PropTypes.shape().isRequired,
  saveSwapProduct: PropTypes.func.isRequired,
  toggleSwap: PropTypes.func.isRequired,
  productSwapMessage: PropTypes.shape({
    message: PropTypes.string,
    messageTextKey: PropTypes.string,
    type: PropTypes.string,
    token: PropTypes.string,
  }),
  dismissProductSwapMessage: PropTypes.func.isRequired,
  dismissGetShippingRatesFailedMessage: PropTypes.func.isRequired,
  allowMulticurrencyDisplay: PropTypes.bool.isRequired,
  gatewayName: PropTypes.string,
};

OrderProductSwapConfirm.defaultProps = {
  order: PropTypes.shape({
    id: null,
  }),
  group: PropTypes.shape({
    products_with_price_difference: null,
  }),
  productSwapMessage: null,
  gatewayName: '',
};

const mapStateToProps = (state, ownProps) => {
  const order = state.data.orders.find(o => o.id === ownProps.orderId);
  const group = state.data.groups.find(g => g.id === ownProps.groupId);
  const product = group.products_with_price_difference.find(
    p => p.product_id === ownProps.productId,
  );
  const swapProduct = order.order_products.find(p => p.id === ownProps.swapProductId);
  const variant = product.shopify_data.variants.find(v => v.id === ownProps.variantId);

  const gatewayName = state.data.general_settings.gateway_name;
  return {
    order,
    group,
    product,
    swapProduct,
    variant,
    getShippingRatesFailedMessage:
      state.userInterface.getShippingRatesFailedMessage[ownProps.orderId],
    shippingRates:
      state.userInterface.shippingRates[ownProps.orderId],
    productSwapMessage:
      state.userInterface.productSwapMessages[ownProps.orderId],
    allowMulticurrencyDisplay: state.data.general_settings.allow_multicurrency_display,
    gatewayName,
  };
};

const mapDispatchToProps = dispatch => ({
  saveSwapProduct: (
    orderId, groupId, internalProductId, productId, variantId, orderShippingRate, paymentId,
  ) => {
    dispatch(actions.orderProductSaveSwap(
      orderId, groupId, internalProductId, productId, variantId, orderShippingRate, paymentId,
    ));
  },
  dismissProductSwapMessage: (orderId, productId) => {
    dispatch(actions.dismissProductSwapMessage(orderId, productId));
  },
  dismissGetShippingRatesFailedMessage: (orderId) => {
    dispatch(actions.dismissGetShippingRatesFailedMessage(orderId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderProductSwapConfirm);
