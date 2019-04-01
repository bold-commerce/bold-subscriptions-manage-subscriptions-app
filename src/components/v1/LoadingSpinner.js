import React from 'react';
import PropTypes from 'prop-types';
import Translation from '../Translation';

const LoadingSpinner = props => (
  <p className="order-product-separator">
    <span className="subscription-loading-icon" />
    <Translation textKey={props.textKey} />
  </p>
);

LoadingSpinner.propTypes = {
  textKey: PropTypes.string,
};

LoadingSpinner.defaultProps = {
  textKey: null,
};

export default LoadingSpinner;
