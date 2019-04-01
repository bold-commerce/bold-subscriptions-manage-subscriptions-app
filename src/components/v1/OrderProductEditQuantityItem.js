import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ProductImages from './ProductImages';
import Translation from '../Translation';
import Input from './Input';
import formatMoney from '../../helpers/moneyFormatHelpers';
import { PRODUCT_PROP_TYPE } from '../../constants/PropTypes';

class OrderProductEditQuantityItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      linePrice: props.calculateLineSubtotal(
        props.product.id, props.product.price, props.quantity,
      ),
    };

    this.onChangeQuantity = this.onChangeQuantity.bind(this);
  }

  onChangeQuantity(e) {
    const { target: { value } } = e;
    const { product, calculateLineSubtotal, onChangeValidate } = this.props;

    this.setState({
      linePrice: calculateLineSubtotal(
        product.id, product.price, value,
      ),
    });
    onChangeValidate(e);
  }

  render() {
    const { product, quantity } = this.props;
    return (
      <div className="order-product" >
        <div className="flex-column flex-column-fifteen order-product-edit-images">
          <ProductImages products={[product]} />
        </div>
        <div className="flex-column flex-column-half">
          <div className="subscription-details-block">
            <p>
              <Translation
                textKey="product_with_variant_title"
                mergeFields={{
                  product_title: product.product_title || '',
                  variant_title: product.variant_title || '',
                }}
              />
            </p>
            <p>
                <span className="product-info-price" dangerouslySetInnerHTML={{__html: formatMoney(product.price)}} />
            </p>
          </div>
        </div>
        <div className="flex-column flex-column-fifteen order-product-edit-quantity">
          <Input
            id={`product_editing_quantity_${product.id}`}
            name={`product_editing_quantity_${product.id}`}
            defaultValue={`${quantity}`}
            onChange={this.onChangeQuantity}
            onBlur={this.props.onBlurValidate}
            type="number"
          />
        </div>
        <div className="flex-column flex-column-twenty order-product-edit-line-subtotal">
          <h6 id={`product_line_subtotal_${product.id}`} className="product-info-price">
            <span className="product-info-price" dangerouslySetInnerHTML={{
              __html: formatMoney(this.state.linePrice)}} />
          </h6>
        </div>
      </div>
    );
  }
}

OrderProductEditQuantityItem.propTypes = {
  product: PRODUCT_PROP_TYPE.isRequired,
  quantity: PropTypes.number.isRequired,
  calculateLineSubtotal: PropTypes.func.isRequired,
  onChangeValidate: PropTypes.func.isRequired,
  onBlurValidate: PropTypes.func.isRequired,
};

OrderProductEditQuantityItem.defaultValue = {
  product: PropTypes.shape({
    variant_title: null,
  }),
};

const mapStateToProps = (state, ownProps) => {
  const order = state.data.orders.find(o => o.id === ownProps.orderId);
  const product = order.order_products.find(p => p.id === ownProps.productId);
  const quantity = ownProps.orderDate !== null &&
    order.order_product_exceptions.find(exception => exception.date === ownProps.orderDate)
    ? order.order_product_exceptions.find(exception => exception.date === ownProps.orderDate)
      .products.find(p => p.product_internal_id === ownProps.productId).quantity
    : product.quantity;

  return {
    order,
    product,
    quantity,
  };
};

export default connect(mapStateToProps)(OrderProductEditQuantityItem);
