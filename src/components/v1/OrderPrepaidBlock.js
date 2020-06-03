import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Translation from '../Translation';
import Message from './Message';
import * as actions from '../../actions';
import ButtonGroup from './ButtonGroup';
import Button from './Button';
import { MESSAGE_PROP_TYPE, ORDER_PROP_TYPE } from '../../constants/PropTypes';
import SelectField from './SelectField';

const stopRenewOrder = '0';
const renewOrder = '1';
const cancelOrder = '2';

class OrderPrepaidBlock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editingPrepaidSettings: false,
      updatingPrepaidSettings: false,
      prepaidSetting: this.props.recurAfterLimit ? renewOrder : stopRenewOrder,
    };

    this.dismissMessage = this.dismissMessage.bind(this);
    this.toggleUpdatingOrderPrepaidSettings = this.toggleUpdatingOrderPrepaidSettings.bind(this);
    this.handlePrepaidSettingsOptionChange = this.handlePrepaidSettingsOptionChange.bind(this);
    this.getPrepaidSettingsOptions = this.getPrepaidSettingsOptions.bind(this);
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

  getPrepaidSettingsOptions() {
    const { order } = this.props;
    const options = [
      { name: this.props.renewTranslation, value: renewOrder },
      { name: this.props.stopRenewTranslation, value: stopRenewOrder },
    ];
    if (order.prepaid_settings.recurrence_count === 0) {
      options.push({ name: this.props.cancelTranslation, value: cancelOrder });
    }
    return options;
  }

  toggleUpdatingOrderPrepaidSettings() {
    this.dismissMessage();
    this.setState({
      editingPrepaidSettings: !this.state.editingPrepaidSettings,
      prepaidSetting: this.props.recurAfterLimit ? renewOrder : stopRenewOrder,
    });
  }

  handlePrepaidSettingsOptionChange(e) {
    this.setState({ prepaidSetting: e.target.value });
  }

  updatePrepaidSettings() {
    const { order } = this.props;
    if (this.state.prepaidSetting === stopRenewOrder) {
      this.props.orderUpdatePrepaidSettings(order.id, stopRenewOrder);
    } else if (this.state.prepaidSetting === renewOrder) {
      this.props.orderUpdatePrepaidSettings(order.id, renewOrder);
    } else if (this.state.prepaidSetting === cancelOrder) {
      this.props.cancelOrder(order.id);
    }
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
            <SelectField
              loading={this.state.loadingIcon}
              name="prepaid"
              value={this.state.prepaidSetting}
              options={this.getPrepaidSettingsOptions()}
              labelTextKey="order_prepaid_renew_question"
              onChange={this.handlePrepaidSettingsOptionChange}
            />
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
  cancelOrder: PropTypes.func.isRequired,
  updatePrepaidSettingsMessage: MESSAGE_PROP_TYPE,
  recurAfterLimit: PropTypes.number,
  renewTranslation: PropTypes.string,
  stopRenewTranslation: PropTypes.string,
  cancelTranslation: PropTypes.string,

};

OrderPrepaidBlock.defaultProps = {
  updatePrepaidSettingsMessage: null,
  recurAfterLimit: 0,
  renewTranslation: '',
  stopRenewTranslation: '',
  cancelTranslation: '',
};

const mapDispatchToProps = dispatch => ({
  orderUpdatePrepaidSettings: (orderId, recurrAfterLimit) => {
    dispatch(actions.orderUpdatePrepaidSettings(orderId, recurrAfterLimit));
  },
  dismissUpdatePrepaidSettingsMessage: (orderId) => {
    dispatch(actions.dismissUpdatePrepaidSettingsMessage(orderId));
  },
  cancelOrder: (orderId) => {
    dispatch(actions.orderCancelOrder(orderId, 'No reason'));
  },
});

const mapStateToProps = (state, ownProps) => ({
  order: state.data.orders.find(order => order.id === ownProps.orderId),
  recurAfterLimit: state.data.orders.find(order => order.id === ownProps.orderId)
    .prepaid_settings.recurr_after_limit,
  generalSettings: state.data.general_settings,
  updatePrepaidSettingsMessage: state.userInterface.updatePrepaidSettingsMessages[ownProps.orderId],
  renewTranslation: state.data.translations.order_prepaid_renew_yes,
  stopRenewTranslation: state.data.translations.order_prepaid_renew_no,
  cancelTranslation: state.data.translations.cancel_block_heading,

});

export default connect(mapStateToProps, mapDispatchToProps)(OrderPrepaidBlock);
