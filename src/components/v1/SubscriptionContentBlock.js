import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Translation from '../Translation';

class SubscriptionContentBlock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      detailsAltered: props.opened || false,
    };

    this.toggleBody = this.toggleBody.bind(this);
    this.editClick = this.editClick.bind(this);
  }

  toggleBody() {
    const detailsAltered = !this.state.detailsAltered;
    this.setState({ detailsAltered });
    this.props.toggleVisibility();
  }

  editClick(e) {
    e.stopPropagation();
    this.props.editOnClick();
  }

  renderEditTitle() {
    if (!this.state.detailsAltered
      || (this.props.editTitleTranslationKey === null && this.props.editTitleIcon === null)
      || this.props.editOnClick === null
    ) {
      return null;
    }

    return (
      <div
        onClick={this.editClick}
        role="presentation"
      >
        {!this.props.showEditTitle && this.props.editTitleTranslationKey ? null : (
          <span className="text-button">
            <Translation textKey={this.props.editTitleTranslationKey} />
          </span>
        )}
        {this.props.showEditTitle && this.props.editTitleIcon
          && <p role="presentation">{this.props.editTitleIcon}</p>}
      </div>
    );
  }

  render() {
    const { toggleable } = this.props;
    return (
      <div className={classnames('subscription-content-block', this.props.className)}>
        <div className="subscription-content-block-header">
          <p onClick={() => toggleable && this.toggleBody()} role="presentation">
            <Translation textKey={this.props.titleTranslationKey} />
            <span className={classnames('subscription-content-chevron', this.state.detailsAltered ? 'altered' : '')}>&gt;</span>
          </p>
          {this.renderEditTitle()}
        </div>
        <div className={classnames('subscription-content-block-body', this.state.detailsAltered ? '' : 'altered')}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

SubscriptionContentBlock.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  editOnClick: PropTypes.func,
  editTitleTranslationKey: PropTypes.string,
  titleTranslationKey: PropTypes.string.isRequired,
  showEditTitle: PropTypes.bool,
  toggleVisibility: PropTypes.func,
  editTitleIcon: PropTypes.string,
  className: PropTypes.string,
  toggleable: PropTypes.bool,
  opened: PropTypes.bool,
};

SubscriptionContentBlock.defaultProps = {
  children: null,
  editOnClick: null,
  editTitleTranslationKey: null,
  showEditTitle: true,
  editTitleIcon: null,
  toggleVisibility: () => {},
  className: '',
  toggleable: true,
  opened: false
};

export default SubscriptionContentBlock;
