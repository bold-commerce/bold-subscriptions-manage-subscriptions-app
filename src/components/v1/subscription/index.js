import React from 'react';
import PropTypes from 'prop-types';

import DetailsLayout from './DetailsLayout';

const SubscriptionDetails = ({ orderId, cancellable }) => (
  <DetailsLayout orderId={orderId} cancellable={cancellable} />
);

SubscriptionDetails.propTypes = {
  orderId: PropTypes.number.isRequired,
  cancellable: PropTypes.bool.isRequired,
};

export default DetailsLayout;
