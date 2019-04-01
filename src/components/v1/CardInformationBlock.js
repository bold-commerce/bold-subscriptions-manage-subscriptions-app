import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Message from './Message';
import Translation from '../Translation';

const CardInformationBlock = (props) => {
  const { card, withLabels } = props;
  if (!card) {
    return (
      <p><Translation textKey="credit_card_loading" /></p>
    );
  } else if (card && !card.error) {
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
  } else if (card && card.error) {
    return (
      <Message type="error"><Translation textKey="msp_get_cards_failed" /></Message>
    );
  }

  return null;
};

CardInformationBlock.defaultProps = {
  card: null,
  withLabels: false,
};

CardInformationBlock.propTypes = {
  card: PropTypes.shape({}),
  withLabels: PropTypes.bool,
};

export default CardInformationBlock;
