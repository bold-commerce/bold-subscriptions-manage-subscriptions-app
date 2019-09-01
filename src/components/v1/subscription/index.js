import React from 'react';
import PropTypes from 'prop-types';

import DetailsLayout from './DetailsLayout';

const SubscriptionDetails = ({ orders }) => (
  <div className="subscription-container">
    <DetailsLayout orders={orders} />
  </div>
);

SubscriptionDetails.propTypes = {
  orders: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default DetailsLayout;
