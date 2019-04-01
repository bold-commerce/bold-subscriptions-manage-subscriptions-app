import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from './Button';
import * as actions from '../../actions';
import { MESSAGE_PROP_TYPE } from '../../constants/PropTypes';

class OrderCancelButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cancellingOrder: false,
    };

    this.cancelOrder = this.cancelOrder.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.cancellingOrder && nextProps.cancelOrderMessage) {
      this.setState({
        cancellingOrder: false,
      });
    }
  }

  cancelOrder() {
    const { orderId, cancelReason } = this.props;
    this.props.cancelOrder(orderId, cancelReason);
    this.setState({
      cancellingOrder: true,
    });
  }

  render() {
    return (
      <Button
        btnStyle="alert"
        textKey="cancel_block_heading"
        loading={this.state.cancellingOrder}
        disabled={this.state.cancellingOrder}
        onClick={this.cancelOrder}
      />
    );
  }
}

OrderCancelButton.propTypes = {
  orderId: PropTypes.number.isRequired,
  cancelOrder: PropTypes.func.isRequired,
  cancelReason: PropTypes.string,
  cancelOrderMessage: MESSAGE_PROP_TYPE,
};

OrderCancelButton.defaultProps = {
  cancelReason: 'No Reason',
  cancelOrderMessage: null,
};

const mapStateToProps = (state, ownProps) => ({
  cancelOrderMessage: state.userInterface.cancelOrderMessages[ownProps.orderId],
});

const mapDispatchToProps = dispatch => ({
  cancelOrder: (orderId, cancelReason) => {
    dispatch(actions.orderCancelOrder(orderId, cancelReason));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderCancelButton);
