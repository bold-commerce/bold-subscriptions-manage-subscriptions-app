import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Translation from '../Translation';

const Button = ({
  textKey,
  onClick,
  disabled,
  loading,
  type,
  className,
  btnStyle,
  buttonRef,
}) => {
  let buttonClassNames = [
    'subscription-button',
    className,
  ];

  switch (btnStyle) {
    case 'secondary':
      buttonClassNames.push(window.manageSubscription.displaySettings.btn_secondary || 'msp__btn msp__btn--secondary');
      break;
    case 'alert':
      buttonClassNames.push(window.manageSubscription.displaySettings.btn_alert || 'msp__btn msp__btn--alert');
      break;
    case 'link':
      buttonClassNames.push('msp__link');
      break;
    case 'alert-link':
      buttonClassNames.push('msp__link msp__link--alert');
      break;
    case 'primary':
    default:
      buttonClassNames.push(window.manageSubscription.displaySettings.btn_primary || 'msp__btn msp__btn--primary');
      break;
  }

  buttonClassNames = classnames(buttonClassNames);

  return (
    <button
      type={type}
      className={buttonClassNames}
      disabled={disabled}
      onClick={onClick}
      ref={buttonRef}
    >
      <Translation textKey={textKey} />
      { loading ? <span>{'\u00A0'}<span className="subscription-loading-icon" /></span> : null }
    </button>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  textKey: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  type: PropTypes.string,
  btnStyle: PropTypes.string,
  buttonRef: PropTypes.func,
};

Button.defaultProps = {
  className: null,
  onClick: null,
  disabled: false,
  loading: false,
  type: 'button',
  btnStyle: 'primary',
  buttonRef: null,
};

export default Button;
