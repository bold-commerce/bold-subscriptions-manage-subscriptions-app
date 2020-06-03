import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { SingleDatePicker } from 'react-dates';
import moment from 'moment/moment';
import Button from './Button';
import Message from './Message';
import Translation from '../Translation';
import * as actions from '../../actions';
import { MOMENT_DATE_FORMAT } from '../../constants';
import { isDateInPast } from '../../helpers/validationHelpers';
import ButtonGroup from './ButtonGroup';
import { ORDER_PROP_TYPE, MESSAGE_PROP_TYPE } from '../../constants/PropTypes';

class NextShipDateBlock extends Component {
  constructor(props) {
    super(props);

    const nextShipDate = props.order.next_active_ship_date ?
      props.order.next_active_ship_date : props.order.next_ship_date;

    this.state = {
      date: nextShipDate,
      updatingNextShipDate: false,
      updateNextShipDateButtonDisabled: false,
      editing: false,
    };

    this.enableEditing = this.enableEditing.bind(this);
    this.disableEditing = this.disableEditing.bind(this);
    this.updateState = this.updateState.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    this.dismissMessage = this.dismissMessage.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.updateNextShipDateMessage) {
      this.disableEditing();
      this.setState({
        updatingNextShipDate: false,
        updateNextShipDateButtonDisabled: false,
        date: nextProps.order.next_ship_date,
      });
    }
  }
  getOrderDateWarningText() {
    if (this.state.date && moment(this.state.date).startOf('day').isSame(moment().startOf('day'))) {
      return (
        <React.Fragment>
          <Translation textKey="next_order_date_warning" />&nbsp;
          <Translation textKey="next_order_date_same_date_warning" />
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <Translation textKey="next_order_date_warning" />&nbsp;
        <Translation textKey="next_order_date_processing_notice" />
      </React.Fragment>
    );
  }
  updateState(date) {
    if (date) {
      if (isDateInPast(date)) {
        this.setState({
          date: moment().format('YYYY-MM-DD'),
        });
      } else {
        this.setState({ date: date.format('YYYY-MM-DD') });
      }
    }
  }
  saveChanges() {
    if (this.props.order.next_ship_date === this.state.date) {
      return this.disableEditing();
    }

    this.setState({
      updatingNextShipDate: true,
      updateNextShipDateButtonDisabled: true,
    });
    return this.props.updateNextShipDate(this.props.order.id, moment(this.state.date).format('YYYY-MM-DD'));
  }
  enableEditing() {
    this.dismissMessage();
    this.setState({
      editing: true,
    });
  }
  disableEditing() {
    this.setState({
      editing: false,
      date: this.props.order.next_ship_date,
    });
  }
  dismissMessage() {
    const { order } = this.props;
    this.props.dismissUpdateNextShipDateMessage(order.id);
  }

  render() {
    const datePickerInput = (
      <SingleDatePicker
        small
        hideKeyboardShortcutsPanel
        date={moment(this.state.date)}
        isDayBlocked={isDateInPast}
        isOutsideRange={isDateInPast}
        onDateChange={this.updateState}
        displayFormat={() => MOMENT_DATE_FORMAT}
        numberOfMonths={1}
        focused={this.state.focused}
        onFocusChange={({ focused }) => this.setState({ focused })}
      />
    );

    return this.state.editing ?
      (
        <div className="next-order-date__container">
          <b><Translation textKey="next_order_date" />&nbsp;</b>
          <span className="msp__date-picker">{datePickerInput}</span>
          <Message
            type="warning"
            onDismissClick={this.dismissMessage}
          >
            {this.getOrderDateWarningText()}
          </Message>
          <ButtonGroup>
            <Button
              loading={this.state.updatingNextShipDate}
              textKey="save_button_text"
              onClick={this.saveChanges}
              disabled={this.state.updateNextShipDateButtonDisabled}
            />
            <Button
              textKey="cancel_button_text"
              onClick={this.disableEditing}
              disabled={this.state.updateNextShipDateButtonDisabled}
              btnStyle="secondary"
            />
          </ButtonGroup>
        </div>
      ) :
      (
        <React.Fragment>
          {this.props.updateNextShipDateMessage ?
            <Message
              key="shipping-address-message"
              title={this.props.updateNextShipDateMessage.message}
              titleTextKey={this.props.updateNextShipDateMessage.messageTextKey}
              type={this.props.updateNextShipDateMessage.type}
              dismissable
              onDismissClick={this.dismissMessage}
            /> : null
                    }
          <div className="next-order-date__container">
            <b><Translation textKey="next_order_date" /> </b>
            {moment(this.state.date).format(MOMENT_DATE_FORMAT)}
            {this.props.allowChangeShippingDate ? (
              <span className="text-button" role="presentation" onClick={this.enableEditing}>&nbsp;
                <Translation textKey="change_order_date" />
              </span>
              ) : null}
          </div>
        </React.Fragment>
      );
  }
}

NextShipDateBlock.propTypes = {
  dismissUpdateNextShipDateMessage: PropTypes.func.isRequired,
  updateNextShipDate: PropTypes.func.isRequired,
  updateNextShipDateMessage: MESSAGE_PROP_TYPE,
  order: ORDER_PROP_TYPE.isRequired,
  allowChangeShippingDate: PropTypes.bool.isRequired,
};

NextShipDateBlock.defaultProps = {
  updateNextShipDateMessage: null,
};

const mapStateToProps = (state, ownProps) => ({
  order: state.data.orders.find(order => order.id === ownProps.orderId),
  allowChangeShippingDate: state.data.general_settings.allow_change_shipping_date,
  updateNextShipDateMessage: state.userInterface.updateNextShipDateMessage[ownProps.orderId],
});

const mapDispatchToProps = dispatch => ({
  updateNextShipDate: (orderId, newDate) => {
    dispatch(actions.orderUpdateNextShipDate(orderId, newDate));
  },
  dismissUpdateNextShipDateMessage: (orderId) => {
    dispatch(actions.dismissUpdateNextShipDateMessage(orderId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(NextShipDateBlock);
