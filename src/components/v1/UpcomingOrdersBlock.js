import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import * as actions from '../../actions';

import SubscriptionContentBlock from './SubscriptionContentBlock';
import UpcomingOrder from './UpcomingOrder';
import UpcomingOrderBuildABox from './UpcomingOrderBuildABox';
import OrderProductEditQuantityBlock from './OrderProductEditQuantityBlock';
import Translation from '../Translation';
import Message from './Message';
import { ORDER_PROP_TYPE, MESSAGE_PROP_TYPE } from '../../constants/PropTypes';

class UpcomingOrdersBlock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editingQuantity: false,
      editQuantityDate: null,
    };

    this.toggleEditQuantity = this.toggleEditQuantity.bind(this);
    this.dismissMessage = this.dismissMessage.bind(this);
  }

  toggleEditQuantity(date) {
    if (!this.state.editingQuantity) {
      this.dismissMessage();
    }
    this.setState({
      editingQuantity: !this.state.editingQuantity,
      editQuantityDate: date,
    });
  }

  dismissMessage() {
    this.props.dismissProductUpcomingQuantityMessage(this.props.order.id);
  }

  render() {
    const { order } = this.props;

    let upcomingOrderList = (
      order.next_orders.map(d => (
        order.build_a_box ?
          <UpcomingOrderBuildABox key={`${order.id}-${d}`} orderId={order.id} date={d} /> :
          <UpcomingOrder key={`${order.id}-${d}`} orderId={order.id} date={d} toggleEditQuantity={this.toggleEditQuantity} />
      ))
    );
    if (this.state.editingQuantity) {
      upcomingOrderList = (
        <div className="upcoming-order-edit-quantity">
          <h5>
            <Translation textKey="upcoming_order_date" />
          </h5>
          <p className="upcoming-order-edit-date">{moment(this.state.editQuantityDate).format('MMMM D, YYYY')}</p>
          {
            <OrderProductEditQuantityBlock
              orderId={order.id}
              toggleEdit={this.toggleEditQuantity}
              orderDate={this.state.editQuantityDate}
            />
          }
        </div>
      );
    }
    return (
      <SubscriptionContentBlock
        titleTranslationKey="upcoming_orders_title"
      >
        {
          this.props.productUpcomingQuantityMessage && this.props.productUpcomingQuantityMessage.type === 'success' ?
            <Message
              key="edit-quantity-message"
              title={this.props.productUpcomingQuantityMessage.message}
              titleTextKey={this.props.productUpcomingQuantityMessage.messageTextKey}
              type={this.props.productUpcomingQuantityMessage.type}
              dismissable
              onDismissClick={this.dismissMessage}
            />
            : null
        }
        {upcomingOrderList}
      </SubscriptionContentBlock>
    );
  }
}

UpcomingOrdersBlock.propTypes = {
  order: ORDER_PROP_TYPE.isRequired,
  productUpcomingQuantityMessage: MESSAGE_PROP_TYPE,
  dismissProductUpcomingQuantityMessage: PropTypes.func.isRequired,
};

UpcomingOrdersBlock.defaultProps = {
  productUpcomingQuantityMessage: null,
};

const mapStateToProps = (state, ownProps) => ({
  order: state.data.orders.find(order => order.id === ownProps.orderId),
  productUpcomingQuantityMessage:
    state.userInterface.productUpcomingQuantityMessages[ownProps.orderId],
});

const mapDispatchToProps = dispatch => ({
  getUpcomingQuantity: (orderId, orderDate) => {
    dispatch(actions.orderProductGetUpcomingQuantity(
      orderId, orderDate,
    ));
  },
  dismissProductUpcomingQuantityMessage: (orderId, productId) => {
    dispatch(actions.dismissProductUpcomingQuantityMessage(orderId, productId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(UpcomingOrdersBlock);
