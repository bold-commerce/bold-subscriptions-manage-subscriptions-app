import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const ButtonGroup = (props) => {
  let componentClasses = ['msp__btn-group'];

  switch (props.align) {
    case 'left':
      componentClasses.push('btn-group--left');
      break;
    case 'right':
      componentClasses.push('btn-group--right');
      break;
    case 'split':
    default:
      componentClasses.push('btn-group--split');
      break;
  }

  componentClasses = classnames(componentClasses);

  return (
    <div className={componentClasses}>
      {props.children}
    </div>
  );
};

ButtonGroup.propTypes = {
  align: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

ButtonGroup.defaultProps = {
  align: 'right',
  children: null,
};

export default ButtonGroup;
