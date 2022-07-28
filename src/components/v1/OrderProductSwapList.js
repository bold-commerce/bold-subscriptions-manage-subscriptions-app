import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Button from './Button';
import ProductImages from './ProductImages';
import Translation from '../Translation';
import SelectField from './SelectField';
import formatMoney from '../../helpers/moneyFormatHelpers';
import { ORDER_PROP_TYPE } from '../../constants/PropTypes';
import ProductTitleTranslation from './ProductTitleTranslation';

class OrderProductSwapList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedVariant: props.variants[0],
    };

    this.getVariantOptions = this.getVariantOptions.bind(this);
    this.variantChange = this.variantChange.bind(this);
    this.onClickSwap = this.onClickSwap.bind(this);
  }

  onClickSwap() {
    const { product, confirmSwap } = this.props;

    confirmSwap(
      product.product_id,
      this.state.selectedVariant.id,
    );
  }

  getVariantOptions() {
    const { variants } = this.props;
    const variantOptions = [];

    variants.forEach((variant) => {
      variantOptions.push({
        name: variant.title,
        value: variant.id,
      });
    });

    return variantOptions;
  }

  variantChange(e) {
    const { product } = this.props;
    this.setState({
      selectedVariant: product.shopify_data.variants.find(
        variant => variant.id === parseInt(e.target.value, 10),
      ),
    });
  }

  render() {
    const {
      product,
      variants,
      order,
      allowMulticurrencyDisplay,
    } = this.props;

    let swapProductMessage = null;
    const exchangeRate = [0, 1, '', null].indexOf(order.currency_exchange_rate) === -1
      && allowMulticurrencyDisplay ? order.currency_exchange_rate : 1;
    const currencyFormat = !allowMulticurrencyDisplay ? null : order.currency_format;
    const price = (exchangeRate * this.state.selectedVariant.price);
    const priceDifference = this.state.selectedVariant.price_difference * exchangeRate;
    const prepaidPriceDifference = this.state.selectedVariant.prepaid_price_difference
      * exchangeRate;

    if (this.state.selectedVariant.price_difference > 0) {
      swapProductMessage = (
        <p>
          <Translation
            textKey="order_product_swap_future_charge"
            mergeFields={{
              price_difference: formatMoney(
                priceDifference,
                currencyFormat,
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
                    priceDifference,
                    currencyFormat,
                ),
                recurrences_remaining: order.order_fixed_recurrences.total_recurrences
                  - order.order_fixed_recurrences.recurrence_count,
              }}
            />
          </p>
        );
        if (order.order_fixed_recurrences.one_charge_only) {
          swapProductMessage = (
            <p>
              <Translation
                textKey="order_product_swap_prepaid_charge"
                mergeFields={{
                  price_difference: formatMoney(
                      priceDifference,
                      currencyFormat,
                  ),
                  recurrences_remaining: order.order_fixed_recurrences.total_recurrences
                  - order.order_fixed_recurrences.recurrence_count,
                  prepaid_additional_charge: formatMoney(
                      prepaidPriceDifference,
                      currencyFormat,
                  ),
                }}
              />
            </p>
          );
        }
      }
    }

    return (
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
                    variantTitle={this.state.selectedVariant.title || ''}
                  />
                </p>
                {
                 variants.length <= 1 ? null :
                 <SelectField
                   name="swap_variants"
                   options={this.getVariantOptions()}
                   onChange={this.variantChange}
                   defaultValue={`${this.state.selectedVariant.id}`}
                 />
                }
                <p>
                  <span
                    className="product-info-price"
                    dangerouslySetInnerHTML={{ __html: formatMoney(price, order.currency_format) }}
                  />
                </p>
                {swapProductMessage}
              </div>
            </div>
            <div className="flex-column align-right">
              <p>
                <Button
                  textKey="swap_product_select_button_text"
                  className=""
                  onClick={this.onClickSwap}
                />
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

OrderProductSwapList.propTypes = {
  order: ORDER_PROP_TYPE.isRequired,
  group: PropTypes.shape({
    products_with_price_difference: PropTypes.arrayOf(PropTypes.shape({
      handle: PropTypes.string,
      product_id: PropTypes.number,
      shopify_data: PropTypes.shape({}),
    })),
  }),
  product: PropTypes.shape({
    product_id: PropTypes.number.isRequired,
    shopify_data: PropTypes.shape().isRequired,
  }).isRequired,
  confirmSwap: PropTypes.func.isRequired,
  variants: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  allowMulticurrencyDisplay: PropTypes.bool.isRequired,
};

OrderProductSwapList.defaultProps = {
  group: PropTypes.shape({
    products_with_price_difference: null,
  }),
};

const mapStateToProps = (state, ownProps) => ({
  order: state.data.orders.find(order => order.id === ownProps.orderId),
  product: state.data.groups.find(group => group.id === ownProps.groupId)
    .products_with_price_difference.find(product => product.product_id === ownProps.productId),
  group: state.data.groups.find(group => group.id === ownProps.groupId),
  swapProduct: state.data.orders.find(order => order.id === ownProps.orderId)
    .order_products.find(product => product.id === ownProps.swapProductId),
  variants: state.data.groups.find(group => group.id === ownProps.groupId)
    .products_with_price_difference.find(product => product.product_id === ownProps.productId)
    .shopify_data.variants.filter(variant =>
      variant.id !== state.data.orders.find(order => order.id === ownProps.orderId)
        .order_products.find(product => product.id === ownProps.swapProductId).variant_id),
  allowMulticurrencyDisplay: state.data.general_settings.allow_multicurrency_display,
});

export default connect(mapStateToProps)(OrderProductSwapList);
