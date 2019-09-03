import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Translation from '../Translation';
import SelectField from './SelectField';
import Button from './Button';
import Message from './Message';
import * as actions from '../../actions';
import ButtonGroup from './ButtonGroup';
import { MESSAGE_PROP_TYPE, ORDER_PROP_TYPE } from '../../constants/PropTypes';

class OrderFrequencyBlock extends Component {
  constructor(props) {
    super(props);

    const { order } = props;

    this.enableEditing = this.enableEditing.bind(this);
    this.disableEditing = this.disableEditing.bind(this);
    this.getFrequencyOptions = this.getFrequencyOptions.bind(this);
    this.getIntervalOptions = this.getIntervalOptions.bind(this);
    this.frequencyChange = this.frequencyChange.bind(this);
    this.intervalChange = this.intervalChange.bind(this);
    this.saveFrequencyInterval = this.saveFrequencyInterval.bind(this);
    this.dismissMessage = this.dismissMessage.bind(this);
    this.matchIntervalType = this.matchIntervalType.bind(this);

    this.state = {
      editing: true,
      selectedFrequency: order.interval_number,
      selectedInterval: this.matchIntervalType(order.interval_type_id),
      updatingFrequencyInterval: false,
      updateFrequencyIntervalButtonDisabled: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.frequencyIntervalMessage) {
      this.props.toggleEdit();
      this.setState({
        updatingFrequencyInterval: false,
      });
    }
  }

  getFrequencyOptions() {
    const { group } = this.props;
    const frequencyArray = [];

    for (let i = 0; i < group.frequency_info.frequency_max; i += 1) {
      frequencyArray.push({ name: i + 1 });
    }
    return frequencyArray;
  }

  getIntervalOptions() {
    const { group } = this.props;
    const intervalArray = [];

    for (let i = 0; i < group.frequency_info.frequency_types.length; i += 1) {
      const frequencyTextKey = `interval_type_${group.frequency_info.frequency_types[i].interval_id}`;
      const frequencyTranslationText =
        window.manageSubscription.initialState.data.translations[frequencyTextKey];
      intervalArray.push({
        name: frequencyTranslationText,
        value: group.frequency_info.frequency_types[i].interval_text,
        id: group.frequency_info.frequency_types[i].interval_id,
      });
    }
    return intervalArray;
  }

  matchIntervalType(intervalType) {
    const { group } = this.props;

    for (let i = 0; i < group.frequency_info.frequency_types.length; i += 1) {
      if (intervalType === group.frequency_info.frequency_types[i].interval_id) {
        return group.frequency_info.frequency_types[i].interval_text;
      }
    }
    return null;
  }

  frequencyChange(e) {
    this.setState({
      selectedFrequency: e.target.value,
      updateFrequencyIntervalButtonDisabled: false,
    });
  }

  intervalChange(e) {
    this.setState({
      selectedInterval: e.target.value,
      updateFrequencyIntervalButtonDisabled: false,
    });
  }

  disableEditing() {
    this.setState({
      editing: false,
    });
  }

  enableEditing() {
    this.dismissMessage();
    this.setState({
      editing: true,
    });
  }

  saveFrequencyInterval(e) {
    const { order, group } = this.props;
    const inputData = new FormData(this.formElement);
    let intervalId = null;

    for (let i = 0; i < group.frequency_info.frequency_types.length; i += 1) {
      if (inputData.get('interval') === group.frequency_info.frequency_types[i].interval_text) {
        intervalId = group.frequency_info.frequency_types[i].interval_id;
      }
    }
    const formInformation = {
      frequency: inputData.get('frequency'),
      interval: intervalId,
    };

    e.preventDefault();

    this.setState({
      updateFrequencyIntervalButtonDisabled: true,
      updatingFrequencyInterval: true,
    });
    this.props.updateFrequencyInterval(
      order.id,
      formInformation,
    );
  }

  dismissMessage() {
    const { order } = this.props;

    this.props.dismissFrequencyIntervalMessage(order.id);
  }

  render() {
    const { order, group } = this.props;

    return (
      <div>
        {this.state.editing ?
          <form
            onSubmit={this.saveFrequencyInterval}
            ref={(el) => {
              this.formElement = el;
            }}
          >
            <SelectField
              name="frequency"
              defaultValue={`${this.state.selectedFrequency}`}
              options={this.getFrequencyOptions()}
              labelTextKey="msp_frequency"
              onChange={this.frequencyChange}
            />
            <SelectField
              name="interval"
              defaultValue={`${this.state.selectedInterval}`}
              options={this.getIntervalOptions()}
              labelTextKey="interval"
              onChange={this.intervalChange}
            />
            <ButtonGroup>
              <Button
                name="save_frequency_interval_changes"
                loading={this.state.updatingFrequencyInterval}
                type="submit"
                textKey="save_button_text"
                disabled={this.state.updateFrequencyIntervalButtonDisabled}
              />
              <Button
                textKey="cancel_button_text"
                onClick={this.disableEditing}
                btnStyle="secondary"
              />
            </ButtonGroup>
          </form>
          :
          <div>
            {this.props.frequencyIntervalMessage ?
              <Message
                key="shipping-address-message"
                title={this.props.frequencyIntervalMessage.message}
                titleTextKey={this.props.frequencyIntervalMessage.messageTextKey}
                type={this.props.frequencyIntervalMessage.type}
                dismissable
                onDismissClick={this.dismissMessage}
              />
              :
              null
            }
            <Translation
              textKey="order_frequency"
              mergeFields={{
                interval_number: order.interval_number,
                interval_type: {
                  textKey: `interval_type_${order.interval_type_id}`,
                },
              }}
            />
            &nbsp;
            {group.frequency_info.is_fixed_interval ?
              null
              :
              <span
                key="change_frequency"
                role="presentation"
                className="text-button"
                onClick={this.enableEditing}
              >
                <Translation textKey="change_frequency" />
              </span>
            }
          </div>
        }
      </div>
    );
  }
}

OrderFrequencyBlock.propTypes = {
  dismissFrequencyIntervalMessage: PropTypes.func.isRequired,
  frequencyIntervalMessage: MESSAGE_PROP_TYPE,
  order: ORDER_PROP_TYPE.isRequired,
  group: PropTypes.shape({}).isRequired,
  toggleEdit: PropTypes.func,
  updateFrequencyInterval: PropTypes.func.isRequired,
};

OrderFrequencyBlock.defaultProps = {
  frequencyIntervalMessage: null,
  toggleEdit: null,
};

const mapStateToProps = (state, ownProps) => ({
  frequencyIntervalMessage: state.userInterface.frequencyIntervalMessage[ownProps.orderId],
  order: state.data.orders.find(order => order.id === ownProps.orderId),
  group:
    state.data.groups.find(
      group => group.id === state.data.orders.find(
        order => order.id === ownProps.orderId,
      ).group_id,
    ),
});

const mapDispatchToProps = dispatch => ({
  updateFrequencyInterval: (orderId, formInformation) => {
    dispatch(actions.orderUpdateFrequencyInterval(orderId, formInformation));
  },
  dismissFrequencyIntervalMessage: (orderId) => {
    dispatch(actions.dismissFrequencyIntervalMessage(orderId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderFrequencyBlock);
