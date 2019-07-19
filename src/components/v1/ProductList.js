import React from 'react';
import PropTypes from 'prop-types';
import Translation from '../Translation';
import formatMoney from '../../helpers/moneyFormatHelpers';
import ProductTitleTranslation from './ProductTitleTranslation';

const ProductList = ({
  products, headingTextKey, orderQuantities, displayPrice, currencyFormat,
}) => (
  <div className="subscription-details-block">
    <p><Translation textKey={headingTextKey} /></p>
    {
      products.map((product) => {
      const total = product.converted_price > 0 ? product.converted_price : product.price;
      return (
        <p
          className="subscription-product-list-item"
          key={product.productListKey ? `${product.productListKey}` : `${product.product_id}-${product.variant_id}`}
        >
          <ProductTitleTranslation
            productTitle={product.product_title || ''}
            variantTitle={product.variant_title || ''}
          />
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
          <span>
            {displayPrice !== true ? null :
            <React.Fragment>
                  &nbsp;-
              <Translation
                textKey="products_list_price"
                mergeFields={{
                        product_price: formatMoney(total, currencyFormat),
                      }}
              />
            </React.Fragment>}
          </span>
        </p>
        );
      })
    }
  </div>
);

ProductList.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape({
    product_title: PropTypes.string,
    variant_title: PropTypes.string,
    product_id: PropTypes.number,
    variant_id: PropTypes.number,
    price: PropTypes.string,
  })).isRequired,
  orderQuantities: PropTypes.arrayOf(PropTypes.shape({
    product_internal_id: PropTypes.number,
    quantity: PropTypes.number,
  })),
  headingTextKey: PropTypes.string,
  displayPrice: PropTypes.bool,
  currencyFormat: PropTypes.string,
};

ProductList.defaultProps = {
  headingTextKey: 'products_list_heading',
  orderQuantities: null,
  displayPrice: true,
  currencyFormat: null,
};

export default ProductList;
