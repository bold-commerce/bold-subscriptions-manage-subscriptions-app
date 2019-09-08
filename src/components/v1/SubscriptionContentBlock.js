import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Translation from '../Translation';

class SubscriptionContentBlock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      detailsAltered: false,
    };

    this.toggleBody = this.toggleBody.bind(this);
    this.editClick = this.editClick.bind(this);
  }

  toggleBody() {
    this.setState({ detailsAltered: !this.state.detailsAltered });
  }

  editClick(e) {
    e.stopPropagation();
    this.props.editOnClick();
  }

  renderEditTitle() {
    if (!this.state.detailsAltered
      || this.props.editTitleTranslationKey === null
      || this.props.editOnClick === null
    ) {
      return null;
    }

    return (
      <div
        onClick={this.editClick}
        role="presentation"
      >
        {!this.props.showEditTitle ? null : (
          <span className="text-button">
            <Translation textKey={this.props.editTitleTranslationKey} />
          </span>
        )}
      </div>
    );
  }

  render() {
    return (
      <div className="subscription-content-block">
        <div className="subscription-content-block-body">
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
};

SubscriptionContentBlock.defaultProps = {
  children: null,
  editOnClick: null,
  editTitleTranslationKey: null,
  showEditTitle: true,
};

export default SubscriptionContentBlock;
