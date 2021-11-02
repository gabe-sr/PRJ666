import React, { useState, useEffect, useCallback } from "react";
import WithLoadingSpinner from "../../HOC/loading-spinner/WithLoadingSpinner";
import WithMessage from "../../HOC/modal-messages/WithMessage";
import UserQueryForm from "./UserQueryForm";
import TableData from "../../shared/table_data/TableData";
import axios from "axios";
import { Container } from "react-bootstrap";
import { format } from "date-fns";

const UserReport = (props) => {
  const { setLoadingSpinner, setModalMessage } = props;

  const [data, setData] = useState();
  const [query, setQuery] = useState();
  const [textResponse, setTextResponse] = useState(null);

  const handleFetchReport = useCallback(
    async (_query) => {
      try {
        let response = await axios.get(`/reports/users?${_query}`);

        // format date/time
        response.data.forEach((b) => {
          b.time = new Date(b.booking_date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "UTC",
          });
          b.booking_date = format(new Date(b.booking_date), "dd-LLL-y, iii");
        });
        if (response.data.length === 0) {
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
    },
    [setLoadingSpinner, setModalMessage]
  );

  const handleQuery = (_query) => {
    setQuery(_query);
  };

  useEffect(() => {
    if (query) {
      setLoadingSpinner(true, "Generating report data...");
      handleFetchReport(query);
      setQuery(null);
    }
  }, [query, handleFetchReport, setLoadingSpinner]);

  return (
    <>
      <h3 className="text-secondary text-left p-3">User report</h3>
      <Container className="p-3 text-left">
        <UserQueryForm setQuery={handleQuery} />
        <hr />
        {!data || data.length === 0 ? (
          textResponse
        ) : (
          <TableData
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
            values={data}
          />
        )}
      </Container>
    </>
  );
};

export default WithLoadingSpinner(WithMessage(UserReport));
