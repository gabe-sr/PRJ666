import React, { useState, useEffect } from "react";
import WithLoadingSpinner from "../../HOC/loading-spinner/WithLoadingSpinner";
import WithMessage from "../../HOC/modal-messages/WithMessage";
import UserQueryForm from "./UserQueryForm";
import TableWithPagination from "../../shared/table_data/TableWithPagination";
import axios from "axios";
import { Container, Button } from "react-bootstrap";
import { format } from "date-fns";
import ExcelComponent from "../../shared/excel-export/ExcelComponent";

const UserReport = (props) => {
  const { setLoadingSpinner, setModalMessage } = props;

  const [excelButton, setExcelButton] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const NUM_OF_ROWS = 20;

  const [data, setData] = useState();
  const [query, setQuery] = useState();
  const [prevQuery, setPrevQuery] = useState();
  const [textResponse, setTextResponse] = useState(null);
  const [paginationQuery, setPaginationQuery] = useState(
    `&startpage=0&maxrows=${NUM_OF_ROWS}`
  );

  const handlePaginationQuery = (pagQ) => {
    setPaginationQuery(pagQ);
    setQuery(prevQuery + pagQ);
  };

  const handleQuery = (_query) => {
    setQuery(_query + paginationQuery);
    setPrevQuery(_query);
  };

  useEffect(() => {
    if (query) {
      setData([]);
      setLoadingSpinner(true, "Generating report data...");

      const handleFetchReport = async (_query) => {
        try {
          let response = await axios.get(`/reports/users?${_query}`);

          // format date/time
          response.data.values.forEach((b) => {
            b.time = new Date(b.bookdate).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              timeZone: "UTC",
            });
            b.bookdate = format(new Date(b.bookdate), "dd-LLL-y, iii");
          });
          if (response.data.total === 0) {
            setTextResponse("Query returned no results.");
          } else {
            setExcelButton(true);
          }

          setData(response.data);
        } catch (err) {
          console.log(err);
          setTextResponse("Something went wrong. Please, try again later.");
          setModalMessage(
            true,
            "Something went wrong",
            "We couldn't generate the report at this moment. Please, try again later."
          );
        } finally {
          setLoadingSpinner(false);
        }
      };
      handleFetchReport(query);

      setQuery(null);
    }
  }, [query, setModalMessage, setLoadingSpinner]);

  const ExcelButton = () => {
    if (excelButton) {
      return (
        <ExcelComponent
          columns={[
            { col: "fullname", label: "User Name" },
            { col: "email", label: "Email" },
            { col: "cpf_no", label: "CPF" },
            { col: "booking_id", label: "Booking Id" },
            { col: "bookdate", label: "Date" },
            { col: "time", label: "Time" },
            { col: "room_name", label: "Room Name" },
            { col: "price_at_booking", label: "Price at Booking" },
            { col: "_isCancelled", label: "Booking Status" },
          ]}
          values={data.allData}
          name="Booking_General_Report"
          fileName={`booking_general_report`}
        />
      );
    }

    return (
      <Button
        type="button"
        className="mt-4 mb-4"
        size="sm"
        variant="outline-secondary"
        disabled
      >
        Export to Excel
      </Button>
    );
  };

  return (
    <>
      <h3 className="text-secondary text-left p-3">Booking report</h3>
      <Container className="p-3 text-left">
        <UserQueryForm setQuery={handleQuery}>
          <ExcelButton />
        </UserQueryForm>
        <hr />
        {!data || data.total === 0 ? (
          textResponse
        ) : (
          <TableWithPagination
            headers={[
              "Name",
              "Email",
              "CPF",
              "Booking Id",
              "Date",
              "Time slot",
              "Room Name",
              "Price",
              "Booking Status",
            ]}
            columns={[
              "fullname",
              "email",
              "cpf_no",
              "booking_id",
              "bookdate",
              "time",
              "room_name",
              "price_at_booking",
              "_isCancelled",
            ]}
            pagination={{
              max_rows: NUM_OF_ROWS,
              paginationTotal: data.total,
            }}
            paginationQuery={handlePaginationQuery}
            values={data.values}
            whenClicked={() => null}
          />
        )}
      </Container>
    </>
  );
};

export default WithLoadingSpinner(WithMessage(UserReport));
