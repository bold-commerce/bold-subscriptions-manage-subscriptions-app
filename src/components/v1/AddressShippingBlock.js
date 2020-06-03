import React from 'react';
import PropTypes from 'prop-types';

import SubscriptionContentBlock from './SubscriptionContentBlock';
import EditBillingAddressForm from './EditBillingAddressForm';
import EditShippingAddressForm from './EditShippingAddressForm';
import EditShippingMethodForm from './EditShippingMethodForm';

const AddressShippingBlock = ({ disabled, orderId }) => (
  <SubscriptionContentBlock
    titleTranslationKey="address_and_shipping_title"
  >
    <EditShippingMethodForm orderId={orderId} disabled={disabled} />
    <div className="subscription-details-block-container">
      <div className="flex-column flex-column-half">
        <EditShippingAddressForm orderId={orderId} disabled={disabled} />
      </div>
      <div className="flex-column flex-column-half">
        <EditBillingAddressForm orderId={orderId} disabled={disabled} />
      </div>
    </div>
  </SubscriptionContentBlock>
);

AddressShippingBlock.propTypes = {
  orderId: PropTypes.number.isRequired,
  disabled: PropTypes.bool,
};
AddressShippingBlock.defaultProps = {
  disabled: false,
};

export default AddressShippingBlock;
