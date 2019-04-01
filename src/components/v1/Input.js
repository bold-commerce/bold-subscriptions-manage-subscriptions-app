import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { DEFAULT_INPUT_CLASSNAME } from '../../constants';

const Input = ({
  id,
  value,
  defaultValue,
  onChange,
  onBlur,
  name,
  type,
  error,
  checked,
  placeholder,
  style,
  maxLength,
}) => {
  let inputClassNames = [
    'subscription-input',
    { 'msp__form-field--with-error': error },
  ];
  inputClassNames.push(
    window
      .manageSubscription
      .displaySettings
      .input_classname || DEFAULT_INPUT_CLASSNAME,
  );
  inputClassNames = classnames(inputClassNames);

  return (<input
    id={id}
    className={inputClassNames}
    value={value || undefined}
    defaultValue={defaultValue || undefined}
    onChange={onChange}
    onBlur={onBlur}
    name={name}
    type={type}
    checked={checked}
    placeholder={placeholder}
    style={style}
    maxLength={maxLength}
  />);
};

Input.propTypes = {
  type: PropTypes.string,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  name: PropTypes.string,
  error: PropTypes.bool,
  checked: PropTypes.bool,
  placeholder: PropTypes.string,
  style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  maxLength: PropTypes.number,
};

Input.defaultProps = {
  type: null,
  value: null,
  defaultValue: null,
  onChange: null,
  onBlur: null,
  name: null,
  error: false,
  checked: null,
  placeholder: null,
  style: null,
  maxLength: null,
};

export default Input;
