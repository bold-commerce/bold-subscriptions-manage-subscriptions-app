import React from 'react';
import PropTypes from 'prop-types';

import SubscriptionContentBlock from './SubscriptionContentBlock';
import EditBillingAddressForm from './EditBillingAddressForm';
import EditShippingAddressForm from './EditShippingAddressForm';
import EditShippingMethodForm from './EditShippingMethodForm';

const AddressShippingBlock = ({ orderId }) => (
  <SubscriptionContentBlock
    titleTranslationKey="address_and_shipping_title"
  >
    <EditShippingMethodForm orderId={orderId} />
    <div className="subscription-details-block-container">
      <div className="flex-column flex-column-half">
        <EditShippingAddressForm orderId={orderId} />
      </div>
      <div className="flex-column flex-column-half">
        <EditBillingAddressForm orderId={orderId} />
      </div>
    </div>
  </SubscriptionContentBlock>
);

AddressShippingBlock.propTypes = {
  orderId: PropTypes.number.isRequired,
};

export default AddressShippingBlock;
