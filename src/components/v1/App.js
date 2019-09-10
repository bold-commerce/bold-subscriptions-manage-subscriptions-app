import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

import * as actions from '../../actions/index';
import SubscriptionsContainer from './subscription';
import ProgressBar from './ProgressBar';
import Translation from '../Translation';
import Message from './Message';
import LoadingSpinner from './LoadingSpinner';
import { REDIRECT_TO_LOGIN_DELAY } from '../../constants';

class App extends Component {
  static renderCustomerError() {
    return (
      <React.Fragment>
        <Message type="error">
          <Translation textKey="msp_error_reload_page" />
        </Message>
        <LoadingSpinner />
      </React.Fragment>
    );
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };

    this.clearLoading = this.clearLoading.bind(this);
  }

  componentDidMount() {
    this.props.initialize();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.loadingPercentage === 1) {
      setTimeout(this.clearLoading, 600);
    }
    if (nextProps.customerLoggedOutError) {
      setTimeout(() => {
        window.location.href = `https://${window.location.hostname}/account/login?checkout_url=${window.location.href}&return_url=${window.location.href}`;
      }, REDIRECT_TO_LOGIN_DELAY);
    }
  }

  getLoadingTitle() {
    const { translations } = this.props;

    switch (this.props.loadingProgress) {
      case 0:
        return translations.progress_authenticating;
      case 1:
        return translations.progress_loading_order;
      case 2:
        return 'Adjusting next order dates';
      case 3:
        return translations.progress_done;
      default:
        return undefined;
    }
  }

  clearLoading() {
    this.setState({ loading: false });
  }

  renderGreetingHeader() {
    const { customer } = this.props;
    return (
      <h3>
        <Translation
          textKey="greeting_header"
          mergeFields={{
            customer_first_name: customer.firstName,
            customer_last_name: customer.lastName,
          }}
        />
      </h3>
    );
  }

  renderOrders() {
    if (this.props.orders.length === 0) {
      return <div className="no-subscriptions"><Translation textKey="no_subscriptions" /></div>;
    }
    return (
      <SubscriptionsContainer orders={this.props.orders} />
    );
  }

  render() {
    return this.props.customerLoggedOutError ? App.renderCustomerError() : (
      <div className="manage-subscription-page">
        {
          this.state.loading ?
            <ProgressBar
              percentage={this.props.loadingPercentage}
              title={this.getLoadingTitle()}
            /> :
            this.renderOrders()
        }
      </div>
    );
  }
}

App.propTypes = {
  customer: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
  }).isRequired,
  initialize: PropTypes.func.isRequired,
  loadingPercentage: PropTypes.number.isRequired,
  loadingProgress: PropTypes.number.isRequired,
  orders: PropTypes.arrayOf(PropTypes.shape({})),
  translations: PropTypes.shape({}).isRequired,
  customerLoggedOutError: PropTypes.bool.isRequired,
};

App.defaultProps = {
  orders: [],
};

const mapStateToProps = state => ({
  customer: state.data.customer,
  orders: (state.data.orders || []).filter(o => o.order_products.length > 0),
  translations: state.data.translations,
  loadingPercentage: state.userInterface.loadingProgress / state.userInterface.loadingTotal,
  loadingProgress: state.userInterface.loadingProgress,
  customerLoggedOutError: state.userInterface.customerLoggedOutError,
});

const mapDispatchToProps = dispatch => ({
  initialize: () => {
    dispatch(actions.appAuthenticate());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
