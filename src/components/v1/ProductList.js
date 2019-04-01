import React from 'react';
import PropTypes from 'prop-types';
import Translation from '../Translation';

const ProductList = ({ products, headingTextKey, orderQuantities }) => (
  <div className="subscription-details-block">
    <p><Translation textKey={headingTextKey} /></p>
    {
      products.map(product => (
        <p
          className="subscription-product-list-item"
          key={product.productListKey ? `${product.productListKey}` : `${product.product_id}-${product.variant_id}`}
        >
          { product.variant_title === 'Default Title' || !product.variant_title ?
            <Translation
              textKey="products_list_product_only_title"
              mergeFields={{
                  product_title: product.product_title || '',
              }}
            /> :
            <Translation
              textKey="product_with_variant_title"
              mergeFields={{
                product_title: product.product_title || '',
                variant_title: product.variant_title || '',
              }}
            /> }
          <Translation
            textKey="products_list_quantity"
            mergeFields={{
              quantity: orderQuantities !== null &&
              orderQuantities.find(
                exceptionProd => exceptionProd.product_internal_id === product.id,
              ) ?
                orderQuantities.find(
                  exceptionProd => exceptionProd.product_internal_id === product.id,
                ).quantity :
                product.quantity,
            }}
          />
        </p>
      ))
    }
  </div>
);

ProductList.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape({
    product_title: PropTypes.string,
    variant_title: PropTypes.string,
    product_id: PropTypes.number,
    variant_id: PropTypes.number,
  })).isRequired,
  orderQuantities: PropTypes.arrayOf(PropTypes.shape({
    product_internal_id: PropTypes.number,
    quantity: PropTypes.number,
  })),
  headingTextKey: PropTypes.string,
};

ProductList.defaultProps = {
  headingTextKey: 'products_list_heading',
  orderQuantities: null,
};

export default ProductList;
