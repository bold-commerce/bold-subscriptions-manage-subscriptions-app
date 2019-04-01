import React from 'react';
import PropTypes from 'prop-types';

import Field from './Field';
import Input from './Input';

const InputField = ({
  id,
  labelTextKey,
  labelMergeFields,
  value,
  defaultValue,
  onChange,
  name,
  type,
  error,
}) => (
  <Field
    id={id}
    labelTextKey={labelTextKey}
    labelMergeFields={labelMergeFields}
  >
    <Input
      id={id}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      name={name}
      type={type}
      error={error}
    />
  </Field>
);

InputField.propTypes = {
  type: PropTypes.string,
  id: PropTypes.string.isRequired,
  labelTextKey: PropTypes.string,
  labelMergeFields: PropTypes.shape({}),
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
  name: PropTypes.string,
  error: PropTypes.bool,
};

InputField.defaultProps = {
  type: null,
  labelTextKey: null,
  labelMergeFields: {},
  value: null,
  defaultValue: null,
  onChange: null,
  name: null,
  error: false,
};

export default InputField;
