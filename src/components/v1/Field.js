import React from 'react';
import PropTypes from 'prop-types';

import Translation from '../Translation';

const Field = ({
  labelTextKey,
  labelMergeFields,
  id,
  children,
  loading,
}) => (
  <div className="subscription-field">
    {labelTextKey ?
      <label htmlFor={id}>
        <Translation textKey={labelTextKey} mergeFields={labelMergeFields} />
        { loading ? <span>{'\u00A0'}<span className="subscription-loading-icon" /></span> : null }
      </label>
      : null
    }
    {children}
  </div>
);

Field.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  id: PropTypes.string,
  labelTextKey: PropTypes.string,
  labelMergeFields: PropTypes.shape({}),
  loading: PropTypes.bool,
};

Field.defaultProps = {
  children: null,
  id: null,
  labelTextKey: null,
  labelMergeFields: {},
  loading: false,
};

export default Field;
