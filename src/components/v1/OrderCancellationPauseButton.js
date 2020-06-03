import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import Button from './Button';
import { ORDER_PROP_TYPE } from '../../constants/PropTypes';

class OrderCancellationPauseButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };

    this.pauseSubscription = this.pauseSubscription.bind(this);
    this.resumeSubscription = this.resumeSubscription.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.order.is_paused !== this.props.order.is_paused) {
      this.setState({
        loading: false,
      });
    }
  }

  pauseSubscription() {
    this.props.pauseSubscription(this.props.order.id);
    this.setState({
      loading: true,
    });
  }

  resumeSubscription() {
    this.props.resumeSubscription(this.props.order.id);
    this.setState({
      loading: true,
    });
  }
  render() {
    const { order } = this.props;

    return order.is_paused ?
      <Button
        textKey="resume_subscription_button_text"
        onClick={() => this.resumeSubscription(order.id)}
        loading={this.state.loading}
        disabled={this.state.loading}
      />
      :
      <Button
        textKey="pause_subscription_button_text"
        onClick={() => this.pauseSubscription(order.id)}
        loading={this.state.loading}
        disabled={this.state.loading}
      />;
  }
}

OrderCancellationPauseButton.propTypes = {
  order: ORDER_PROP_TYPE.isRequired,
  pauseSubscription: PropTypes.func.isRequired,
  resumeSubscription: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  translations: state.data.translations,
});

const mapDispatchToProps = dispatch => ({
  pauseSubscription: (orderId) => {
    dispatch(actions.orderPauseSubscription(orderId));
  },
  resumeSubscription: (orderId) => {
    dispatch(actions.orderResumeSubscription(orderId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderCancellationPauseButton);
