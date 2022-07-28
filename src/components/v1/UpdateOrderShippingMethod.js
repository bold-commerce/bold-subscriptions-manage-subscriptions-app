import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import formatMoney from '../../helpers/moneyFormatHelpers';

import * as actions from '../../actions';
import SelectField from './SelectField';
import ButtonGroup from './ButtonGroup';
import Button from './Button';
import Message from './Message';
import { ORDER_PROP_TYPE } from '../../constants/PropTypes';

class UpdateOrderShippingMethod extends Component {
  static showShippingSource(rate, exchangeRateValue, currencyFormat) {
    const exchangeRate = [0, 1, '', null].indexOf(exchangeRateValue) === -1 ? exchangeRateValue : 1;
    const price = formatMoney(rate.price * exchangeRate * 100, currencyFormat);

    if (!rate.source ||
      rate.source === 'bold' ||
      rate.source === 'cashier' ||
      rate.source === 'shopify'
    ) {
      return `${rate.name} - ${price}`;
    }
    return `${rate.name} - ${price} - ${rate.source}`;
  }

  constructor(props) {
    super(props);
    const { order } = props;

    this.state = {
      loadingIcon: true,
      updatingShippingMethodMessage: 'loading_new_shipping_rates',
      saveButtonDisabled: true,
      shippingAddressError: false,
      updatingShippingMethod: false,
      selectedShippingRate: order.order_shipping_rate.hash,
      id: Math.random(),
    };

    this.saveChanges = this.saveChanges.bind(this);
    this.getShippingRateOptions = this.getShippingRateOptions.bind(this);
    this.shippingRateChange = this.shippingRateChange.bind(this);
  }

  componentWillMount() {
    this.props.getShippingRates(this.props.orderId, this.getOrderShippingRateRelatedAttributes());
    this.props.setCurrentUpdateOrderShippingMethodComponentKey(this.props.orderId, this.state.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.shippingRates.length > 0) {
      this.setState({
        loadingIcon: false,
        updatingShippingMethodMessage: this.props.labelTextKey,
        selectedShippingRate: nextProps.shippingRates.findIndex(
          rate => rate.hash === this.state.selectedShippingRate,
        ) === -1 ? nextProps.shippingRates[0].hash : this.state.selectedShippingRate,
        saveButtonDisabled: false,
      });
    }
    if (nextProps.currentUpdateOrderShippingMethodKey) {
      if (nextProps.currentUpdateOrderShippingMethodKey.key !== this.state.id) {
        this.props.cancelOnClick();
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.selectedShippingRate !== prevState.selectedShippingRate) {
      const { shippingRates } = this.props;
      const selectedShippingRate = shippingRates.find(
        rate => rate.hash === this.state.selectedShippingRate,
      );
      if (this.props.onChange !== null) {
        this.props.onChange(selectedShippingRate);
      }
    }
  }

  getOrderProducts() {
    const { order } = this.props;
    const products = order.order_products.map(prod => (
      {
        product_internal_id: prod.id,
        quantity: prod.quantity,
      }
    ));

    return JSON.stringify(products);
  }

  getOrderShippingRateRelatedAttributes() {
    const { order } = this.props;

    return {
      zip: order.zip,
      country: order.country,
      city: order.city,
      province: order.province,
      order_products: this.getOrderProducts(),
      ...this.props.formInformation,
    };
  }

  getShippingRateOptions() {
    return this.props.shippingRates.length > 0
      ? this.props.shippingRates.map(rate => ({
        name: UpdateOrderShippingMethod.showShippingSource(
          rate,
          this.props.order.currency_exchange_rate,
          this.props.order.currency_format,
        ),
        value: rate.hash,
      }))
      : [];
  }

  shippingRateChange(e) {
    this.setState({
      selectedShippingRate: e.target.value,
    });
  }

  saveChanges() {
    const { shippingRates } = this.props;
    const selectedShippingRate = shippingRates.find(
      rate => rate.hash === this.state.selectedShippingRate,
    );

    this.setState({
      updatingShippingMethod: true,
    });

    this.props.saveOnClick(selectedShippingRate);
  }

  render() {
    return (
      <div>
        {this.state.shippingAddressError ?
          <Message
            key="shipping-address-message"
            titleTextKey="shipping_address_error"
            type="error"
            dismissable
            onDismissClick={this.dismissMessage}
          />
          :
          null
        }
        <SelectField
          loading={this.state.loadingIcon}
          name="shipping_method"
          value={this.state.selectedShippingRate}
          options={this.getShippingRateOptions()}
          labelTextKey={this.state.updatingShippingMethodMessage}
          onChange={this.shippingRateChange}
        />
        {this.props.children}
        <div className="shipping-method-buttons">
          <ButtonGroup align="right">
            <Button
              loading={this.state.updatingShippingMethod}
              type="submit"
              textKey="save_button_text"
              onClick={this.saveChanges}
              disabled={this.state.saveButtonDisabled}
              className=""
            />
            <Button
              textKey="cancel_button_text"
              onClick={this.props.cancelOnClick}
              className=""
              btnStyle="secondary"
            />
          </ButtonGroup>
        </div>
      </div>
    );
  }
}

UpdateOrderShippingMethod.propTypes = {
  setCurrentUpdateOrderShippingMethodComponentKey: PropTypes.func.isRequired,
  cancelOnClick: PropTypes.func.isRequired,
  saveOnClick: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  orderId: PropTypes.number.isRequired,
  order: ORDER_PROP_TYPE.isRequired,
  currentUpdateOrderShippingMethodKey: PropTypes.shape({ key: PropTypes.number }),
  shippingRates: PropTypes.arrayOf(PropTypes.shape({ hash: PropTypes.string.isRequired })),
  formInformation: PropTypes.shape({}),
  getShippingRates: PropTypes.func.isRequired,
  labelTextKey: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

UpdateOrderShippingMethod.defaultProps = {
  currentUpdateOrderShippingMethodKey: {},
  shippingRates: [],
  formInformation: {},
  labelTextKey: 'update_shipping_method',
  onChange: null,
  children: null,
};

const mapStateToProps = (state, ownProps) => ({
  order: state.data.orders.find(order => order.id === ownProps.orderId),
  shippingRates: state.userInterface.shippingRates[ownProps.orderId],
  currentUpdateOrderShippingMethodKey:
    state.userInterface.currentUpdateOrderShippingMethodKey[ownProps.orderId],
});

const mapDispatchToProps = dispatch => ({
  getShippingRates: (orderId, formInformation) => {
    dispatch(actions.orderGetShippingRates(orderId, formInformation));
  },
  setCurrentUpdateOrderShippingMethodComponentKey: (orderId, key) => {
    dispatch(actions.setCurrentUpdateOrderShippingMethodComponentKey(orderId, key));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdateOrderShippingMethod);
