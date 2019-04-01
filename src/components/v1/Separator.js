import React from 'react';
import PropTypes from 'prop-types';
import Translation from '../Translation';

const Separator = ({ icon, textKey }) => (
  <p className="order-product-separator">
    {icon}
    <br />
    <Translation textKey={textKey} />
  </p>
);

Separator.propTypes = {
  icon: PropTypes.string,
  textKey: PropTypes.string.isRequired,
};

Separator.defaultProps = {
  icon: null,
};

export default Separator;
