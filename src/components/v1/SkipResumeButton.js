import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import Button from './Button';
import { ORDER_PROP_TYPE } from '../../constants/PropTypes';

class SkipResumeButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      skipLoading: false,
      resumeLoading: false,
    };

    this.skipOrder = this.skipOrder.bind(this);
    this.resumeOrder = this.resumeOrder.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.skipLoading
      && nextProps.orderToUpdate.order_exceptions.includes(nextProps.orderDate)) {
      this.setState({
        skipLoading: false,
      });
    }

    if (this.state.resumeLoading
      && !nextProps.orderToUpdate.order_exceptions.includes(nextProps.orderDate)) {
      this.setState({
        resumeLoading: false,
      });
    }
  }

  skipOrder() {
    this.props.skipOrder(this.props.orderToUpdate.id, this.props.orderDate);
    this.setState({
      skipLoading: true,
    });
  }

  resumeOrder() {
    this.props.resumeOrder(this.props.orderToUpdate.id, this.props.orderDate);
    this.setState({
      resumeLoading: true,
    });
  }

  render() {
    const { orderToUpdate, orderDate } = this.props;

    return orderToUpdate.order_exceptions.includes(orderDate) ?
      <Button
        textKey="resume_shipment_button_text"
        onClick={() => this.resumeOrder(orderToUpdate.id, orderDate)}
        loading={this.state.resumeLoading}
        disabled={this.state.resumeLoading}
        btnStyle="alert-link"
      />
      :
      <Button
        textKey="skip_shipment_button_text"
        onClick={() => this.skipOrder(orderToUpdate.id, orderDate)}
        loading={this.state.skipLoading}
        disabled={this.state.skipLoading}
        btnStyle="alert-link"
      />;
  }
}

SkipResumeButton.propTypes = {
  orderToUpdate: ORDER_PROP_TYPE.isRequired,
  orderDate: PropTypes.string.isRequired,
  skipOrder: PropTypes.func.isRequired,
  resumeOrder: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  order: state.data.orders.find(order => order.id === ownProps.orderId),
});

const mapDispatchToProps = dispatch => ({
  skipOrder: (orderId, date) => {
    dispatch(actions.orderSkipOrder(orderId, date));
  },
  resumeOrder: (orderId, date) => {
    dispatch(actions.orderResumeOrder(orderId, date));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SkipResumeButton);
