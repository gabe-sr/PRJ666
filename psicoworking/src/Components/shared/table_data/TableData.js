// CUSTOM TABLE DATA COMPONENT: renders a table of data
// Props:
// values =  array of objects to be displayed
// headers =  array of headers
// columns =  array of columns (headers and columns must be in the same order)
// whenClicked = a callback to do something when clicking in a row
// customColumn = renders a custom column element (eg.: the activate green/red button)

import React from "react";
import { Table } from "react-bootstrap";

const TableData = ({ values, whenClicked, customColumn, ...props }) => {
  return (
    <Table bordered hover size="sm">
      <thead>
        <tr>
          <th>#</th>
          {props.headers.map((head, index) => (
            <th key={index}>{head}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {values.map((user, index) => (
          <tr style={{ cursor: "pointer" }} key={user._id}>
            <td onClick={() => whenClicked(user)}>{index + 1}</td>

            {props.columns.map((colName, index) => {
              switch (colName) {
                case "fullname":
                  return (
                    <td
                      onClick={() => whenClicked(user)}
                      key={index}
                    >{`${user.first_name} ${user.last_name}`}</td>
                  );

                // Custom Column data: returns a custom component passed in the props
                // repeat for any future customized column component
                case "activeAuthorize":
                  const { customColumnComp } = customColumn.find(
                    (fnc) => fnc.colDesc === "activeAuthorize"
                  );
                  return <td key={index}>{customColumnComp(user)}</td>;

                default:
                  return (
                    <td onClick={() => whenClicked(user)} key={index}>
                      {user[colName]}
                    </td>
                  );
              }
            })}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TableData;
