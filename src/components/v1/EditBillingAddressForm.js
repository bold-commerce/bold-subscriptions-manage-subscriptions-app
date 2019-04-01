import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import InputField from './InputField';
import SelectField from './SelectField';
import Button from './Button';
import Message from './Message';
import Translation from '../Translation';
import * as actions from '../../actions';
import ButtonGroup from './ButtonGroup';
import { MESSAGE_PROP_TYPE, ORDER_PROP_TYPE } from '../../constants/PropTypes';

class EditBillingAddressForm extends Component {
  constructor(props) {
    super(props);

    const { order } = props;

    this.state = {
      editing: false,
      selectedCountry: order.billing_country,
      updatingBillingAddress: false,
      updateBillingAddressButtonDisabled: true,
      inputErrors: {},
    };

    this.toggleEditing = this.toggleEditing.bind(this);
    this.billingCountryChange = this.billingCountryChange.bind(this);
    this.saveBillingAddress = this.saveBillingAddress.bind(this);
    this.checkFields = this.checkFields.bind(this);
    this.dismissMessage = this.dismissMessage.bind(this);
    this.selectedCountryHasProvinces = this.selectedCountryHasProvinces.bind(this);
    this.selectedCountryZipRequired = this.selectedCountryZipRequired.bind(this);
    this.getProvinceOptions = this.getProvinceOptions.bind(this);
    this.formElement = null;
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.updatingBillingAddress && nextProps.billingMessage && (nextProps.billingMessage.type === 'success' || nextProps.billingMessage.type === 'error')) {
      this.toggleEditing();
      this.setState({
        updatingBillingAddress: false,
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
        if (this.props.countries.findIndex(c => c.name === country) === -1) {
          countryOptions.push({ name: country });
        }
      });
    }

    return countryOptions;
  }

  getProvinceOptions() {
    if (!this.selectedCountryHasProvinces()) {
      return [];
    }

    return window.Countries[this.state.selectedCountry].provinces.map(p => ({ name: p }));
  }

  selectedCountryHasProvinces() {
    return window.Countries[this.state.selectedCountry].provinces !== null;
  }

  selectedCountryZipRequired() {
    return window.Countries[this.state.selectedCountry].zip_required;
  }

  billingCountryChange(e) {
    this.setState({
      selectedCountry: e.target.value,
      updateBillingAddressButtonDisabled: false,
    });
  }

  toggleEditing() {
    this.setState({ editing: !this.state.editing });
  }

  checkFields(e) {
    const { inputErrors } = this.state;
    const optionalInputs = {
      billing_address2: true,
      billing_phone: true,
    };

    if (e.target.value === '' && !optionalInputs[e.target.name]) {
      inputErrors[e.target.name] = true;
    } else {
      delete inputErrors[e.target.name];
    }

    this.setState({
      updateBillingAddressButtonDisabled: Object.keys(inputErrors).length > 0,
      inputErrors,
    });
  }

  saveBillingAddress(e) {
    const { order } = this.props;
    const inputData = new FormData(this.formElement);

    e.preventDefault();

    this.setState({
      updateBillingAddressButtonDisabled: true,
      updatingBillingAddress: true,
    });

    this.props.dismissBillingMessage(order.id);
    this.props.updateBillingAddress(
      order.id,
      {
        billing_first_name: inputData.get('billing_first_name'),
        billing_last_name: inputData.get('billing_last_name'),
        billing_address1: inputData.get('billing_address1'),
        billing_address2: inputData.get('billing_address2'),
        billing_company: inputData.get('billing_company'),
        billing_country: inputData.get('billing_country'),
        billing_province: inputData.get('billing_province'),
        billing_city: inputData.get('billing_city'),
        billing_zip: inputData.get('billing_zip'),
        billing_phone: inputData.get('billing_phone'),
      },
    );
  }

  dismissMessage() {
    const { order } = this.props;

    this.props.dismissBillingMessage(order.id);
  }

  renderEditButton() {
    return (
      <div>
        <span role="presentation" className="text-button" onClick={this.toggleEditing}>
          <Translation textKey="edit_button_text" />
        </span>
      </div>
    );
  }

  render() {
    const { order, billingMessage } = this.props;

    return this.state.editing ?
      (
        <div key={this.props.key}>
          <div className="subscription-details-block">
            <p><Translation textKey="msp_billing_address" /></p>
          </div>
          <form
            onSubmit={this.saveBillingAddress}
            ref={(el) => {
              this.formElement = el;
            }}
          >
            <InputField
              name="billing_first_name"
              id="billing_first_name"
              labelTextKey="msp_first_name"
              error={this.state.inputErrors.billing_first_name}
              type="text"
              defaultValue={order.billing_first_name}
              onChange={this.checkFields}
            />
            <InputField
              name="billing_last_name"
              id="billing_last_name"
              error={this.state.inputErrors.billing_last_name}
              labelTextKey="msp_last_name"
              type="text"
              defaultValue={order.billing_last_name}
              onChange={this.checkFields}
            />
            <InputField
              name="billing_address1"
              id="billing_address1"
              error={this.state.inputErrors.billing_address1}
              labelTextKey="msp_address"
              type="text"
              defaultValue={order.billing_address1}
              onChange={this.checkFields}
            />
            <InputField
              name="billing_address2"
              id="billing_address2"
              labelTextKey="address_2"
              type="text"
              defaultValue={order.billing_address2}
              onChange={this.checkFields}
            />
            <InputField
              name="billing_company"
              id="billing_company"
              error={this.state.inputErrors.billing_company}
              labelTextKey="company"
              type="text"
              defaultValue={order.billing_company}
              onChange={this.checkFields}
            />
            <SelectField
              name="billing_country"
              defaultValue={this.state.selectedCountry}
              error={this.state.inputErrors.billing_country}
              options={this.getCountryOptions()}
              labelTextKey="msp_country"
              onChange={this.billingCountryChange}
            />
            {this.selectedCountryHasProvinces() ?
              <SelectField
                name="billing_province"
                defaultValue={order.billing_province}
                options={this.getProvinceOptions()}
                labelTextKey="state_province"
                onChange={this.checkFields}
              />
              : null // TODO add a hidden blank input when province is not required
            }
            <InputField
              name="billing_city"
              id="billing_city"
              error={this.state.inputErrors.billing_city}
              labelTextKey="msp_city"
              type="text"
              defaultValue={order.billing_city}
              onChange={this.checkFields}
            />
            {this.selectedCountryZipRequired() ?
              <InputField
                name="billing_zip"
                id="billing_zip"
                error={this.state.inputErrors.billing_zip}
                labelTextKey="zip_postal_code"
                type="text"
                defaultValue={order.billing_zip}
                onChange={this.checkFields}
              />
              : null // TODO add a hidden blank input when zip is not required
            }
            <InputField
              name="billing_phone"
              id="billing_phone"
              labelTextKey="phone_number"
              type="text"
              defaultValue={order.billing_phone}
              onChange={this.checkFields}
            />
            <ButtonGroup>
              <Button
                loading={this.state.updatingBillingAddress}
                type="submit"
                textKey="save_button_text"
                disabled={this.state.updateBillingAddressButtonDisabled}
              />
              <Button
                textKey="cancel_button_text"
                onClick={this.toggleEditing}
                btnStyle="secondary"
              />
            </ButtonGroup>
          </form>
        </div>
      )
      :
      [
        (
          <div key="billing-address-details" className="subscription-details-block">
            <p><Translation textKey="msp_billing_address" /></p>
            <p>{order.billing_first_name} {order.billing_last_name}</p>
            <p>{order.billing_address1}</p>
            {order.billing_address2 ? <p>{order.billing_address2}</p> : null}
            <p>{order.billing_company}</p>
            <p>
              {order.billing_city}
              {this.selectedCountryHasProvinces() ? ` ${order.billing_province}` : null}
              {this.selectedCountryZipRequired() ? `, ${order.billing_zip}` : null}
            </p>
            <p>{order.billing_country}</p>
            {
              order.billing_phone ?
                <p>{order.billing_phone}</p>
                : null
            }
            { this.renderEditButton() }
          </div>
        ),
        billingMessage ?
          <Message
            key="billing-address-message"
            title={billingMessage.message}
            titleTextKey={billingMessage.messageTextKey}
            type={billingMessage.type}
            dismissable
            onDismissClick={this.dismissMessage}
          /> : null,
      ];
  }
}

EditBillingAddressForm.propTypes = {
  key: PropTypes.string,
  order: ORDER_PROP_TYPE.isRequired,
  updateBillingAddress: PropTypes.func.isRequired,
  countries: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  billingMessage: MESSAGE_PROP_TYPE,
  dismissBillingMessage: PropTypes.func.isRequired,
};

EditBillingAddressForm.defaultProps = {
  key: null,
  billingMessage: null,
};

const mapStateToProps = (state, ownProps) => ({
  order: state.data.orders.find(order => order.id === ownProps.orderId),
  countries: state.data.countries,
  billingMessage: state.userInterface.billingMessages[ownProps.orderId],
});
const mapDispatchToProps = dispatch => ({
  updateBillingAddress: (orderId, billingAddress) => {
    dispatch(actions.orderUpdateBillingAddress(orderId, billingAddress));
  },
  dismissBillingMessage: (orderId) => {
    dispatch(actions.dismissBillingMessage(orderId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EditBillingAddressForm);
