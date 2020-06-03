import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Message from './Message';
import Translation from '../Translation';

const CardInformationBlock = (props) => {
  const { card, withLabels, gateway } = props;
  if (!card) {
    return (
      <p><Translation textKey="credit_card_loading" /></p>
    );
  }
  if (card && !card.error) {
    if (card.paypal_email) {
      return (
        <div className="PayPalBlock">
          <img src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/pp-acceptance-small.png" alt="PayPal Acceptance" />
          {withLabels ? (
            <span>{ card.paypal_email }</span>
          ) : (
            <div>{ card.paypal_email }</div>
          )}
        </div>
      );
    }
    return (
      <React.Fragment>
        {!withLabels ? null : (
          <Translation textKey="msp_card_number" />
        )}
        <p>
          <Translation
            textKey="last_four"
            mergeFields={{ last_four: card.last_four }}
          />
        </p>
        {!withLabels ? null : (
          <Translation textKey="expiry_date" />
        )}
        <p>{moment(card.expiry_date).format('MM/YY')}</p>
      </React.Fragment>
    );
  }
  if (card && card.error) {
    return (
      <Message type="error"><Translation textKey="msp_get_cards_failed" /></Message>
    );
  }

  return null;
};

CardInformationBlock.defaultProps = {
  card: null,
  withLabels: false,
  gateway: null,
};

CardInformationBlock.propTypes = {
  card: PropTypes.shape({}),
  withLabels: PropTypes.bool,
  gateway: PropTypes.string,
};

export default CardInformationBlock;
