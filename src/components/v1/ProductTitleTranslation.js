import React from 'react';
import PropTypes from 'prop-types';
import Translation from '../Translation';

export default function ProductTitleTranslation(props) {
  let textKey = 'product_without_variant_title';
  const hasVariant = props.variantTitle && props.variantTitle !== '' && props.variantTitle !== 'Default Title';

  if (hasVariant) {
    textKey = 'product_with_variant_title';
  }

  return (
    <Translation
      textKey={textKey}
      mergeFields={
        {
          product_title: props.productTitle || '',
          ...(hasVariant ? {
            variant_title: props.variantTitle,
          } : {}),
        }
      }
    />
  );
}
ProductTitleTranslation.defaultProps = {
  productTitle: null,
  variantTitle: null,
};

ProductTitleTranslation.propTypes = {
  productTitle: PropTypes.string,
  variantTitle: PropTypes.string,
};
