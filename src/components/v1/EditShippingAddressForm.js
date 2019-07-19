import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import UpdateOrderShippingMethod from './UpdateOrderShippingMethod';
import InputField from './InputField';
import SelectField from './SelectField';
import Button from './Button';
import Message from './Message';
import Translation from '../Translation';
import * as actions from '../../actions';
import ButtonGroup from './ButtonGroup';
import { MESSAGE_PROP_TYPE, ORDER_PROP_TYPE } from '../../constants/PropTypes';
import { getProvinceOptions, getProvinceName, countryHasProvinces } from '../../helpers/provinceHelpers';

class EditShippingAddressForm extends Component {
  constructor(props) {
    super(props);

    const { order } = props;

    this.state = {
      formInformation: {
        first_name: order.first_name,
        last_name: order.last_name,
        address1: order.address1,
        address2: order.address2,
        company: order.company,
        country: order.country,
        province: order.province,
        city: order.city,
        zip: order.zip,
        phone: order.phone,
      },
      editing: false,
      selectedCountry: order.country,
      updatingShippingAddress: false,
      updateShippingAddressButtonDisabled: true,
      inputErrors: {},
      dismissConflict: false,
    };

    this.enableEditing = this.enableEditing.bind(this);
    this.disableEditing = this.disableEditing.bind(this);
    this.shippingCountryChange = this.shippingCountryChange.bind(this);
    this.saveShippingAddress = this.saveShippingAddress.bind(this);
    this.checkFields = this.checkFields.bind(this);
    this.dismissMessage = this.dismissMessage.bind(this);
    this.selectedCountryZipRequired = this.selectedCountryZipRequired.bind(this);
    this.saveFromUpdateShippingMethod = this.saveFromUpdateShippingMethod.bind(this);
    this.formElement = null;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.shippingMessage) {
      if (nextProps.shippingMessage.type === 'success') {
        this.disableEditing();
      }
      this.setState({
        updatingShippingAddress: false,
      });
    }
    if (nextProps.getShippingRatesFailedMessage) {
      this.setState({
        dismissConflict: true,
      });
    }
  }

  getCountryOptions() {
    const { countries } = this.props;
    const countryOptions = [];

    let restOfWorldFound = false;

    countries.forEach((country) => {
      if (country.code === '*') {
        restOfWorldFound = true;
      } else {
        countryOptions.push({ name: country.name });
      }
    });

    if (restOfWorldFound) {
      Object.keys(window.Countries).forEach((country) => {
        if (countries.findIndex(c => c.name === country) === -1) {
          countryOptions.push({ name: country });
        }
      });
    }

    return countryOptions;
  }

  selectedCountryZipRequired() {
    return window.Countries[this.state.selectedCountry].zip_required;
  }

  shippingCountryChange(e) {
    this.setState({
      selectedCountry: e.target.value,
      updateShippingAddressButtonDisabled: false,
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

  checkFields(e) {
    const { inputErrors } = this.state;
    const optionalInputs = {
      address2: true,
      phone: true,
    };

    if (e.target.value === '' && !optionalInputs[e.target.name]) {
      inputErrors[e.target.name] = true;
    } else {
      delete inputErrors[e.target.name];
    }

    this.setState({
      updateShippingAddressButtonDisabled: Object.keys(inputErrors).length > 0,
      inputErrors,
    });
  }

  saveFromUpdateShippingMethod(shippingMethod) {
    this.props.updateShippingAddress(
      this.props.orderId,
      this.state.formInformation,
      shippingMethod,
    );
  }

  saveShippingAddress(e) {
    const { order } = this.props;
    const inputData = new FormData(this.formElement);
    const formInformation = {
      first_name: inputData.get('first_name'),
      last_name: inputData.get('last_name'),
      address1: inputData.get('address1'),
      address2: inputData.get('address2'),
      company: inputData.get('company'),
      country: inputData.get('country'),
      province: inputData.get('province') ? inputData.get('province') : '',
      city: inputData.get('city'),
      zip: inputData.get('zip') ? inputData.get('zip') : '',
      phone: inputData.get('phone'),
    };

    this.dismissMessage();

    e.preventDefault();
    this.props.dismissShippingMessage(order.id);

    this.setState({
      updateShippingAddressButtonDisabled: true,
      updatingShippingAddress: true,
      formInformation,
    });
    this.props.updateShippingAddress(
      order.id,
      formInformation,
      order.order_shipping_rate,
    );
  }

  dismissMessage() {
    const { order } = this.props;

    this.props.dismissShippingMessage(order.id);
    this.props.dismissGetShippingRatesFailedMessage(order.id);
    this.setState({
      dismissConflict: false,
    });
  }

  renderEditButton() {
    const { order, allowChangeShippingAddressPrepaid } = this.props;

    if (order.has_prepaid && !allowChangeShippingAddressPrepaid) {
      return null;
    }
    return (
      <div>
        <span
          role="presentation"
          className="text-button"
          onClick={this.enableEditing}
        >
          <Translation textKey="edit_button_text" />
        </span>
      </div>
    );
  }

  render() {
    const {
      order,
      shippingMessage,
      getShippingRatesFailedMessage,
    } = this.props;
    const selectedCountryHasProvinces = countryHasProvinces(this.state.selectedCountry);
    const provinces = getProvinceOptions(this.state.selectedCountry);
    // eslint-disable-next-line max-len
    const orderShippingProvince = getProvinceName(this.state.formInformation.country, this.state.formInformation.province);

    return this.state.editing ?
      (
        <div>
          <div className="subscription-details-block">
            <p><Translation textKey="msp_shipping_address" /></p>
          </div>
          {(!this.state.dismissConflict && this.state.editing && this.props.shippingMessage && this.props.shippingMessage.type === 'conflict') ?
            <UpdateOrderShippingMethod
              order={order}
              orderId={order.id}
              formInformation={this.state.formInformation}
              saveOnClick={this.saveFromUpdateShippingMethod}
              cancelOnClick={this.disableEditing}
            />
            :
            <form
              onSubmit={this.saveShippingAddress}
              ref={(el) => {
                this.formElement = el;
              }}
            >
              {getShippingRatesFailedMessage ?
                <Message
                  key="shipping-address-message"
                  title={getShippingRatesFailedMessage.message}
                  titleTextKey={getShippingRatesFailedMessage.messageTextKey}
                  type={getShippingRatesFailedMessage.type}
                  dismissable
                  onDismissClick={this.dismissMessage}
                /> : null}
              <div>
                <InputField
                  name="first_name"
                  id="first_name"
                  labelTextKey="msp_first_name"
                  error={this.state.inputErrors.first_name}
                  type="text"
                  defaultValue={this.state.formInformation.first_name}
                  onChange={this.checkFields}
                />
                <InputField
                  name="last_name"
                  id="last_name"
                  labelTextKey="msp_last_name"
                  error={this.state.inputErrors.last_name}
                  type="text"
                  defaultValue={this.state.formInformation.last_name}
                  onChange={this.checkFields}
                />
                <InputField
                  name="address1"
                  id="address1"
                  labelTextKey="msp_address"
                  error={this.state.inputErrors.address1}
                  type="text"
                  defaultValue={this.state.formInformation.address1}
                  onChange={this.checkFields}
                />
                <InputField
                  name="address2"
                  id="address2"
                  labelTextKey="address_2"
                  type="text"
                  defaultValue={this.state.formInformation.address2}
                  onChange={this.checkFields}
                />
                <InputField
                  name="company"
                  id="company"
                  labelTextKey="company"
                  type="text"
                  defaultValue={this.state.formInformation.company}
                  onChange={this.checkFields}
                />
                <SelectField
                  name="country"
                  defaultValue={this.state.selectedCountry}
                  error={this.state.inputErrors.country}
                  options={this.getCountryOptions()}
                  labelTextKey="msp_country"
                  onChange={this.shippingCountryChange}
                />
                {selectedCountryHasProvinces ?
                  <SelectField
                    name="province"
                    defaultValue={orderShippingProvince}
                    options={provinces}
                    labelTextKey="state_province"
                    onChange={this.checkFields}
                  />
                  : null // TODO add a hidden blank input when province is not required
                }
                <InputField
                  name="city"
                  id="city"
                  labelTextKey="msp_city"
                  error={this.state.inputErrors.city}
                  type="text"
                  defaultValue={this.state.formInformation.city}
                  onChange={this.checkFields}
                />
                {this.selectedCountryZipRequired() ?
                  <InputField
                    name="zip"
                    id="zip"
                    error={this.state.inputErrors.zip}
                    labelTextKey="zip_postal_code"
                    type="text"
                    defaultValue={this.state.formInformation.zip}
                    onChange={this.checkFields}
                  />
                  : null // TODO add a hidden blank input when zip is not required
                }
                <InputField
                  name="phone"
                  id="phone"
                  labelTextKey="phone_number"
                  type="text"
                  defaultValue={this.state.formInformation.phone}
                  onChange={this.checkFields}
                />
                <ButtonGroup>
                  <Button
                    name="save_shipping_address_changes"
                    loading={this.state.updatingShippingAddress}
                    type="submit"
                    textKey="save_button_text"
                    disabled={this.state.updateShippingAddressButtonDisabled}
                  />
                  <Button
                    textKey="cancel_button_text"
                    onClick={this.disableEditing}
                    btnStyle="secondary"
                  />
                </ButtonGroup>
              </div>
            </form>
          }
        </div>
      )
      :
      [
        (
          <div key="shipping-address-details" className="subscription-details-block">
            <p><Translation textKey="msp_shipping_address" /></p>
            <p>{order.first_name} {order.last_name}</p>
            <p>{order.address1}</p>
            {order.address2 ? <p>{order.address2}</p> : null}
            <p>{order.company}</p>
            <p>
              {order.city}
              {selectedCountryHasProvinces ? ` ${order.province}` : null}
              {this.selectedCountryZipRequired() ? `, ${order.zip}` : null}
            </p>
            <p>{order.country}</p>
            {
              order.phone ?
                <p>{order.phone}</p>
                : null
            }
            { this.renderEditButton() }
          </div>
        ),
        shippingMessage && (shippingMessage.type === 'success' || shippingMessage.type === 'error') ?
          <Message
            key="shipping-address-message"
            title={shippingMessage.message}
            titleTextKey={shippingMessage.messageTextKey}
            type={shippingMessage.type}
            dismissable
            onDismissClick={this.dismissMessage}
          /> : null,
      ];
  }
}

EditShippingAddressForm.propTypes = {
  order: ORDER_PROP_TYPE.isRequired,
  updateShippingAddress: PropTypes.func.isRequired,
  countries: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  orderId: PropTypes.number.isRequired,
  dismissGetShippingRatesFailedMessage: PropTypes.func.isRequired,
  shippingMessage: MESSAGE_PROP_TYPE,
  getShippingRatesFailedMessage: MESSAGE_PROP_TYPE,
  dismissShippingMessage: PropTypes.func.isRequired,
  allowChangeShippingAddressPrepaid: PropTypes.bool.isRequired,
};

EditShippingAddressForm.defaultProps = {
  shippingMessage: null,
  getShippingRatesFailedMessage: null,
};

const mapStateToProps = (state, ownProps) => ({
  order: state.data.orders.find(order => order.id === ownProps.orderId),
  countries: state.data.countries,
  shippingMessage: state.userInterface.shippingMessages[ownProps.orderId],
  getShippingRatesFailedMessage:
    state.userInterface.getShippingRatesFailedMessage[ownProps.orderId],
  shippingRates: state.userInterface.shippingRates[ownProps.orderId],
  allowChangeShippingAddressPrepaid:
    state.data.general_settings.allow_change_shipping_address_on_prepaid,
});

const mapDispatchToProps = dispatch => ({
  updateShippingAddress: (orderId, formInformation, orderShippingRate) => {
    dispatch(actions.orderUpdateShippingAddress(orderId, formInformation, orderShippingRate));
  },
  dismissShippingMessage: (orderId) => {
    dispatch(actions.dismissShippingMessage(orderId));
  },
  dismissGetShippingRatesFailedMessage: (orderId) => {
    dispatch(actions.dismissGetShippingRatesFailedMessage(orderId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EditShippingAddressForm);
