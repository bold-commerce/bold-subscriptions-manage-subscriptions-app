import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Translation from '../Translation';
import Message from './Message';
import * as actions from '../../actions';
import Input from './Input';
import ButtonGroup from './ButtonGroup';
import Button from './Button';
import { MESSAGE_PROP_TYPE, ORDER_PROP_TYPE } from '../../constants/PropTypes';

class OrderPrepaidBlock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editingPrepaidSettings: false,
      updatingPrepaidSettings: false,
      prepaidSettingChecked: Boolean(this.props.recurAfterLimit),
    };

    this.dismissMessage = this.dismissMessage.bind(this);
    this.toggleUpdatingOrderPrepaidSettings = this.toggleUpdatingOrderPrepaidSettings.bind(this);
    this.handlePrepaidSettingsOptionChange = this.handlePrepaidSettingsOptionChange.bind(this);
    this.updatePrepaidSettings = this.updatePrepaidSettings.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.updatePrepaidSettingsMessage) {
      this.setState({
        updatingPrepaidSettings: false,
        editingPrepaidSettings: false,
      });
    }
  }

  toggleUpdatingOrderPrepaidSettings() {
    this.dismissMessage();
    this.setState({
      editingPrepaidSettings: !this.state.editingPrepaidSettings,
      prepaidSettingChecked: Boolean(this.props.recurAfterLimit),
    });
  }

  handlePrepaidSettingsOptionChange() {
    this.setState({ prepaidSettingChecked: !this.state.prepaidSettingChecked });
  }

  updatePrepaidSettings() {
    this.props.orderUpdatePrepaidSettings(
      this.props.order.id,
      this.state.prepaidSettingChecked ? 1 : 0,
    );
    this.setState({
      updatingPrepaidSettings: true,
    });
  }

  dismissMessage() {
    const { order } = this.props;
    this.props.dismissUpdatePrepaidSettingsMessage(order.id);
  }

  renderPrepaidRenewSetting() {
    const { order } = this.props;

    if (this.state.editingPrepaidSettings) {
      return (
        <div>
          <div>
            <Input
              type="checkbox"
              id={`${order.id}-prepaid-setting-checkbox`}
              checked={this.state.prepaidSettingChecked}
              onChange={this.handlePrepaidSettingsOptionChange}
            />
            <label htmlFor={`${order.id}-prepaid-setting-checkbox`}>
              <Translation textKey="order_prepaid_renew_question" />
            </label>
          </div>
          <ButtonGroup align="left" >
            <Button
              btnStyle="primary"
              textKey="select_save"
              loading={this.state.updatingPrepaidSettings}
              disabled={this.state.updatingPrepaidSettings}
              onClick={this.updatePrepaidSettings}
            />
            <Button
              btnStyle="secondary"
              textKey="select_cancel"
              onClick={this.toggleUpdatingOrderPrepaidSettings}
            />
          </ButtonGroup>
        </div>
      );
    }

    if (order.prepaid_settings.recurr_after_limit) {
      return (<Translation textKey="order_prepaid_renew_yes" />);
    }
    return (<Translation textKey="order_prepaid_renew_no" />);
  }

  renderPrepaidSettingsMessage() {
    const { updatePrepaidSettingsMessage } = this.props;
    if (updatePrepaidSettingsMessage) {
      return (
        <Message
          key="shipping-address-message"
          title={updatePrepaidSettingsMessage.message}
          titleTextKey={this.props.updatePrepaidSettingsMessage.messageTextKey}
          type={updatePrepaidSettingsMessage.type}
          dismissable
          onDismissClick={this.dismissMessage}
        />);
    }
    return null;
  }

  renderEditButton() {
    if (this.props.generalSettings.allow_manage_prepaid && !this.state.editingPrepaidSettings) {
      return (
        <span
          className="text-button"
          role="presentation"
          onClick={this.toggleUpdatingOrderPrepaidSettings}
        >
          <Translation textKey="edit_button_text" />
        </span>
      );
    }
    return null;
  }

  render() {
    const { order } = this.props;

    return (
      <Fragment>
        <Translation
          textKey="order_prepaid_detail"
          mergeFields={{
                recurrence_count: order.prepaid_settings.recurrence_count,
                total_recurrences: order.prepaid_settings.total_recurrences,
              }}
        />
        { this.renderPrepaidRenewSetting() }
        { this.renderEditButton() }
        { this.renderPrepaidSettingsMessage() }
      </Fragment>
    );
  }
}

OrderPrepaidBlock.propTypes = {
  order: ORDER_PROP_TYPE.isRequired,
  generalSettings: PropTypes.shape({
    allow_manage_prepaid: PropTypes.bool.isRequired,
  }).isRequired,
  orderUpdatePrepaidSettings: PropTypes.func.isRequired,
  dismissUpdatePrepaidSettingsMessage: PropTypes.func.isRequired,
  updatePrepaidSettingsMessage: MESSAGE_PROP_TYPE,
  recurAfterLimit: PropTypes.number,
};

OrderPrepaidBlock.defaultProps = {
  updatePrepaidSettingsMessage: null,
  recurAfterLimit: 0,
};

const mapDispatchToProps = dispatch => ({
  orderUpdatePrepaidSettings: (orderId, recurrAfterLimit) => {
    dispatch(actions.orderUpdatePrepaidSettings(orderId, recurrAfterLimit));
  },
  dismissUpdatePrepaidSettingsMessage: (orderId) => {
    dispatch(actions.dismissUpdatePrepaidSettingsMessage(orderId));
  },
});

const mapStateToProps = (state, ownProps) => ({
  order: state.data.orders.find(order => order.id === ownProps.orderId),
  recurAfterLimit: state.data.orders.find(order => order.id === ownProps.orderId)
    .prepaid_settings.recurr_after_limit,
  generalSettings: state.data.general_settings,
  updatePrepaidSettingsMessage: state.userInterface.updatePrepaidSettingsMessages[ownProps.orderId],
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderPrepaidBlock);
