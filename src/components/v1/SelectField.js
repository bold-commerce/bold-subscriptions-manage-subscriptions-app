import React from 'react';
import PropTypes from 'prop-types';

import Field from './Field';
import Select from './Select';


const SelectField = ({
  labelTextKey,
  value,
  defaultValue,
  options,
  onChange,
  name,
  loading,
}) => (
  <Field
    loading={loading}
    labelTextKey={labelTextKey}
  >
    <Select
      name={name}
      value={value}
      defaultValue={defaultValue}
      options={options}
      onChange={onChange}
    />
  </Field>
);


SelectField.defaultProps = {};

SelectField.propTypes = {
  name: PropTypes.string,
  labelTextKey: PropTypes.string,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onChange: PropTypes.func,
  loading: PropTypes.bool,
};

SelectField.defaultProps = {
  name: null,
  onChange: null,
  labelTextKey: null,
  value: null,
  defaultValue: null,
  loading: false,
};

export default SelectField;
