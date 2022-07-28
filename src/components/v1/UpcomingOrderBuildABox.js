import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import ProductImages from './ProductImages';
import ProductList from './ProductList';
import Translation from '../Translation';
import * as UpcomingOrderBuildABoxStates from '../../constants/UpcomingOrderBuildABoxStates';
import SkipResumeButton from './SkipResumeButton';
import { ORDER_PROP_TYPE } from '../../constants/PropTypes';
import formatMoney from '../../helpers/moneyFormatHelpers';

class UpcomingOrderBuildABox extends Component {
  getProductAndVariantTitles() {
    const { buildABoxNextOrders, products } = this.props;
    const productLookup = {};
    products.forEach((product) => {
      productLookup[product.product_id] = product;
    });

    return buildABoxNextOrders.choices.filter(choice => (choice.quantity > 0)).map((choice) => {
      const newProduct = {};
      const handler = productLookup[choice.product_id];
      newProduct.quantity = choice.quantity;
      newProduct.product_id = choice.product_id;
      newProduct.variant_id = choice.variant_id;
      if (choice.slot_id) {
        newProduct.slot_id = choice.slot_id;
        newProduct.productListKey = `${choice.slot_id}-${choice.product_id}-${choice.variant_id}`;
      }
      if (handler && handler.shopify_data && handler.shopify_data.title
        && handler.shopify_data.variants) {
        newProduct.product_title = handler.shopify_data.title;
        let newProductVariantTitle = '';
        let newProductVariantPrice = '';
        const newProductVariant = handler.shopify_data.variants
          .find(variant => variant.id === choice.variant_id);
        if (newProductVariant && newProductVariant.title && newProductVariant.price) {
          newProductVariantTitle = newProductVariant.title;
          newProductVariantPrice = newProductVariant.price;
        }
        newProduct.variant_title = newProductVariantTitle;
        newProduct.price = newProductVariantPrice;
      } else {
        newProduct.product_title = '';
        newProduct.variant_title = '';
        newProduct.price = '';
      }
      return newProduct;
    });
  }

  getProductPrices(exchangeRate, currencyFormat) {
    const { order, buildABoxNextOrders, products } = this.props;
    const productLookup = {};
    products.forEach((product) => {
      productLookup[product.product_id] = product;
    });
    const individualPrices = buildABoxNextOrders.choices.filter(choice => (choice.quantity > 0))
      .map((choice) => {
        const handler = productLookup[choice.product_id];
        if (handler && handler.shopify_data && handler.shopify_data.variants) {
          const choiceVariant = handler.shopify_data.variants
            .find(variant => variant.id === choice.variant_id);
          if (choiceVariant && choiceVariant.price) {
            return (Number(choiceVariant.price) * Number(choice.quantity));
          }
        }
        return 0;
      });
    let total = 0;
    if (order.is_price_based_on_choices) {
      individualPrices.forEach((subtotal) => {
        total = Number(total) + Number(subtotal);
      });
    } else {
      total = Number(order.order_products[0].price);
    }
    return (<span> { formatMoney((total * exchangeRate).toFixed(2), currencyFormat) } </span>);
  }

  getProductImages() {
    const { buildABoxNextOrders } = this.props;
    return buildABoxNextOrders.choices.filter(choice => (choice.quantity > 0)).map((choice) => {
      const newProduct = {};
      newProduct.quantity = choice.quantity;
      newProduct.product_id = choice.product_id;
      newProduct.variant_id = choice.variant_id;
      if (choice.slot_id) {
        newProduct.slot_id = choice.slot_id;
        newProduct.imageKey = `${choice.slot_id}-${choice.product_id}-${choice.variant_id}`;
      }
      return newProduct;
    });
  }

  selectProductUrl() {
    const {
      orderId, date, frontendUrl, frontendSignature, frontendToken,
    } = this.props;
    return `${frontendUrl}${orderId}/${date}?bold_token=${frontendToken}&bold_signature=${frontendSignature}`;
  }

  editOrMakeSelection() {
    const { buildABoxNextOrders } = this.props;
    if (buildABoxNextOrders.status ===
      UpcomingOrderBuildABoxStates.BUILD_A_BOX_AVAILABLE_CHOICES_MADE) {
      return (
        <a href={this.selectProductUrl()}>
          <span role="presentation" className="text-button" >
            <Translation textKey="build_a_box_products_list_edit_selection" />
          </span>
        </a>
      );
    } else if (buildABoxNextOrders.status === UpcomingOrderBuildABoxStates.BUILD_A_BOX_AVAILABLE) {
      return (
        <a href={this.selectProductUrl()}>
          <span role="presentation" className="text-button">
            <Translation textKey="build_a_box_products_list_make_selection" />
          </span>
        </a>
      );
    }
    return null;
  }

  render() {
    const { order, date, buildABoxNextOrders } = this.props;
    const exchangeRate = [0, 1, '', null].indexOf(order.currency_exchange_rate) === -1 ? order.currency_exchange_rate : 1;
    const currencyFormat = order.currency_format;
    const displayPrice = !order.build_a_box
        || (order.build_a_box === true && order.is_price_based_on_choices === true);

    return (
      <div className="upcoming-order">
        <div className="flex-column flex-column-quarter">
          <ProductImages products={this.getProductImages()} />
        </div>
        <div className="flex-column flex-column-three-quarters">
          <div className="upcoming-order-details">
            <div className="flex-column">
              <div className="subscription-details-block-container">
                <div className="flex-column">
                  <div className="subscription-details-block">
                    <p><Translation textKey="upcoming_order_date" /></p>
                    <p>{moment(date).format('MMMM D, YYYY')}</p>
                  </div>
                  <div className="subscription-details-block">
                    <div className="subscription-details-block">
                      <p><Translation textKey="upcoming_status" /></p>
                      <p><Translation textKey={buildABoxNextOrders.status} /></p>
                    </div>
                    <ProductList
                      products={this.getProductAndVariantTitles()}
                      headingTextKey="upcoming_build_a_box_selection_heading"
                      currencyFormat={currencyFormat}
                      displayPrice={displayPrice}
                    />
                    <div className="subscription-details-block">
                      <p><Translation textKey="upcoming_order_subtotal_heading" /></p>
                      { this.getProductPrices(exchangeRate, currencyFormat) }
                    </div>
                    { this.editOrMakeSelection() }
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-column align-right">
              <p>
                <SkipResumeButton orderToUpdate={order} orderDate={date} />
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

UpcomingOrderBuildABox.propTypes = {
  order: ORDER_PROP_TYPE.isRequired,
  date: PropTypes.string.isRequired,
  buildABoxNextOrders: PropTypes.shape({
    date: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    choices: PropTypes.arrayOf(PropTypes.shape({
      product_id: PropTypes.number,
      quantity: PropTypes.number,
      slot_id: PropTypes.number,
      variant_id: PropTypes.number,
    })).isRequired,
  }).isRequired,
  products: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  orderId: PropTypes.number.isRequired,
  frontendUrl: PropTypes.string,
  frontendSignature: PropTypes.string,
  frontendToken: PropTypes.string,
};

UpcomingOrderBuildABox.defaultProps = {
  frontendUrl: null,
  frontendSignature: null,
  frontendToken: null,
};

const mapStateToProps = (state, ownProps) => ({
  order: state.data.orders.find(order => order.id === ownProps.orderId),
  buildABoxNextOrders: state.data.orders.find(order => order.id === ownProps.orderId)
    .build_a_box_next_orders.find(nextOrder => nextOrder.date === ownProps.date),
  products: state.data.products,
  frontendToken: state.data.general_settings.bold_token,
  frontendSignature: state.data.general_settings.bold_signature,
  frontendUrl: state.data.general_settings.select_products_url,
});

export default connect(mapStateToProps)(UpcomingOrderBuildABox);
