import React from 'react';
import PropTypes from 'prop-types';

const Table = ({
  columnKeys, rowData, rowKeys, headers,
}) => (
  <table className="subscription-responsive-table">
    <thead>
      <tr>
        {
          headers.map((content, i) => (
            <th key={columnKeys[i]}>
              {content}
            </th>
          ))
        }
      </tr>
    </thead>
    <tbody>
      {
        rowData.map((row, i) => (
          <tr key={rowKeys[i]}>
            {row.map((col, j) => (
              <td key={`cell-${rowKeys[i]}-${columnKeys[j]}`}>
                <div
                  className="subscription-responsive-cell-collapse"
                >
                  {headers[j]}
                </div>
                <div
                  className="subscription-responsive-cell-body"
                >
                    {typeof col === 'string' ? (
                        <span dangerouslySetInnerHTML={{__html: col}} />
                    ) : col}
                </div>
              </td>
            ))}
          </tr>
        ))
      }
    </tbody>
  </table>
);

Table.propTypes = {
  columnKeys: PropTypes.arrayOf(
    PropTypes.any,
  ).isRequired,
  rowKeys: PropTypes.arrayOf(
    PropTypes.any,
  ).isRequired,
  headers: PropTypes.arrayOf(PropTypes.any).isRequired,
  rowData: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.any),
  ).isRequired,
};

export default Table;
