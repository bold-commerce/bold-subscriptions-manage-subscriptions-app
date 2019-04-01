import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import ProductImages from './ProductImages';
import LoadingSpinner from './LoadingSpinner';
import Separator from './Separator';
import Translation from '../Translation';
import UpdateOrderShippingMethod from './UpdateOrderShippingMethod';
import formatMoney from '../../helpers/moneyFormatHelpers';
import generateFakeShippingRate from '../../helpers/shippingRateHelpers';

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

    this.props.dismissProductSwapMessage(props.order.id);
    this.props.dismissGetShippingRatesFailedMessage(props.order.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.productSwapMessage) {
      if (nextProps.productSwapMessage.type === 'success' ||
        nextProps.productSwapMessage.type === 'error') {
        this.props.toggleSwap();
      }
    }
  }

  onChangeShippingMethod(shippingMethod) {
    this.setState({
      shippingRate: shippingMethod,
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
    const { product, variant, order } = this.props;

    let swapProductMessage = null;
    if (variant.price_difference > 0) {
      swapProductMessage = (
        <p>
          <Translation
            textKey="order_product_swap_future_charge"
            mergeFields={{
              price_difference: formatMoney(
                variant.price_difference,
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
                  variant.price_difference,
                ),
                recurrences_remaining: order.order_fixed_recurrences.total_recurrences
                - order.order_fixed_recurrences.recurrence_count,
              }}
            />
          </p>
        );
      }
      if (order.order_fixed_recurrences !== null && order.order_fixed_recurrences.one_charge_only) {
        swapProductMessage = (
          <Fragment>
            <Translation
              textKey="order_product_swap_prepaid_charge"
              mergeFields={{
                price_difference: formatMoney(
                  variant.price_difference,
                ),
                recurrences_remaining: order.order_fixed_recurrences.total_recurrences
                - order.order_fixed_recurrences.recurrence_count,
                prepaid_additional_charge: formatMoney(
                  variant.prepaid_price_difference,
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
                        (this.state.shippingRate.price - order.order_shipping_rate.price) * 100,
                      ),
                      shipping_total: formatMoney(
                        this.getPrepaidShippingTotal(),
                      ),
                    }}
                  />
                </Fragment> : null
            }
          </Fragment>
        );
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
                    <Translation
                      textKey="product_with_variant_title"
                      mergeFields={{
                        product_title: product.shopify_data.title || '',
                        variant_title: variant.title || '',
                      }}
                    />
                  </p>
                  <p>
                  <span className="product-info-price" dangerouslySetInnerHTML={{
                    __html: formatMoney(variant.price)}} />
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
                            variant.prepaid_price_difference + this.getPrepaidShippingTotal(),
                          ),
                        }}
                      />
                    </h6>
                  </div> : null
            }
          </UpdateOrderShippingMethod>
        </div>
      </Fragment>
    );
  }
}

OrderProductSwapConfirm.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
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
  }),
  dismissProductSwapMessage: PropTypes.func.isRequired,
  dismissGetShippingRatesFailedMessage: PropTypes.func.isRequired,
};

OrderProductSwapConfirm.defaultProps = {
  group: PropTypes.shape({
    products_with_price_difference: null,
  }),
  productSwapMessage: null,
};

const mapStateToProps = (state, ownProps) => {
  const order = state.data.orders.find(o => o.id === ownProps.orderId);
  const group = state.data.groups.find(g => g.id === ownProps.groupId);
  const product = group.products_with_price_difference.find(
    p => p.product_id === ownProps.productId,
  );
  const swapProduct = order.order_products.find(p => p.id === ownProps.swapProductId);
  const variant = product.shopify_data.variants.find(v => v.id === ownProps.variantId);

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
  };
};

const mapDispatchToProps = dispatch => ({
  saveSwapProduct: (
    orderId, groupId, internalProductId, productId, variantId, orderShippingRate,
  ) => {
    dispatch(actions.orderProductSaveSwap(
      orderId, groupId, internalProductId, productId, variantId, orderShippingRate,
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
