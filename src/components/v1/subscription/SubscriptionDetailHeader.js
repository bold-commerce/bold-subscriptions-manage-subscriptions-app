import React from 'react';
import PropTypes from 'prop-types';

import NextShipDateBlock from '../NextShipDateBlock';

const SubscriptionDetailHeader = ({ orderId }) => (
  <div className="detail-content-header">
    {`Subscription - #${orderId}`}
    <NextShipDateBlock orderId={orderId} />
  </div>
);

SubscriptionDetailHeader.propTypes = {
  orderId: PropTypes.number.isRequired,
};

export default SubscriptionDetailHeader;
