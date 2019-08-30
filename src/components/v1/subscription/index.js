import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DetailsLayout from './DetailsLayout';

const SubscriptionDetails = ({ orderId }) => (
	<DetailsLayout orderId={orderId} />
);

export default DetailsLayout;
