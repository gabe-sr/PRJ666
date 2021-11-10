// CUSTOM TABLE DATA COMPONENT: renders a table of data
// Props:
// values =  array of objects to be displayed
// headers =  array of headers
// columns =  array of columns (headers and columns must be in the same order)
// whenClicked = a callback to do something when clicking in a row
// customColumn = renders a custom column element (eg.: the activate green/red button)

import React from "react";
import { Table } from "react-bootstrap";
import { format, parseISO } from "date-fns";

const NewTableData = ({ values, whenClicked, customColumn, ...props }) => {
  // helper function to access nested object propertios by string
  Object.byString = function (o, s) {
    s = s.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
    s = s.replace(/^\./, ""); // strip a leading dot
    var a = s.split(".");
    for (var i = 0, n = a.length; i < n; ++i) {
      var k = a[i];
      if (k in o) {
        o = o[k];
      } else {
        return;
      }
    }
    return o;
  };

  return (
    <Table bordered responsive hover size="sm">
      <thead>
        <tr>
          <th>#</th>
          {props.headers.map((head, index) => (
            <th key={index}>{head}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {values.map((data, index) => (
          <tr style={{ cursor: "pointer" }} key={index}>
            <td onClick={() => whenClicked(data)}>{index + 1}</td>

            {props.columns.map((colName, index) => {
              switch (colName) {
                case "fullname":
                  if (data.user) {
                    return (
                      <td
                        onClick={() => whenClicked(data)}
                        key={index}
                      >{`${data.user.first_name} ${data.user.last_name}`}</td>
                    );
                  } else {
                    return (
                      <td
                        onClick={() => whenClicked(data)}
                        key={index}
                      >{`${data.first_name} ${data.last_name}`}</td>
                    );
                  }
                case "total":
                case "price":
                case "price_at_reservation":
                  return (
                    <td onClick={() => whenClicked(data)} key={index}>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(Object.byString(data, colName))}
                    </td>
                  );

                case "createdAt":
                case "date":
                case "booking_date":
                  return (
                    <td onClick={() => whenClicked(data)} key={index}>
                      {format(
                        new Date(Object.byString(data, colName)),
                        "dd-LLL-y, iii"
                      )}
                    </td>
                  );

                case "booking_date2":
                  return(
                    <td 
                        key={index} 
                        onClick={() => whenClicked(data)}
                    >
                            {`${format(parseISO(data.booking_date), "iii '-' do 'of' MMMM', ' yyyy")} 
                            at ${parseISO(data.booking_date).getUTCHours()}:00`}
                    </td>
                  );

                // Custom Column data: returns a custom component passed in the props
                // repeat for any future customized column component
                case "activeAuthorize":
                  const { customColumnComp } = customColumn.find(
                    (fnc) => fnc.colDesc === "activeAuthorize"
                  );
                  return <td key={index}>{customColumnComp(data)}</td>;

                //Custom Column data: returns a custom html tag for the table element 
                //containing relevant information about cancellation status
                case "cancelStatus":
                  const { customColumnComp2 } = customColumn.find(
                    (fnc)=> fnc.colDesc === "cancelStatus"
                  );
                  return <td key={index}>{customColumnComp2(data)}</td>;

                default:
                  return (
                    <td onClick={() => whenClicked(data)} key={index}>
                      {Object.byString(data, colName)}
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

export default NewTableData;
