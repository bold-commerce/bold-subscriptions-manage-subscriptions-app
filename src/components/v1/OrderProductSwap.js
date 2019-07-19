import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Button from './Button';
import Separator from './Separator';
import ProductImages from './ProductImages';
import Translation from '../Translation';
import OrderProductSwapList from './OrderProductSwapList';
import OrderProductSwapConfirm from './OrderProductSwapConfirm';
import LoadingSpinner from './LoadingSpinner';
import formatMoney from '../../helpers/moneyFormatHelpers';
import { ORDER_PROP_TYPE, PRODUCT_PROP_TYPE } from '../../constants/PropTypes';
import ProductTitleTranslation from './ProductTitleTranslation';

class OrderProductSwap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayProducts: false,
      confirmSwap: false,
    };

    this.onClickToggleSwap = this.onClickToggleSwap.bind(this);
    this.confirmSwap = this.confirmSwap.bind(this);
    this.topElement = null;
  }

  componentDidMount() {
    this.scrollToTop();
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.swapProductsReceived) {
      this.props.toggleSwap(
        this.props.order.id,
        this.props.product.id,
        this.props.product.properties_group_id,
      );
      this.setState({
        displayProducts: false,
      });
    } else {
      this.setState({
        displayProducts: true,
      });
    }
  }

  onClickToggleSwap() {
    this.props.toggleSwap(
      this.props.order.id,
      this.props.product.id,
      this.props.product.properties_group_id,
    );
  }

  scrollToTop() {
    this.topElement.scrollIntoView({ behavior: 'auto', block: 'start' });
  }

  confirmSwap(productId, variantId) {
    this.setState({
      confirmSwap: true,
      productId,
      variantId,
    });
    this.scrollToTop();
  }

  render() {
    const { order, product, group, allowMulticurrencyDisplay } = this.props;
    const exchangeRate = [0, 1, '', null].indexOf(order.currency_exchange_rate) === -1 && allowMulticurrencyDisplay ? order.currency_exchange_rate : 1;
    const currencyFormat = !allowMulticurrencyDisplay ? null : order.currency_format;
    const price = (exchangeRate * product.price) * 100;

    let swappableProducts = null;
    if (this.state.confirmSwap) {
      swappableProducts = (
        <OrderProductSwapConfirm
          orderId={order.id}
          groupId={group.id}
          productId={this.state.productId}
          variantId={this.state.variantId}
          swapProductId={product.id}
          toggleSwap={this.props.toggleSwap}
        />
      );
    } else if (this.state.displayProducts && group
        && group.products_with_price_difference
        && group.products_with_price_difference !== null) {
      swappableProducts = [
        <Separator icon="&#8633;" textKey="order_product_swap_separator" key={`order-${order.id}`} />,
        group.products_with_price_difference.map(d => (
          d.product_id === product.product_id
          && d.shopify_data.variants.length === 1
          && d.shopify_data.variants[0].id === product.variant_id
            ? null :
            <OrderProductSwapList
              key={`${order.id}-prod-${d.product_id}`}
              orderId={order.id}
              productId={d.product_id}
              groupId={group.id}
              swapProductId={product.id}
              toggleSwap={this.props.toggleSwap}
              confirmSwap={this.confirmSwap}
            />
        )),
      ];
    } else {
      swappableProducts = (
        <LoadingSpinner textKey="order_product_swap_loading" />
      );
    }

    return (
      <div className="order-product-swapping" ref={(node) => { this.topElement = node; }}>
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
                      productTitle={product.product_title || ''}
                      variantTitle={product.variant_title || ''}
                    />
                  </p>
                  <p>
                    <span
                      className="product-info-price"
                      dangerouslySetInnerHTML={{ __html: formatMoney(price, currencyFormat) }}
                    />
                  </p>
                  <p>
                    <Translation
                      textKey="product_info_quantity"
                      mergeFields={{
                        quantity: product.quantity,
                      }}
                    />
                  </p>
                </div>
              </div>
              <div className="flex-column">
                <Button
                  id="cancel_swap"
                  textKey="cancel_swap_button_text"
                  onClick={this.onClickToggleSwap}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="order-swappable-products">
          { swappableProducts }
        </div>
      </div>
    );
  }
}

OrderProductSwap.propTypes = {
  order: ORDER_PROP_TYPE.isRequired,
  product: PRODUCT_PROP_TYPE.isRequired,
  group: PropTypes.shape({
    id: PropTypes.number.isRequired,
    products_with_price_difference: PropTypes.array,
  }),
  toggleSwap: PropTypes.func.isRequired,
  swapProductsReceived: PropTypes.bool,
  allowMulticurrencyDisplay: PropTypes.bool.isRequired,
};

OrderProductSwap.defaultProps = {
  group: PropTypes.shape({
    products_with_price_difference: null,
  }),
  swapProductsReceived: null,
};

const mapStateToProps = (state, ownProps) => ({
  order: state.data.orders.find(order => order.id === ownProps.orderId),
  product: state.data.orders.find(order => order.id === ownProps.orderId)
    .order_products.find(product => product.id === ownProps.productId),
  group: state.data.groups.find(group => group.id === ownProps.groupId),
  swapProductsReceived: state.userInterface.swapProductsReceived ?
    state.userInterface.swapProductsReceived[ownProps.productId] :
    null,
  allowMulticurrencyDisplay: state.data.general_settings.allow_multicurrency_display,
});

export default connect(mapStateToProps)(OrderProductSwap);
