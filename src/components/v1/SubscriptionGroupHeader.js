import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ProductImages from './ProductImages';
import ProductList from './ProductList';
import OrderFrequencyBlock from './OrderFrequencyBlock';
import NextShipDateBlock from './NextShipDateBlock';
import Translation from '../Translation';
import Message from './Message';
import * as OrderHookTypes from '../../constants/OrderHookTypes';
import OrderPrepaidBlock from './OrderPrepaidBlock';
import { ORDER_PROP_TYPE } from '../../constants/PropTypes';
import CardInformationBlock from './CardInformationBlock';
import PauseResumeButton from './PauseResumeButton';

class SubscriptionGroupHeader extends Component {
  renderSubscriptionTitle() {
    const { order } = this.props;
    const mergeFields = {
      order_id: order.id,
      product_title: order.order_products[0].product_title,
      product_count: order.order_products.length,
    };

    if (order.order_products.length === 1) {
      return (
        <Translation
          textKey="subscription_title_one_product"
          mergeFields={mergeFields}
        />
      );
    }

    return (
      <Translation
        textKey="subscription_title_multiple_products"
        mergeFields={mergeFields}
      />
    );
  }

  renderPauseResumeStatus() {
    const { order } = this.props;
    return (
      <React.Fragment>
        { order.is_paused ?
          <Translation textKey="paused_subscription_status" /> :
          <Translation textKey="active_subscription_status" />
        }
      </React.Fragment>
    );
  }

  renderPauseResumeButton() {
    const { order, allowPauseSubscription } = this.props;
    return (
      <React.Fragment>
        { allowPauseSubscription ?
          <React.Fragment>&nbsp;<PauseResumeButton order={order} /></React.Fragment> :
          null
        }
      </React.Fragment>
    );
  }

  renderSubscriptionStatus() {
    return (
      <React.Fragment>
        <p>
          <Translation textKey="subscription_status_heading" />
        </p>
        { this.renderPauseResumeStatus() }
        { this.renderPauseResumeButton() }
      </React.Fragment>
    );
  }

  renderOrderHooksWarning() {
    const { order } = this.props;

    if (order.order_hooks.length > 0) {
      return (
        <Message type="info">
          {
            order.order_hooks.map((orderHook) => {
              switch (orderHook.title) {
                case OrderHookTypes.ORDER_HOOK_TYPE_SWITCH_PRICE:
                case OrderHookTypes.ORDER_HOOK_TYPE_SWITCH_PRODUCT:
                  return (
                    <p key="order_hook_switch_price_product_warning">
                      <Translation textKey="order_hook_switch_price_product_warning" />
                    </p>
                  );
                case OrderHookTypes.ORDER_HOOK_TYPE_MAKE_CANCELLABLE:
                  return (
                    <p key="order_hook_make_cancellable_warning">
                      <Translation textKey="order_hook_make_cancellable_warning" />
                    </p>
                  );
                default:
                  return null;
              }
            })
          }
        </Message>
      );
    }
    return null;
  }

  renderAddToExisting() {
    return (
        <div className="subscription-details-block">
          <a className="ro-translation-pause_subscription_button_text add_existing_link" href="https://vitally.com/collections" target="_blank" rel="noopener noreferrer">
            Add to existing pack
          </a>
        </div>
    );
  }

  render() {
    const { order, allowPauseSubscription } = this.props;

    return (
      <div className="subscription-header">
        <ProductImages products={order.order_products} />
        <div className="subscription-details-container">
          <h3>{this.renderSubscriptionTitle()}</h3>
          {
            this.props.hasDeletedProducts ?
              <Message
                type="error"
                key="deleted-product-message"
                titleTextKey="order_deleted_product"
              /> : null
          }
          <NextShipDateBlock orderId={this.props.order.id} />
          { order.has_prepaid ?
            <OrderPrepaidBlock orderId={order.id} /> : null }
          <div className="subscription-details-block-container">
            <div className="flex-column flex-column-half">
              <ProductList
                products={order.order_products}
                displayPrice={false}
                currencyFormat={order.currency_format}
              />
              <div className="subscription-details-block">
                <p><Translation textKey="shipping_info_heading" /></p>
                <p>{order.first_name} {order.last_name}</p>
                <p>{order.address1}</p>
                {order.address2 ? <p>{order.address2}</p> : null}
                <p>{order.company}</p>
                <p>{order.city} {order.province}, {order.zip}</p>
                <p>{order.country}</p>
              </div>
            </div>
            <div className="flex-column flex-column-half">
              <div className="subscription-details-block">
                <p><Translation textKey="payment_info_heading" /></p>
                <CardInformationBlock card={order.credit_card} />
              </div>
              <div className="subscription-details-block">
                <p><Translation textKey="order_frequency_heading" /></p>
                <OrderFrequencyBlock orderId={this.props.order.id} />
              </div>
              <div className="subscription-details-block">
                { !order.is_paused && !allowPauseSubscription ?
                  null :
                  this.renderSubscriptionStatus()
                }
              </div>
              { this.renderAddToExisting()}
            </div>
          </div>
          { this.renderOrderHooksWarning() }
        </div>
      </div>
    );
  }
}

SubscriptionGroupHeader.propTypes = {
  order: ORDER_PROP_TYPE.isRequired,
  hasDeletedProducts: PropTypes.bool.isRequired,
  allowPauseSubscription: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const order = state.data.orders.find(o => o.id === ownProps.orderId);
  const hasDeletedProducts = order.order_products.filter(prod => prod.status === 1).length > 0;
  const allowPauseSubscription = state.data.general_settings.allow_pause_subscription || false;
  return {
    order,
    hasDeletedProducts,
    allowPauseSubscription,
  };
};

export default connect(mapStateToProps)(SubscriptionGroupHeader);
