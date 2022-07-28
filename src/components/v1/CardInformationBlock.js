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
    if (card.venmo_username) {
      return (
        <div className="VenmoBlock">
          <svg viewBox="0 0 576.9 109.67" width="48" height="9" role="img" style={{ fill: '#3d95ce' }}>
            <title data-reactid="221">Venmo</title>
            <path
              d="M94.82,0c3.9,6.43,5.65,13.06,5.65,21.43,0,26.7-22.79,61.38-41.29,85.73H16.94L0,5.85,37, 2.33l9,72.09c8.37-13.64,18.7-35.07,18.7-49.67,0-8-1.37-13.44-3.51-17.93Z">
            </path>
            <path
              d="M142.76,44.61c6.81,0,23.94-3.11,23.94-12.85,0-4.68-3.31-7-7.2-7C152.69,24.75,143.74, 32.92,142.76,44.61ZM142,63.9c0,11.89,6.61,16.56,15.38,16.56,9.55,0,18.69-2.33, 30.57-8.37l-4.48,30.39c-8.37,4.09-21.42,6.82-34.08,6.82-32.12, 0-43.62-19.48-43.62-43.83C105.76,33.9,124.46.38,163,.38c21.23,0,33.1,11.89, 33.1,28.45C196.11,55.53,161.85,63.71,142,63.9Z">
            </path>
            <path
              d="M302.86,23.77A97.67,97.67,0,0,1,301.68,37l-11.1, 70.14h-36l10.12-64.3c.19-1.74.78-5.26.78-7.2,0-4.68-2.92-5.84-6.43-5.84-4.67,0-9.34, 2.14-12.46,3.7l-11.48,73.64H198.87l16.55-105h31.35l.4,8.38c7.4-4.87,17.14-10.14, 31-10.14C296.43.39,302.86,9.74,302.86,23.77Z">
            </path>
            <path
              d="M409.79,11.88C420.11,4.49,429.85.39,443.28.39c18.49,0,24.93,9.36,24.93,23.39A97.67,97.67, 0,0,1,467,37l-11.09,70.14h-36L430.23,41.5c.19-1.76.59-3.9.59-5.25, 0-5.27-2.92-6.43-6.43-6.43-4.47,0-9,2-12.27,3.7l-11.48, 73.64h-36l10.3-65.66c.19-1.76.58-3.9.58-5.25,0-5.27-2.92-6.43-6.42-6.43-4.68,0-9.34, 2.14-12.46,3.7l-11.49,73.64H308.93l16.55-105h31l1,8.77c7.2-5.25,16.93-10.52, 30-10.52C398.69.39,406.08,5.26,409.79,11.88Z">
            </path>
            <path
              d="M539.89,42.47c0-8.57-2.14-14.42-8.56-14.42-14.22,0-17.13,25.13-17.13,38,0,9.75,2.73,15.79 ,9.15,15.79C536.78,81.83,539.89,55.33,539.89,42.47Zm-62.3,22c0-33.12,17.52-64.11, 57.83-64.11C565.79.36,576.9,18.29,576.9,43c0,32.73-17.33,66.63-58.61,66.63-30.58, 0-40.7-20-40.7-45.18Z">
            </path>
          </svg>
          {withLabels ? (
            <span>{ card.venmo_username }</span>
          ) : (
            <div>{ card.venmo_username }</div>
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
};

CardInformationBlock.propTypes = {
  card: PropTypes.shape({
    error: PropTypes.string,
    last_four: PropTypes.string,
    expiry_date: PropTypes.string,
    paypal_email: PropTypes.string,
    venmo_username: PropTypes.string,
  }),
  withLabels: PropTypes.bool,
};

export default CardInformationBlock;
