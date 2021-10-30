import React, { useState, useEffect, useCallback } from "react";
import WithLoadingSpinner from "../../HOC/loading-spinner/WithLoadingSpinner";
import WithMessage from "../../HOC/modal-messages/WithMessage";
import UserQueryForm from "./UserQueryForm";
import TableData from "../../shared/table_data/TableData";
import axios from "axios";
import { Container } from "react-bootstrap";

const UserReport = (props) => {
  const { setLoadingSpinner, setModalMessage } = props;

  const [data, setData] = useState();
  const [query, setQuery] = useState();

  const handleFetchReport = useCallback(
    async (_query) => {
      setLoadingSpinner(false);
      try {
        console.log(_query);
        let response = await axios.get(`/reports/users?${_query}`);
        console.log(response.data);
        setData(response.data);
      } catch (err) {
        console.log(err);
      }
    },
    [setLoadingSpinner]
  );

  const handleQuery = (_query) => {
    setQuery(_query);
  };

  useEffect(() => {
    if (query) {
      handleFetchReport(query);
    }
  }, [query, handleFetchReport]);

  return (
    <>
      <h3 className="text-secondary p-3">User report</h3>
      <Container className="p-3 text-left">
        <UserQueryForm setQuery={handleQuery} />
        <hr />
        {!data ? (
          "No data to display"
        ) : (
          <TableData
            headers={[
              "Name",
              "Email",
              "Booking Date",
              "Room Name",
              "Room price",
            ]}
            columns={[
              "fullname",
              "email",
              "booking_date",
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
