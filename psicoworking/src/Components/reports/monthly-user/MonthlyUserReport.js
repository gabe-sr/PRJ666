import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { Row, Col, Modal, Button } from "react-bootstrap";
import QueryForm from "./QueryForm";
import "./MontlyUserReport.css";
import NewTableData from "../../shared/table_data_new/NewTableData";
import WithLoadingSpinner from "../../HOC/loading-spinner/WithLoadingSpinner";
import WithMessage from "../../HOC/modal-messages/WithMessage";
import axios from "axios";
import { format } from "date-fns";
import ExcelComponent from "../../shared/excel-export/ExcelComponent";

const MonthlyUserReport = (props) => {
  const [query, setQuery] = useState();
  const [prevQuery, setPrevQuery] = useState();

  const [data, setData] = useState();
  const [users, setUsers] = useState([]);
  const [showModalUsers, setShowModalUsers] = useState(false);

  const [excelButton, setExcelButton] = useState(false);

  const { setLoadingSpinner, setModalMessage } = props;

  const handleQuery = (_query) => {
    setQuery(_query);
  };

  const history = useHistory();
  if (history.location.state) {
    setLoadingSpinner(false);
    handleQuery(history.location.state.query);
    history.replace();
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (query) {
      setPrevQuery(query);
      setLoadingSpinner(true, "Generating report data...");
      const fetchTotal = async () => {
        try {
          const response = await axios.get(`/reports/monthly_user?${query}`);

          if (response.data.multiple === true) {
            setUsers(response.data.values);
            setShowModalUsers(true);
          } else {
            if (response.data[0].bookings.length > 0) {
              setData(response.data[0]);

              setExcelButton(true);
            } else {
              setModalMessage(
                true,
                "Report error",
                `There are no bookings for user ${query
                  .split("&")[0]
                  .substr(5)
                  .toUpperCase()} in the selected month.`
              );
            }
          }
        } catch (err) {
          console.log(err);
          setModalMessage(
            true,
            "Something went wrong",
            "We couldn't generate the report at this moment. Please, try again later."
          );
        } finally {
          setLoadingSpinner(false);
        }
      };
      fetchTotal();
      setQuery(null);
    }
  }, [query, setModalMessage, setLoadingSpinner]);

  const handleModalUsers = (usr) => {
    let temp = prevQuery.split("=");
    temp[1] = `${usr.first_name} ${usr.last_name}&year`;
    temp = temp.join("=");
    temp += usr._id;
    setQuery(temp);
    setShowModalUsers(false);
  };

  const ModalUsers = () => {
    return (
      <Modal
        className="user-modal"
        size="lg"
        show={showModalUsers}
        fullscreen={"lg-down"}
        backdrop="static"
        keyboard={true}
        centered
        onHide={() => setShowModalUsers(false)}
      >
        <Modal.Header closeButton>
          <h3>Select a user from the list</h3>
        </Modal.Header>
        <Modal.Body className="user-modal-body">
          <NewTableData
            headers={["User Name", "Email", "CPF", "Status"]}
            columns={["fullname", "email", "cpf_no", "active"]}
            values={users}
            whenClicked={handleModalUsers}
          />
        </Modal.Body>
      </Modal>
    );
  };

  const ExcelButton = () => {
    if (excelButton) {
      return (
        <ExcelComponent
          columns={[
            { col: "_id", label: "Booking Id" },
            { col: "booking_date", label: "Booking Date" },
            { col: "room_id.name", label: "Room Description" },
            { col: "price_at_booking", label: "Price at Booking (R$)" },
            { col: "_isCancelled", label: "Booking Status" },
          ]}
          values={data.bookings}
          name="Monthly_user_report"
          fileName={`${format(new Date(data.lastBookingDate), "MMMM")}_${
            data.user.first_name
          }_${data.user.last_name}_report`}
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
      <div className="query-container">
        <h3 className="text-secondary mb-4">Monthly Report by User</h3>
        <QueryForm setQuery={handleQuery}>
          <ExcelButton />
        </QueryForm>
      </div>
      {users ? <ModalUsers /> : null}
      {data ? (
        <>
          <NewTableData
            className="new-table-data"
            headers={[
              "Booking ID",
              "Booking Date",
              "Room Description",
              "Price at booking",
              "Booking status",
            ]}
            columns={[
              "_id",
              "booking_date",
              "room_id.name",
              "price_at_booking",
              "_isCancelled",
            ]}
            values={data.bookings}
            whenClicked={() => null}
          />
          <Row className="total">
            <Col className="total-col" xs={{ span: 3, offset: 7 }}>
              Total for {format(new Date(data.lastBookingDate), "MMMM")}
            </Col>
            <Col className="total-col result" xs={{ span: 2 }}>
              R$ {data.total}
            </Col>
          </Row>
          <span></span>
        </>
      ) : null}
    </>
  );
};

export default WithLoadingSpinner(WithMessage(MonthlyUserReport));
