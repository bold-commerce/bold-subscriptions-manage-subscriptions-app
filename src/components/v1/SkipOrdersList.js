import React from 'react';
import { connect } from 'react-redux';

import Table from './Table';
import Translation from '../Translation';
import SkipResumeButton from './SkipResumeButton';
import { ORDER_PROP_TYPE } from '../../constants/PropTypes';

const SkipOrdersList = ({
  order,
}) => {
  let content = null;

  if (order.next_orders.length > 0) {
    const headerTranslationKeys = [
      'skip_order_list_next_order_header',
      'skip_order_list_action_header',
    ];
    const nextOrderKeys = ['next_order', 'action'];
    const tableHeaders = headerTranslationKeys.map(t => <Translation textKey={t} />);
    const tableRowKeys = order.next_orders;
    const tableRowData = order.next_orders.map(nextOrder => [
      nextOrder,
      <SkipResumeButton orderToUpdate={order} orderDate={nextOrder} />,
    ]);

    content = (<Table
      headers={tableHeaders}
      rowData={tableRowData}
      rowKeys={tableRowKeys}
      columnKeys={nextOrderKeys}
    />);
  }

  return (
    <div>
      { content }
    </div>);
};

SkipOrdersList.propTypes = {
  order: ORDER_PROP_TYPE.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  order: state.data.orders.find(order => order.id === ownProps.orderId),
});

export default connect(mapStateToProps)(SkipOrdersList);
