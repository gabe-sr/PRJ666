import React from "react";
import ReactExport from "react-export-excel";
import { Button } from "react-bootstrap";
import { format, parseISO } from "date-fns";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

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

const ExcelComponent = ({ columns, values, name, fileName, ...props }) => {
  console.log(columns);
  console.log(values);
  return (
    <ExcelFile
      filename={fileName}
      element={
        <Button
          type="button"
          className="mt-4 mb-4"
          size="sm"
          variant="secondary"
        >
          Export to Excel
        </Button>
      }
    >
      <ExcelSheet data={values} name={name}>
        <ExcelColumn label="#" value={(item) => values.indexOf(item) + 1} />
        {columns.map((col, index) => {
          return (
            <ExcelColumn
              key={index}
              label={col.label}
              value={(item) => {
                switch (col.col) {
                  case "fullname":
                  case "user.fullname":
                    if (item.user) {
                      return `${item.user.first_name} ${item.user.last_name}`;
                    } else {
                      return `${item.first_name} ${item.last_name}`;
                    }

                  case "total":
                  case "price":
                  case "price_at_reservation":
                  case "price_at_booking":
                    return new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Object.byString(item, col.col));

                  case "lastBookingDate":
                  case "booking_date":
                    return `${format(
                      new Date(Object.byString(item, col.col)),
                      "dd-LLL-y, iii"
                    )} at ${parseISO(
                      Object.byString(item, col.col)
                    ).getUTCHours()}:00`;

                  default:
                    return Object.byString(item, col.col);
                }
              }}
            />
          );
        })}
      </ExcelSheet>

      {/* {values.map((data, index) => ()


        <ExcelColumn label="Name" value={name} />
        <ExcelColumn label="Wallet Money" value="amount" /> */}
    </ExcelFile>
  );
};

export default ExcelComponent;
