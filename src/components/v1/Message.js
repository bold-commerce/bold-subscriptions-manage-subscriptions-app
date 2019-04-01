import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import Translation from '../Translation';

const Message = ({
  type,
  className,
  children,
  id,
  title,
  titleTextKey,
  dismissable,
  onDismissClick,
  mergeFields,
}) => {
  const messageClassNames = classnames([
    'subscription-message',
    { 'subscription-message-with-error': type === 'error' },
    { 'subscription-message-with-warning': type === 'warning' },
    { 'subscription-message-with-info': type === 'info' },
    { 'subscription-message-with-success': type === 'success' },
    className,
  ]);
  return (
    <div
      id={id}
      className={messageClassNames}
    >
      {dismissable ? (
        <span
          className="subscription-message-dismiss"
          onClick={onDismissClick}
          role="presentation"
        >
        x
        </span>
        ) : null}
      {title ? (
        <p className="subscription-message-title">{title}</p>
      ) : null}
      {titleTextKey ? (
        <p className="subscription-message-title">
          <Translation textKey={titleTextKey} mergeFields={mergeFields} />
        </p>
      ) : null}
      {children}
    </div>
  );
};

Message.propTypes = {
  className: PropTypes.string,
  type: PropTypes.oneOf(['error', 'warning', 'info', 'success', '']),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  id: PropTypes.number,
  title: PropTypes.string,
  titleTextKey: PropTypes.string,
  dismissable: PropTypes.bool,
  onDismissClick: PropTypes.func,
  mergeFields: PropTypes.shape({}),
};

Message.defaultProps = {
  className: null,
  type: '',
  children: null,
  id: null,
  title: null,
  titleTextKey: null,
  dismissable: false,
  onDismissClick: null,
  mergeFields: {},
};

export default Message;
