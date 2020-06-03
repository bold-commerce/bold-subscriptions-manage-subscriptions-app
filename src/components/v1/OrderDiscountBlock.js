import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as actions from '../../actions';

import Button from './Button';
import InputField from './InputField';
import SubscriptionContentBlock from './SubscriptionContentBlock';
import Translation from '../Translation';
import Message from './Message';
import Table from './Table';
import ButtonGroup from './ButtonGroup';
import { ORDER_PROP_TYPE, MESSAGE_PROP_TYPE } from '../../constants/PropTypes';

class OrderDiscountBlock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      discountCode: '',
      applyDiscountButtonDisabled: true,
      applyingDiscount: false,
    };

    this.updateDiscountCodeState = this.updateDiscountCodeState.bind(this);
    this.applyDiscountCode = this.applyDiscountCode.bind(this);
    this.dismissMessage = this.dismissMessage.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.discountMessage) {
      this.setState({
        applyingDiscount: false,
      });
    }
  }

  updateDiscountCodeState(e) {
    const { target: { value } } = e;

    this.setState({
      discountCode: value,
      applyDiscountButtonDisabled: value === '',
    });
  }

  applyDiscountCode() {
    this.props.dismissDiscountMessage(this.props.order.id);
    this.props.applyDiscountCode(this.props.order.id, this.state.discountCode);
    this.setState({
      discountCode: '',
      applyDiscountButtonDisabled: true,
      applyingDiscount: true,
    });
  }

  dismissMessage() {
    this.props.dismissDiscountMessage(this.props.order.id);
  }

  render() {
    const { order, allowChangeDiscounts } = this.props;
    let discountQueue = null;

    if (order.discount_queue && order.discount_queue.length > 0) {
      const headerTranslationKeys = [
        'discount_queue_discount_code_header',
        'discount_queue_description_header',
      ];
      const queueKeys = [
        'discount_code',
        'discount_description',
      ];
      const tableHeaders = headerTranslationKeys.map(t => <Translation textKey={t} />);
      const tableRowKeys = order.discount_queue.map(queue => queue.discount_queue_id);
      const tableRowData = order.discount_queue.map(queue => queueKeys.reduce((a, columnName) => {
        const columnValue = queue[columnName];
        a.push(columnValue);
        return a;
      }, []));

      discountQueue = (
        <Table
          headers={tableHeaders}
          rowData={tableRowData}
          rowKeys={tableRowKeys}
          columnKeys={queueKeys}
        />
      );
    }

    return (
      <SubscriptionContentBlock
        titleTranslationKey="order_discount_title"
      >
        { allowChangeDiscounts && !order.has_prepaid ?
          <p><Translation textKey="discount_code_description" /></p> :
          null }
        {order.discount ?
          <div className="subscription-details-block">
            <p><Translation textKey="discount_block_heading" /></p>
            <p>{order.discount.discount_code} - {order.discount.discount_details}</p>
          </div>
          : <p><Translation textKey="discount_code_not_applied" /></p>
        }
        {
          this.props.discountMessage ?
            <Message
              title={this.props.discountMessage.message}
              titleTextKey={this.props.discountMessage.messageTextKey}
              type={this.props.discountMessage.type}
              dismissable
              onDismissClick={this.dismissMessage}
            /> :
            null
        }
        {
          allowChangeDiscounts && !order.has_prepaid ?
            <div>
              <InputField
                id="new_discount_code"
                labelTextKey="new_discount_code"
                type="text"
                onChange={this.updateDiscountCodeState}
                value={this.state.discountCode}
              />
              <ButtonGroup align="right">
                <Button
                  textKey="apply_discount_button_text"
                  onClick={this.applyDiscountCode}
                  disabled={this.state.applyDiscountButtonDisabled}
                  loading={this.state.applyingDiscount}
                />
              </ButtonGroup>
            </div> :
            null
        }
        {order.discount_queue && order.discount_queue.length > 0 ?
          <h4 className="discount-queue-title">
            <Translation textKey="discount_queue_block_heading" />
          </h4> : null}
        {discountQueue}
      </SubscriptionContentBlock>
    );
  }
}

OrderDiscountBlock.propTypes = {
  order: ORDER_PROP_TYPE.isRequired,
  applyDiscountCode: PropTypes.func.isRequired,
  discountMessage: MESSAGE_PROP_TYPE,
  dismissDiscountMessage: PropTypes.func.isRequired,
  allowChangeDiscounts: PropTypes.bool.isRequired,
};

OrderDiscountBlock.defaultProps = {
  discountMessage: null,
};

const mapStateToProps = (state, ownProps) => ({
  order: state.data.orders.find(order => order.id === ownProps.orderId),
  discountMessage: state.userInterface.discountMessages[ownProps.orderId],
  allowChangeDiscounts: state.data.general_settings.allow_change_discounts,
});

const mapDispatchToProps = dispatch => ({
  applyDiscountCode: (orderId, discountCode) => {
    dispatch(actions.orderApplyDiscountCode(orderId, discountCode));
  },
  dismissDiscountMessage: (orderId) => {
    dispatch(actions.dismissDiscountMessage(orderId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderDiscountBlock);
