import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const Select = ({
  name,
  value,
  defaultValue,
  onChange,
  error,
  options,
}) => {
  let selectClassNames = [
    'subscription-select',
    { 'msp__form-field--with-error': error },
  ];
  selectClassNames.push(window.manageSubscription.displaySettings.select_classname || 'msp__form-field msp__select');
  selectClassNames = classnames(selectClassNames);

  return (
    <select
      className={selectClassNames}
      name={name}
      onChange={onChange}
      value={value || undefined}
      defaultValue={defaultValue || undefined}
    >
      {options.map(option => (
        <option
          value={option.value || option.name}
          key={option.value || option.name}
        >
          {option.name}
        </option>
      ))}
    </select>
  );
};

Select.defaultProps = {
  name: null,
  defaultValue: null,
  value: null,
  onChange: null,
  error: null,
};

Select.propTypes = {
  error: PropTypes.bool,
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  defaultValue: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default Select;
