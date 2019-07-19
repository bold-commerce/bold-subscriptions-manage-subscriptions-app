import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import ProductImages from './ProductImages';
import ProductList from './ProductList';
import Translation from '../Translation';
import Button from './Button';
import SkipResumeButton from './SkipResumeButton';
import { ORDER_PROP_TYPE } from '../../constants/PropTypes';

class UpcomingOrder extends Component {
  constructor(props) {
    super(props);

    this.onClickToggleEditQuantity = this.onClickToggleEditQuantity.bind(this);
  }

  onClickToggleEditQuantity() {
    this.props.toggleEditQuantity(this.props.date);
  }

  render() {
    const { order, date } = this.props;
    const displayPrice = !order.build_a_box
        || (order.build_a_box === true && order.is_price_based_on_choices === true);
    return (
      <div className="upcoming-order">
        <div className="flex-column flex-column-quarter">
          <ProductImages products={order.order_products} />
        </div>
        <div className="flex-column flex-column-three-quarters">
          <div className="upcoming-order-details">
            <div className="flex-column">
              <div className="subscription-details-block">
                <p><Translation textKey="upcoming_order_date" /></p>
                <p>{moment(date).format('MMMM D, YYYY')}</p>
              </div>
              <ProductList
                products={order.order_products}
                headingTextKey="products_list_heading"
                orderQuantities={
                  order.order_product_exceptions.find(exception => exception.date === date) ?
                  order.order_product_exceptions.find(exception => exception.date === date).products
                    : order.order_products
                }
                displayPrice={displayPrice}
                currencyFormat={order.currency_format}
              />
            </div>
            <div className="flex-column align-right">
              {
                order.has_prepaid ? null :
                <p>
                  <Button
                    textKey="edit_quantity_button_text"
                    btnStyle="link"
                    onClick={this.onClickToggleEditQuantity}
                  />
                </p>
              }
              <p>
                <SkipResumeButton orderToUpdate={order} orderDate={date} />
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

UpcomingOrder.propTypes = {
  order: ORDER_PROP_TYPE.isRequired,
  date: PropTypes.string.isRequired,
  toggleEditQuantity: PropTypes.func,
};

UpcomingOrder.defaultProps = {
  toggleEditQuantity: null,
};

const mapStateToProps = (state, ownProps) => ({
  order: state.data.orders.find(order => order.id === ownProps.orderId),
});

export default connect(mapStateToProps)(UpcomingOrder);
