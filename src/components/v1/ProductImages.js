import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class ProductImages extends Component {
  getBackgroundImageStyle(product) {
    let imageSrc = `'data:image/svg+xml;utf8,${manageSubscription.placeholderSVG}'`;
    const productShopifyData = (this.props.productData.find(
      p => p.product_id === product.product_id && p.shopify_data,
    ) || {}).shopify_data;

    if (productShopifyData) {
      const variantImage = productShopifyData.images ?
        (productShopifyData.images.find(
          i => i.variant_ids.find(variant => variant === product.variant_id),
        ) || {}) : {};
      if (variantImage.src) {
        imageSrc = variantImage.src;
      } else if (productShopifyData.image && productShopifyData.image.src) {
        imageSrc = productShopifyData.image.src;
      }
    }

    return {
      backgroundImage: `url(${imageSrc})`,
    };
  }

  getProductURL(product) {
    const productHandle = (this.props.productData.find(
      p => p.product_id === product.product_id && p.shopify_data,
    ) || {}).handle;

    return productHandle ? `/products/${productHandle}` : null;
  }

  render() {
    let contents = this.props.products.length === 1 ? (
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      <a
        href={this.getProductURL(this.props.products[0])}
        target="_blank"
        rel="noreferrer"
        title="Product Image"
        style={this.getBackgroundImageStyle(this.props.products[0])}
        className="msp__product-image msp__product-image--single"
      />
    ) : null;

    if (this.props.products.length > 1) {
      contents = (
        <div>
          <div className="msp__product-image-grid">
            {this.props.products.slice(0, 4).map(product => (
              // eslint-disable-next-line jsx-a11y/anchor-has-content
              <a
                href={this.getProductURL(product)}
                target="_blank"
                rel="noreferrer"
                title="Product Image"
                key={product.imageKey ? `${product.imageKey}` : `${product.product_id}-${product.variant_id}`}
                style={this.getBackgroundImageStyle(product)}
                className="msp__product-image msp__product-image--multiple"
              />
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="subscription-images-container">
        {contents}
      </div>
    );
  }
}

ProductImages.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape({
    product_id: PropTypes.number,
    variant_id: PropTypes.number,
  })).isRequired,
  productData: PropTypes.arrayOf(PropTypes.shape({
    image: PropTypes.shape({
      src: PropTypes.string,
    }),
  })).isRequired,
};

const mapStateToProps = state => ({
  productData: state.data.products,
});

export default connect(mapStateToProps)(ProductImages);
