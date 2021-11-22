import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { Row, Col, Modal, Button } from "react-bootstrap";
import QueryForm from "./QueryForm";
import "./MontlyTotalReport.css";
import NewTableData from "../../shared/table_data_new/NewTableData";
import WithLoadingSpinner from "../../HOC/loading-spinner/WithLoadingSpinner";
import WithMessage from "../../HOC/modal-messages/WithMessage";
import axios from "axios";
import { format } from "date-fns";
import ExcelComponent from "../../shared/excel-export/ExcelComponent";

const MonthlyTotalReport = (props) => {
  const [query, setQuery] = useState();
  const [month, setSelectedMonth] = useState();
  const [year, setSelectedYear] = useState();
  const [data, setData] = useState();
  const [total, setTotal] = useState();

  const [excelButton, setExcelButton] = useState(false);

  const { setLoadingSpinner, setModalMessage } = props;

  const handleQuery = (_query) => {
    setQuery(_query);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (query) {
      setLoadingSpinner(true, "Generating report data...");
      const fetchTotal = async () => {
        try {
          const response = await axios.get(`/reports/monthlytotal?${query}`);
          setData(response.data);
          let sum = 0;
          response.data.forEach((d) => {
            sum += d.total;
          });
          setTotal(sum.toFixed(2));
          setSelectedMonth(
            format(new Date(response.data[0].lastBookingDate), "M") - 1
          );
          setSelectedYear(
            format(new Date(response.data[0].lastBookingDate), "y")
          );
          setExcelButton(true);
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

  // redirect to user report page
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState();
  const history = useHistory();

  const MyModal = (props) => {
    return (
      <Modal
        size="sm"
        show={showModal}
        fullscreen={"lg-down"}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Body>
          Do you want to get the{" "}
          <span style={{ color: "#f39a71", fontWeight: "bold" }}>
            monthly report
          </span>{" "}
          for user{" "}
          <strong>{`${props.data.user.user.first_name} ${props.data.user.user.last_name}`}</strong>
          ?
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() =>
              history.push("/dashboard/report/month_user", props.data)
            }
          >
            Get report
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const ExcelButton = () => {
    if (excelButton) {
      return (
        <ExcelComponent
          columns={[
            { col: "user.fullname", label: "User Name" },
            { col: "user.email", label: "Email" },
            { col: "user.cpf_no", label: "CPF" },
            { col: "lastBookingDate", label: "Last booking at" },
            { col: "quantity", label: "Quantity" },
            { col: "total", label: "Total" },
          ]}
          values={data}
          name="Monthly_total_report"
          fileName={`${format(
            new Date(data[0].lastBookingDate),
            "MMMM"
          )}_total_report`}
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

  const redirectUser = (user) => {
    setShowModal(true);
    let query = `name=${user.user.first_name} ${user.user.last_name}&year=${year}&month=${month}&sort=byName&id=${user.user._id}`;
    setUserData({ user: user, month: month, year: year, query: query });
  };

  return (
    <>
      <div className="query-container">
        <h3 className="text-secondary mb-4">Monthly Total Report</h3>
        <QueryForm setQuery={handleQuery}>
          <ExcelButton />
        </QueryForm>
      </div>
      {showModal ? <MyModal data={userData} /> : null}
      {data ? (
        <>
          <NewTableData
            headers={[
              "User Name",
              "Email",
              "CPF",
              "Last booking at",
              "Quantity",
              "Total",
            ]}
            columns={[
              "user.fullname",
              "user.email",
              "user.cpf_no",
              "lastBookingDate",
              "quantity",
              "total",
            ]}
            values={data}
            whenClicked={redirectUser}
          />
          <Row className="total">
            <Col className="total-col" xs={{ span: 3, offset: 7 }}>
              Total for {month}
            </Col>
            <Col className="total-col result" xs={{ span: 2 }}>
              R$ {total}
            </Col>
          </Row>
        </>
      ) : null}
    </>
  );
};

export default WithLoadingSpinner(WithMessage(MonthlyTotalReport));
