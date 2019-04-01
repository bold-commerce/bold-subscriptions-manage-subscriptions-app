import React from 'react';
import PropTypes from 'prop-types';

const ProgressBar = ({ percentage, title }) => (
  <div className="progress-bar">
    {title ? <p>{title}</p> : null}
    <div>
      <div style={{ width: `${percentage * 100}%` }} />
    </div>
  </div>
);

ProgressBar.propTypes = {
  percentage: PropTypes.number.isRequired,
  title: PropTypes.string,
};

ProgressBar.defaultProps = {
  title: undefined,
};

export default ProgressBar;
