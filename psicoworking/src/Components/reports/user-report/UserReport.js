import React, { useState, useEffect } from "react";
import WithLoadingSpinner from "../../HOC/loading-spinner/WithLoadingSpinner";
import WithMessage from "../../HOC/modal-messages/WithMessage";
import UserQueryForm from "./UserQueryForm";
import TableWithPagination from "../../shared/table_data/TableWithPagination";
import axios from "axios";
import { Container } from "react-bootstrap";
import { format } from "date-fns";

const UserReport = (props) => {
  const { setLoadingSpinner, setModalMessage } = props;

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
            b.time = new Date(b.booking_date).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              timeZone: "UTC",
            });
            b.booking_date = format(new Date(b.booking_date), "dd-LLL-y, iii");
          });
          if (response.data.total === 0) {
            setTextResponse("Query returned no results.");
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

  return (
    <>
      <h3 className="text-secondary text-left p-3">Booking report</h3>
      <Container className="p-3 text-left">
        <UserQueryForm setQuery={handleQuery} />
        <hr />
        {!data || data.total === 0 ? (
          textResponse
        ) : (
          <TableWithPagination
            headers={[
              "Name",
              "Email",
              "Date",
              "Time slot",
              "Room Name",
              "Price",
            ]}
            columns={[
              "fullname",
              "email",
              "booking_date",
              "time",
              "room_name",
              "room_price",
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
