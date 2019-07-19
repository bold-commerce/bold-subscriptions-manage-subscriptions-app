import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const loggedMissingTranslations = {};

const Translation = ({ textKey, value }) => (
  <span className={classnames('ro-translation', `ro-translation-${textKey}`)} dangerouslySetInnerHTML={{ __html: value }} />
);

Translation.propTypes = {
  textKey: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

const applyMergeFields = (translations, textKey, mergeFields) => {
  let newValue = translations[textKey] || '';
  Object.keys(mergeFields).forEach((mergeKey) => {
    let mergeValue = mergeFields[mergeKey];

    if (mergeValue && typeof mergeValue === 'object') {
      mergeValue = translations[mergeValue.textKey];
    }

    newValue = newValue.replace(`[${mergeKey}]`, mergeValue);
  });
  return newValue;
};

const mapStateToProps = (state, ownProps) => {
  if (!state.data.translations[ownProps.textKey] && !loggedMissingTranslations[ownProps.textKey]) {
    loggedMissingTranslations[ownProps.textKey] = 1;
    /* eslint-disable no-console */
    console.warn(`Recurring Orders MSP: Missing translation for ${ownProps.textKey}`);
  }

  return {
    value: ownProps.mergeFields ?
      applyMergeFields(state.data.translations, ownProps.textKey, ownProps.mergeFields)
      : state.data.translations[ownProps.textKey] || '',
  };
};

export default connect(mapStateToProps)(Translation);
